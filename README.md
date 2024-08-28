# OpenAD GUI

_Open Accelerated Discovery Graphical User Interface_

This is a sub-repository to the main [OpenAD repo]. It contains the GUI which is built in [Vue.js with Vite](readme/vue-vite.md).

---

### Getting started

-   Initialisation

        npm install

-   Launching the development server

        npm run dev

-   Creatig the production build

        npm run build

### How things work

#### File Browser

-         [OpenAD repo] - File content is read as a string by `get_file()` in `openad/gui/api/file_system_api.py` and attached to a file data object.
-         The file data object will look something like this:

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

-         The file object is then consumed by `loadItem()` in the FileStore.

### Developer Guides

#### Adding support for new file types:

-   Add the file extension to `_get_file_type()` in `openad/workers/file_system.py` in the [OpenAD repo].
-   Add the display name and correct viewer to `_map_FileType` in `src/utils/maps.ts`

[OpenAD repo]: https://github.com/acceleratedscience/open-ad-toolkit
