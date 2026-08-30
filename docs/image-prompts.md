# Scroll sequence image prompts

Nine images. The sequence zooms from a skull down to one tooth, then opens it
layer by layer, and each layer is tied to a treatment the clinic actually sells.

**Generate them all in one session, in this order.** Image models hold style
across a conversation and drift between them, and consistency matters more here
than any single image being perfect. If one comes out wrong, regenerate it in
the same session rather than starting fresh later.

---

## The style block

Paste this at the end of EVERY prompt, unchanged. It is what makes nine
separate generations look like one set.

```
STYLE: photorealistic 3D medical illustration, soft studio lighting from the
upper left, gentle specular highlights, clean and clinical but warm.
BACKGROUND: pure solid black, no gradient, no vignette, no glow, no fog.
STRICTLY NO text, NO labels, NO callout lines, NO arrows, NO numbers,
NO watermarks, NO measurement marks.
Subject perfectly centred, straight-on front view unless stated otherwise.
High detail, 4K, vertical 3:4 framing.
```

Pure black matters more than anything else in that block: it is what lets the
subject be keyed out to transparency with clean edges. A glow or gradient
bleeds grey fringing when cut, and the composite you generated first had
exactly that.

---

## 1. Skull  →  hero

```
A human skull in three-quarter view, jaw closed, teeth visible.
Anatomically accurate, adult, clean bone.
Occupying the middle of the frame with clear empty space around it.

[STYLE BLOCK]
```

## 2. Lower jaw arch  →  "Your tooth, explained"

```
A human lower jaw (mandible) with a full arch of teeth, seen from a raised
three-quarter angle so the biting surfaces of the teeth are visible.
Clean bone, natural pearl-white teeth.

[STYLE BLOCK]
```

## 3. Single molar in bone  →  transition into the tooth

```
A single human lower molar tooth seated in its bone socket, with the
surrounding bone cut away in cross-section to show the root sitting in the
jaw, and a thin margin of pink gum tissue at the neck of the tooth.
Straight-on front view.

[STYLE BLOCK]
```

## 4. Exploded tooth  →  the centrepiece

This is the important one. It carries four of the nine beats.

```
A single human lower molar tooth in an EXPLODED VIEW, separated vertically
into its anatomical parts, floating apart with generous empty black space
between each part:

TOP: the enamel — the outer crown cap only, hollow underneath, glossy pearl
white, showing its wall thickness at the cut edge.

BELOW IT: the dentin — the crown core, warm ivory-cream, finely striated.

BELOW THAT: the pulp chamber and nerve — deep red-pink soft tissue shaped
like the inside of the tooth, with fine red and blue blood vessels and
yellow nerve fibres trailing downward.

BOTTOM: the two roots, split apart to the left and right, pale cream
cementum, each hollow along its length to show the root canal.

EXPLODED VIEW, straight-on front view, perfectly centred and symmetrical.
Each part completely separated by clear black space. Parts must NOT touch,
overlap, or cast shadows onto each other.

[STYLE BLOCK]
```

## 5. Whole tooth  →  hero and the closing beat

Generate this immediately after #4 so the model holds the same framing.

```
A single human lower molar tooth, whole and intact, glossy pearl-white
enamel crown and two pale cream roots.
IDENTICAL camera angle, distance, scale and lighting to the exploded tooth.
Straight-on front view, perfectly centred.

[STYLE BLOCK]
```

---

## Service-specific images

Each of these carries one treatment beat.

## 6. Whitening  →  ₹3,500 / session

```
A single human lower molar tooth, straight-on front view, split down the
middle vertically: the LEFT half stained and yellowed, the RIGHT half
bright glossy white. The transition between them is clean and vertical.
Same camera angle and scale as the whole tooth.

[STYLE BLOCK]
```

## 7. Orthodontics  →  ₹45,000 / treatment

```
A human lower jaw arch of teeth seen from the front, with clear ceramic
orthodontic brackets and a thin archwire fitted across the front teeth.
Teeth naturally aligned, clean and bright.

[STYLE BLOCK]
```

## 8. Dental implant  →  ₹25,000 / tooth

```
A titanium dental implant screw seated in a cross-section of jaw bone, with
a ceramic crown fitted on top, beside one natural tooth for comparison.
The bone is cut away so the threaded implant post is visible inside it.
Straight-on front view.

[STYLE BLOCK]
```

## 9. Emergency care  →  24/7

```
A single human lower molar tooth with a visible vertical crack running from
the biting surface down the side of the crown, and a small area of dark
decay near the gum line. Otherwise clean and glossy.
Straight-on front view, same camera angle and scale as the whole tooth.

[STYLE BLOCK]
```

---

## What happens to them here

Each image gets keyed to transparency, cut into parts where needed (image 4
becomes five separate transparent layers), converted to WebP and wired to the
beats. Expect roughly 500 KB for the whole set, against 2,957 KB for the
current GLB plus the three.js chunk, and no WebGL requirement at all.

The scroll then moves through scales rather than rotating one object: skull,
to jaw, to a tooth in bone, to that tooth opening layer by layer, with each
layer naming the treatment that addresses it.

## If a generation comes out wrong

The two failure modes worth regenerating for are **a glow or gradient behind
the subject**, which ruins the cut-out, and **parts touching each other** in
image 4, which makes them impossible to separate cleanly. Everything else -
colour, exact proportions, framing - can be corrected in code.
