# Rowan art generation record

Mode: built-in image generation. User supplied and authorized the original design at `assets/references/rowan-original.png`. The following reusable prompt set records the identity constraints and expression/location instructions used. Generated files were copied into the asset folders without painted-over backgrounds or manual expression edits. Requested square resolution was normalized by the tool to 1254 × 1254.

## Neutral alignment master

Use case: identity-preserve. Edit the user's original Rowan illustration. Create one transparent-background visual novel sprite: neutral, without book. Preserve this 23-year-old man's brown tousled hair and low tied bun on viewer right, blue eyes, earrings, facial structure, gray patterned cardigan with ribbed trim and pale gray crew-neck shirt. Match original hand-drawn anime rough textured brown linework, subtle crosshatching, soft muted shading, no glossy digital redesign. Keep identical head angle and bust framing, head crown at top center, face at the same position as reference. Remove book and lower hands naturally out of the bottom edge, reconstruct shirt. Small closed neutral mouth, attentive eyes. Square canvas, transparent alpha outside character, chest-up bottom crop, do not crop hair sides. No text, shadows behind character, or painted checkerboard. This becomes the alignment master.

Output: `assets/portraits/rowan/neutral.png`.

## Expression edits

Edit the exact transparent master PNG, only changing expression. Keep exact canvas, head angle, head/body position, scale, hair silhouette, low bun, earrings, facial structure, gray patterned cardigan and pale shirt. Same textured brown anime pencil linework, crosshatching and soft muted shading. No book; genuine alpha; no background, checkerboard or text. Alignment is essential.

- `smile.png`: warm smile, relaxed kind eyes, softly lifted open mouth.
- `playful.png`: playful asymmetric grin, one raised eyebrow, affectionate rather than smug.
- `embarrassed.png`: shy smile, stronger soft flush, slightly averted gaze, no new gesture.
- `concerned.png`: inner brows raised and knit, attentive eyes, slightly parted mouth.
- `sad.png`: downturned mouth, tired softened eyes, restrained grief without dramatic tears.
- `surprised.png`: lifted brows, eyes slightly wider, softly open mouth, no caricature.

All outputs are in `assets/portraits/rowan/`.

## Book edit

Use the neutral master and original reference. Preserve exact 1254 square frame, head/body position, identity, outfit and style. Reintroduce the book and hands at lower left as in the original pose, with a warm smile. Faint pencil illustrations on pages, no readable text. Transparent background.

Output: `assets/portraits/rowan/book.png`.

## Background shared direction

Use case: illustration-story. Input is a style reference only; do not include the character. One full-bleed landscape 1536 × 1024 visual novel background. Match hand-drawn anime with visibly textured warm brown pencil outlines, restrained crosshatching, soft hand-painted shading, muted sea-glass blue/green, linen cream, warm gray, dusty rose and paper texture. Flat illustrated depth; no photo, 3D, glossy or vector look. Medium-low contrast and understated detail keep the sprite the focal point. Quiet foreground lower quarter, coherent guesthouse direction, no interface or watermark.

Location instructions and outputs in `assets/backgrounds/`:

- `exterior-illustrated.png`: cream two-story house on right, terracotta roof, blue door, wooden porch and sage railings, jasmine and hydrangeas, sea left, warm summer afternoon.
- `living-illustrated.png`: wooden table with two cream cups and one yellow cup, lemon recipe card, sage sofa, cabinets, linen window facing sea, soft amber daylight.
- `bedroom-illustrated.png`: desk below sea-facing linen window, bed with faded blue quilt left, sorting boxes right, chair and lamp, late afternoon.
- `street-illustrated.png`: muted cream and sage shops, striped chip-shop awning, stone promenade, harbor wall and sea; no people or readable signs.
- `pier-illustrated.png`: salt-worn wooden railings and posts, sea, distant sailboat and coast, pale peach dawn.
- `pier-day.png`: lighting-only edit of dawn pier. Preserve geometry, objects and composition. Remove dawn sun and peach wash; pale cloudy summer-blue sky and daytime seawater. Same pencil texture, soft shading and muted palette, 1536 × 1024.
