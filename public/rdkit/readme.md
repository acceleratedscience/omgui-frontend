### About RDKit

RDKit is used for rendering molecule structures.

### About RDKit implementation

The RDKit library is not loaded from the npm package but instead from
a copy hosted by us, in the public folder, per the official instructions:
https://github.com/rdkit/rdkit-js?tab=readme-ov-file#option-1-use-the-npm-package-distribution-files

The RDKit library uses WebAssembly to run its C++ code in the browser.
However, due to security restrictions, WebAssembly modules must be
loaded from the same origin as the hosting webpage, or from an origin
that allows cross-origin resource sharing (CORS).

When you import a JavaScript module using import or require, the module's
code is bundled with your application's code by your build tool (like
Webpack or Rollup). This is fine for regular JavaScript modules, but it
doesn't work for WebAssembly modules because they need to be fetched
separately by the browser.

That's why the RDKit library instructs you to copy the .js and .wasm
files to your public assets directory and load the .js file with a

<script> tag. This way, the .js file can fetch the .wasm file from the
same origin, satisfying the security restrictions.

### Links

https://github.com/rdkit/rdkit-js
https://vue.rdkitjs.com/
