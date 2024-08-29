# OpenAD GUI

_Open Accelerated Discovery Graphical User Interface_

This is a sub-repository to the main [OpenAD repo]. It contains the GUI which is built in [Vue.js with Vite](readme/vue-vite.md).

---

<br>

### Getting started

#### First time initialisation

        npm install

#### Running the development version

    First we need to launch the OpenAD application.

        cd <openad_path>
        openad

    With OpenAD running, we need to activate the GUI Flask server, so our development server can connect to the API. This will open a browser window, which you can close.

        launch gui

    Now we're ready to launch the development server in its own terminal.

        cd <openad-gui_path>
        npm run dev

    > **Note:** While the development server will reflect any changes on the fly, you'll still need to restart the OpenAD application for any changes to the backend to take effect.

#### Creating the production build

        npm run build

<br>

### How things work

#### File Browser

-   [OpenAD repo] - File content is read as a string by `get_file()` in `openad/gui/api/file_system_api.py` and attached to a file data object.
-   The file data object will look something like this:

```json
{
	"_meta": {
		"errCode": null,
		"ext": "txt",
		"ext2": null,
		"fileType": "text",
		"size": 120,
		"timeCreated": 1724857839569.6558,
		"timeEdited": 1724856402224.3848
	},
	"data": "hello, world",
	"filename": "example.txt",
	"path": "foobar/example.txt",
	"pathAbsolute": "/Users/johndoe/.openad/workspaces/DEFAULT/foobar/example.txt"
}
```

-   Depending on the file type, the `data` attribute will contain a string (for text-based files) or an object (for structured data files).
-   Different file types (as defined by the file extension) will open in different file viewers. To see how file extensions are mapped to the appropriate file viewer, see [below](#adding-support-for-new-file-types).
    -   <ins>Molecule viewer:</ins> For displaying `.mol.json` files, which contain an OpenAD-native molecule object. Industry-standard molecules file formats like `.pdb` and `.mol` are translated on-the-fly and will also open in the molecule viewer.
    -   <ins>Molecule set viewer:</ins> For displaying `molset.json` files, which contain a list of OpenAD-native molecule objects. Industry-standard molecule set files like `.sdf` or `.smi` are translated on-the-fly and will also open in the molecule set viewer.
    -   <ins>Data viewer:</ins> For `.csv` files and Jupyter dataframes.
    -   <ins>Text viewer:</ins> For text-based files like `.txt`, `.md` and `.yml`
    -   <ins>JSON viewer:</ins> For `.json` files
    -   All other files (eg. `.pdf`) will be opened by the native application of your operating system (eg. Preview on macOS).
-   On-the-fly translation of file formats happens under `fs_attach_file_data()` in `openad/workers/file_system.py` in the [OpenAD repo].
-   The file object and its data is then consumed by `loadItem()` in the FileStore.

<br>

### Developer Guides

#### Adding support for new file types:

-   Add the file extension to `_get_file_type()` in `openad/workers/file_system.py` in the [OpenAD repo].
-   Add the display name and correct viewer to `_map_FileType` in `src/utils/maps.ts`

[OpenAD repo]: https://github.com/acceleratedscience/open-ad-toolkit
