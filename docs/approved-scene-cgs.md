Approved scene artwork integration

- Nestor: cleaned introduction CG, with no Rowan, grocery bags or tricycle; appears during introductions and returns to an empty workshop background with Rowan's sprite.
- Grave arrival: separate solo/accompanied CGs. The comfort CG requires both graveTogether and c2GraveStay. Four bouquet variants follow c2Flowers.
- Mayumi: nighttime porch CG facing the door; returns to sprites when she turns (or the recognition pause on the solo route).
- Rowan and Mayumi share the frame only when both are present. On a solo return, Rowan joins after his arrival line.
- Original assets are retained. New artwork is in assets/cg/chapter-two/scene-approved-v1, with optimized WebP copies for runtime.
- No story lines, choice effects, node order, save schema or audio cues were changed in this integration.

Validation: desktop browser route checks in tools/check-approved-scene-art.mjs; branch and flower checks in tests/approved-scene-art.test.mjs.
