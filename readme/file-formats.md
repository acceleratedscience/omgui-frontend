# File Formats

On top of supporting common molecular file formats like `mol`, `sdf` and `smi` for small molecules as well as `cif` and `pdb` for macromolecules, we use our own data structures that are used internally by OpenAD.

- **`mol.json`** - Small molecule data
- **`mmol.json`** - Macromolecule data (at this time only proteins are supported)
- **`molset.json`** - A set of small molecules or macromolecules

### mol.json

The small molecule data format is how the molecule viewer stores and interacts with small molecule data. When you open a `mol` file, it is converted into this format on the fly.

No visualization data is stored directly into this format, as it can easily be calculated on the fly.

```jsonc
{
    "name": "Foobar",
    "synonyms": ["foo", "bar"],
    "properties": {
        // molecular_weight: 1.234
    },
    "property_sources": {
        // molecular_weight: 'pubchem'
    },
    "analysis": [],
    "enriched": false,  
    "meta": {
        "notes": "",
        "labels:": [],
    }
}
```