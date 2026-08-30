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

---

## Candidate replacement: "Inside my Tooth" (R-LAB)

https://sketchfab.com/3d-models/inside-my-tooth-5ebeadf0b40940ca93a4ced5cfe0abb2

CC BY 4.0, downloadable, 56,471 faces, 4 materials. Its description states:
"The tooth gums and blood vessels are individual objects so you can hide
sections of the model for your demonstration."

Download the **GLB** and save as `public/models/inside-tooth.glb`, then run:

    node scripts/inspect-model.mjs public/models/inside-tooth.glb

That reports every mesh name, triangle count, material and watertightness, so
we can map its parts before wiring anything in. Material count on the Sketchfab
page only hints at internal structure; this confirms it.

Notes for when it lands:
- The gums are NOT wanted. They are a separate object, so the fix is to omit
  that mesh rather than edit geometry.
- It ships 28 textures, which would dominate file size. Strip them; every layer
  gets its own material in ToothModel, so the source textures are unused.

ATTRIBUTION (required, CC BY 4.0) if this model is adopted:

    "Inside my Tooth" by R-LAB, licensed under CC BY 4.0
