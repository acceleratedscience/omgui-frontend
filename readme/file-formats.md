# File Formats

On top of supporting common molecular file formats like `mol`, `sdf` and `smi` for small molecules as well as `cif` and `pdb` for macromolecules, we use our own data structures that are used internally by OpenAD.

- **`mol.json`** - Small molecule data
- **`mmol.json`** - Macromolecule data (at this time only proteins are supported)
- **`molset.json`** - A set of small molecules or macromolecules

<br>

### 1. Small molecules: `mol.json`

The small molecule data format is how the molecule viewer stores and interacts with small molecule data. When you open a `mol`, `sdf` or `smi` file, its content is converted into this format on the fly.

In addition to molecule-related data, this format also allows us to store user-generated data like notes and labels.

No visualization data is stored directly into this format, as it can easily be calculated on the fly based on the InChI or SMILES string.

```jsonc
{
    // The main name of this molecule.
    "name": "Foobar",

    // Alternative names this molecule is know by.
    "synonyms": ["foo", "bar"],
    
    // Available molecular properties.
    "properties": {
        // molecular_weight: 1.234
    },

    // The sources of the properties.
    // Eg. pubchem, RDKit, etc.
    "property_sources": {
        // molecular_weight: 'pubchem'
    },

    // Any analysis result values.
    // See the analysis example below.
    "analysis": [],
    
    // This flag indicates if the molecule data was
    // enriched with data from PubChem.
    "enriched": false,
    
    // User-generated information.
    "meta": {
        "notes": "",
        "labels:": [],
    }
}
```

An analysis example:

```jsonc
{
    "toolkit": "RXN",
    "function": "Predict_Retrosynthesis",
    "smiles": "CCOC(=O)C(CCc1ccccc1)NC(C)C(=O)N1C(C(=O)O)CC2CCCC21",
    "parameters": {
        "max_steps": 3
    },
    "results": {
        "0": {
            "confidence": 0.999,
            "reactions": [
                "C1CCOC1 + CCOC(=O)C(CCc1ccccc1)NC(C)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21 + [Pd] --->> CCOC(=O)C(CCc1ccccc1)NC(C)C(=O)N1C(C(=O)O)CC2CCCC21",
                "CC(=O)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21 + CCO + CCOC(=O)C(N)CCc1ccccc1 + [BH3-]C#N.[Na+] --->> CCOC(=O)C(CCc1ccccc1)NC(C)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21",
                "CC(=O)C(=O)Cl + O=C(OCc1ccccc1)C1CC2CCCC2N1 + c1ccncc1 --->> CC(=O)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21"
            ]
        },
        "1": {
            "confidence": 0.999,
            "reactions": [
                "C1CCOC1 + CCOC(=O)C(CCc1ccccc1)NC(C)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21 + [Pd] --->> CCOC(=O)C(CCc1ccccc1)NC(C)C(=O)N1C(C(=O)O)CC2CCCC21",
                "CC(=O)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21 + CCO + CCOC(=O)C(N)CCc1ccccc1 + [BH3-]C#N.[Na+] --->> CCOC(=O)C(CCc1ccccc1)NC(C)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21",
                "CC(=O)C(=O)Cl + O=C(OCc1ccccc1)C1CC2CCCC2N1 --->> CC(=O)C(=O)N1C(C(=O)OCc2ccccc2)CC2CCCC21"
            ]
        },
    },
}
```


### 2. Macromolecules: `mmol.json`

The macromolecule format is a more simplistic wrapper around a `cif` file. Unlike small molecules, macromolecules require that the 3D visualisation data is stored the file, as it cannot be calculated on the fly.

Hence the main purpose of this format is to be able to store user-generated data like notes and labels.

```jsonc
{
    // Currently only protein molecules are supported,
    // but in the future this could be dna, rna, ligand, etc.
    "molType": "protein",

    // Available data for this macromolecule
    "data": {
        // idcode: 12AB
    },

    // CIF data (or alternative) that is used to generate the 3D
    // rendering of the molecule using the open source Miew viewer.
    "data3D": "", 
    
    // Usually 'cif', however this could be any type of data that
    // can be consumer by the Miew 3D molecule viewer we use:
    // cif, pdb, xyz, cml, gro, ccp4, mol2, dsn6, mmtf
    "data3DFormat": "",
    
    // User-generated information
    "meta": {
        "notes": "",
        "labels:": [],
    }
}
```