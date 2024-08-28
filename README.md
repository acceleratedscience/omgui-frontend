# OpenAD GUI

> Open Accelerated Discovery Graphical User Interface

This is a sub-repository to the main [OpenAD repo].

### Initialisation

    npm install

### Launching the development server

    npm run dev

### Creatig the production build

    npm run build

### Developer Guides

#### To add support for new file types:

-   Add the file extension to `_get_file_type()` in `openad/workers/file_system.py` in the [OpenAD repo].
-   Add the display name and correct viewer to `_map_FileType` in `src/utils/maps.ts`

[OpenAD repo]: https://github.com/acceleratedscience/open-ad-toolkit
