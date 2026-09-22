# Asset handoff — Rowan

The official design is the user's original illustration, preserved unchanged at `assets/references/rowan-original.png`. Rowan is 23, he/him. Additional art was created with built-in image generation using that design as the identity and style anchor. No stock art is used.

## Finished sprites

`assets/portraits/rowan/` contains eight transparent 1254 × 1254 RGBA PNGs: `neutral.png`, `smile.png`, `playful.png`, `embarrassed.png`, `concerned.png`, `sad.png`, `surprised.png`, and `book.png`.

The seven ordinary expressions share a no-book bust pose. The book pose is used while sorting illustrated books. Brown hair, low bun, blue eyes, earrings, gray patterned cardigan, pale shirt and textured brown linework follow the reference. All sprites share their canvas and display frame. Small generated linework differences remain; the alpha-bound audit records at most four pixels of variation at the crown. The book deliberately extends farther left.

## Finished locations

| Location | File in assets/backgrounds |
| --- | --- |
| Guesthouse exterior | exterior-illustrated.png |
| Living room | living-illustrated.png |
| Bedroom | bedroom-illustrated.png |
| Seaside street | street-illustrated.png |
| Old pier, daytime | pier-day.png |
| Old pier, dawn | pier-illustrated.png |

Backgrounds are 1536 × 1024 illustrations with soft shading, paper texture, brown pencil lines and muted seaside colors. Evening and night reuse the locations with CSS lighting. Dawn has its own pier painting. Images crop responsively; the dialogue panel has an opaque cream surface for readability.

## Integration and replacement

`assets/manifest.json` owns file paths and lighting variants. `src/staging.js` owns explicit scene and line cues, including book presence and expression changes. Sprites use a fixed scene-level frame so changing dialogue length cannot move Rowan's face. The title screen's Rowan gallery previews every sprite and location. The phone uses the original illustration as his avatar.

To replace an asset, retain its canvas/framing and change its manifest path. Saves store stable story locations rather than asset paths. Old authored history is refreshed to current pronouns when loaded; player choices and phone messages are preserved.

The old SVG backgrounds and placeholder portraits are archived, unused assets. `tools/build-art.mjs` only rebuilds those legacy vectors. Run `powershell -File tools/audit-art.ps1` to check PNG alpha and framing; results are in `docs/ART-AUDIT.json`.

## Optional future assets

No requested Rowan expression remains unfinished. Later chapters may add wardrobe changes, dedicated night paintings, keepsake close-ups and music. Current audio is original synthesized surf; no voice acting or licensed music is included.

See `ART-PROMPTS.md` for the generation brief and prompt set.

## Centered staging and event CGs

The active layout now places Rowan in a centered art row above the dialogue. Text, choices and navigation occupy separate rows; narrow screens stack choices and allow vertical scrolling. Event paintings remain fully visible rather than cropping faces or hands. Desktop side fill uses a blurred copy of the same cached image.

Five new original event illustrations appear at authored moments, without changing story text or choices:

| Asset in assets/cg | Story cue |
| --- | --- |
| reunion.webp | Rowan appears on the porch with the door latch |
| promises.webp | The childhood promise list is read |
| laughter.webp | The seaside shelter and shared chips |
| third-cup.webp | Rowan stops over the extra yellow cup |
| beginning.webp | Agreeing to aim for tomorrow's sunrise |

The happy moment is appropriate on both friendship and romantic routes. The milestone depicts planning the sunrise, not completing a promise early. `cgAt` in `src/staging.js` resolves illustrations from existing node/line positions, including filtered conditional dialogue. Loading an older save therefore selects the appropriate image without a save migration.

All five optimized WebP files total 1,117,024 bytes (about 1.1 MB); each is 1536 × 1024 and under 253 KB. PNG masters are retained for later art work but never requested by the game. No new runtime dependencies were added. Only the current CG is loaded, not the entire set. See `CG-PROMPTS.md` for the exact built-in image-generation prompts.

## Current standing sprite revision

Active sprites now live in `assets/portraits/rowan-standing/`: all seven expressions and the illustrated-book pose are transparent 1024 × 1536 PNGs. They include the complete torso, arms, hips and upper legs. The older 1254-square bust sprites above are archived, no longer scene assets. The official original reference remains unchanged.

The standing artwork is centered and extends below the dialogue to avoid a floating chest crop. The seven ordinary expressions share essentially identical silhouette bounds (at most one pixel difference at the right edge); the book pose intentionally changes the arms. Alpha and dimensions are recorded in `STANDING-ART-AUDIT.json`. Exact built-in image-generation prompts are in `STANDING-SPRITE-PROMPTS.md`.

CG presentation now shows the complete image at a reduced scale with a plain slate cinematic surround. This supersedes both the earlier blurred surround and the later zoomed cover crop. No CG artwork, story cue, or smooth-transition behavior was changed.
