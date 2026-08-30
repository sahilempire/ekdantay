# Licence request — Ebers "Tooth cross-section"

Send via the message button on https://sketchfab.com/ebers
(model: https://sketchfab.com/3d-models/tooth-cross-section-9cc281349c314cc4859e26af238f9cd5)

---

**Subject:** Licence enquiry — "Tooth cross-section" for a dental clinic website

Hello,

I'm building the website for Ekdantay Dental Clinic, a small practice in
Sawai Madhopur, Rajasthan. We have a scroll-driven section that walks a patient
through the anatomy of a tooth layer by layer, to explain what each treatment
actually involves.

Your "Tooth cross-section" model is exactly right for it — the four separated
layers (enamel, dentin, pulp, neurovascular bundle) are precisely what the
sequence needs, and we have not found anything comparable.

The model is currently view-only, so I wanted to ask directly:

1. Is it available to license for use on a commercial website?
2. If so, what would that cost for a single-site, web-only use?

For context on scale and use:
- One clinic website, not resale or redistribution
- Web only — the asset would ship as a compressed, decimated glTF, not as
  source files
- Happy to credit you visibly on the page, and to agree to any restrictions
  you would like on how it is delivered

If a full licence isn't something you offer, we would also be glad to
commission something smaller, or to purchase through whichever marketplace
you prefer.

Thank you for considering it.

[your name]
Ekdantay Dental Clinic
info@ekdantay.com

---

## If they say yes

Run `node scripts/inspect-model.mjs <file>` first to confirm the mesh
structure, then map the part names into `NODE_MATCHERS` in
`components/scrollstory/ToothModel.tsx`. The loader already handles arbitrary
node names; a licensed layered model needs a mapping entry, not a rewrite.

Attribution goes in `modelCredits` in `content/clinic.ts`, which renders in
the footer.
