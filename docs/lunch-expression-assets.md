# Lunch expression continuity

Installed four expression variants in `assets/cg/chapter-two/lunch-expressions-v1/`.
The original `assets/cg/chapter-two/lunch.webp` remains unchanged and supplies relaxed, warm and reassuring smiles. Wistful also supplies the brief disappointed response on the solo route.

Built-in image generation edited the original lunch CG separately for each expression. Original generated PNGs are retained alongside WebP delivery copies. Conversion changes file format only.

Shared prompt: Edit the existing visual-novel CG, changing only Rowan's facial expression. Preserve camera framing, head tilt, hair, cheek-supporting hand, body pose, cardigan, white shirt, room, seaside view, sunlight, food and tableware. Same identity and illustration style. No zoom, crop, text or UI.

- Attentive: neutral closed mouth, relaxed brows and focused blue eyes directed at the MC.
- Worried: smile gone, inner brows raised and drawn together, concerned eyes and slightly parted lips; not angry.
- Wistful: slightly lowered eyes, soft sad closed mouth, subtle sadness without tears.
- Embarrassed: natural cheek blush, sheepish smile and slightly raised brows; no cartoon symbols.

`src/lunch-art.js` contains the approved line anchors and branch exits. It changes presentation only. Original script, choices, effects and save fields remain unchanged. Save thumbnails and gallery art use the same manifest entries as gameplay.

Images preload during the lunch lead-in; the existing renderer decodes replacements before crossfading and respects reduced motion. CG framing remains the same across variants.

Verified all three choice buttons retain the CG, branch replies retain the CG, and all three approved scene exits return to sprites. Seven focused tests and the desktop browser check passed.
