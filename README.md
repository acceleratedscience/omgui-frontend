<!-- Describe build process and post build script to rename index.html -->

# OMGUI - Frontend

This repository holds the GUI frontend code for the [OMGUI] library.

The OMGUI frontend is written in [Vue.js] with [Vite] as build tool, using the composition API with [TypeScript] and [SCSS]. The molecule viewer relies on [RDKit] for 2D visualization and [Miew] for rendering interactive 3D molecules. It's based on the [Carbon Design System].

<br>

## Running Development Server

To run the frontend development server, you first need to launch the OMGUI server.

```shell
pip install omgui
```

```python
import omgui

omgui.launch()
```

Now launch the development server in a separate terminal.

```shell
npm run dev
```

<br>

## How things work

### Build Process

OMGUI supports a custom base path. To pull this off, the frontend build is exported with a hardcoded `__BASE_PATH__` which is replaced on the fly by the server. The base path is set in [index-build.html](index-build.html) as a `<base>` tag, which takes care of native browser URLS, and in `vite.config.ts` from where it's loaded into the Vue router, taking care of all Vue-managed links.

To build locally:

```shell
npm run build
```

<br>

### Publishing New Version

1. Publish a [new release](https://github.com/acceleratedscience/omgui-frontend/releases) on GitHub, respecting [semantic versioning](https://semver.org)
2. The [release-build.yaml](.github/release-build.yaml) action will run the build script and store the build files as `dist.tar.gz` alongside the source code of your release. It will take 1-2 minutes to appear, you can follow the process under the [Actions](https://github.com/acceleratedscience/omgui-frontend/actions/workflows/release-build.yml) tab.
3. In the OMGUI repo, update the `OMGUI_FRONTEND_VERSION` environment variable to the new version number (exluding the 'v' prefix) in both your `.env` and the [`.env-example`](https://github.com/acceleratedscience/omgui/blob/main/.env-example) file.
4. OMGUI will automatically download the frontend code on the first launch, and will update it whenever a new version number has been detected. The installation process extracts the contents of `dist.tar.gz` and stored them under `/omgui/gui/client`.

<br>

### File Browser

-   [OMGUI] - File content is read as a string by `get_file()` in `openad/gui/api/file_system_api.py` and attached to a file data object.
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
-   Different file types (as defined by the file extension) will open in different file viewers. In `ViewerDispatch.vue` the correct viewer is loaded by `loadModule()` and then the file data is transferred into the appropriate viewer store by `parseRoute()`. To see how file extensions are mapped to the appropriate file viewer, see [below](#adding-support-for-new-file-types).
    -   <ins>Molecule viewer:</ins> For displaying `.smol.json` files, which contain an OpenAD-native molecule object. Industry-standard molecules file formats like `.pdb` and `.mol` are translated on-the-fly and will also open in the molecule viewer.
    -   <ins>Molecule set viewer:</ins> For displaying `molset.json` files, which contain a list of OpenAD-native molecule objects. Industry-standard molecule set files like `.sdf` or `.smi` are translated on-the-fly and will also open in the molecule set viewer.
    -   <ins>Data viewer:</ins> For `.csv` files and Jupyter dataframes.
    -   <ins>Text viewer:</ins> For text-based files like `.txt`, `.md` and `.yml`
    -   <ins>JSON viewer:</ins> For `.json` files
    -   All other files (eg. `.pdf`) will be opened by the native application of your operating system (eg. Preview on macOS).
-   [OMGUI] - On-the-fly translation of file formats happens under `fs_attach_file_data()` in `openad/workers/file_system.py`.
-   The file object and its data is then consumed by `loadItem()` in the FileStore.

<br>

## Developer Guidelines

### Adding support for new file types:

-   [OMGUI] - Add the file extension to `_get_file_type()` in `openad/workers/file_system.py`.
-   Add the display name and correct viewer to `_map_FileType` in `src/utils/maps.ts`

### Adding support for new molecules file types:

-   Update `parseRoute()` in `ViewerDispatch.vue` to ensure the filetype results into the correct loading of data into the store.
-   Update `setMolData()` in `MolViewerStore.ts` if needed.
-   Update `actionSaveAs()` in `OverflowMenuMol.vue` to ensure the correct options are displayed in the overflow menu, and ensure the delete option is also included.

[OMGUI]: https://github.com/acceleratedscience/omgui
[Vue.js]: https://vuejs.org
[Vite]: https://vite.dev
[TypeScript]: https://www.typescriptlang.org
[SCSS]: https://sass-lang.com
[RDKit]: https://github.com/rdkit/rdkit#readme
[Miew]: https://github.com/epam/miew#readme
[Carbon Design System]: https://carbondesignsystem.com
