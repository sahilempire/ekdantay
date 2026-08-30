# Tooth models

Two CC BY 4.0 assets. Both require visible attribution — see ATTRIBUTION below,
which must ship on the site (footer or /credits page).

## Expected files

| File | Source | Faces |
|---|---|---|
| `tooth-shell.glb` | Dundee Mandibular First Molar | ~27,600 |
| `tooth-canals.glb` | GIDPTD root canal system | ~15,900 |

Download the **GLB** conversion from each page, not the .gltf (which is a
multi-file bundle) and not the .obj.

- Shell:  https://sketchfab.com/3d-models/mandibular-first-molar-e1c919d6603846eca873154eeededdd6
- Canals: https://sketchfab.com/3d-models/sistema-de-conductos-de-un-molar-mandibular-f7f8a0877f314c4998f21d80ffc9a729

Both are MANDIBULAR (lower jaw, two roots). Do not substitute a maxillary
molar for the shell — it has three roots and will not match the canal system.

## ATTRIBUTION (required, CC BY 4.0)

    "Mandibular First Molar" by University of Dundee, School of Dentistry
    — licensed under CC BY 4.0

    "Sistema de conductos de un molar mandibular" by GIDPTD
    (Universitat de València) — licensed under CC BY 4.0

## Processing

Once both files are here:

    node scripts/derive-tooth-layers.mjs

That merges them and derives the enamel and dentin shells by offsetting the
outer surface inward along its normals, emitting `tooth.glb` with four named
meshes (enamel, dentin, pulp, root) for the exploded view. No Blender needed.
