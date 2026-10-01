# After the garden — implementation notes

Approved continuation starts at aWater after existing gAfter. Prior scene line positions and choices are unchanged. Existing completed garden saves resume normally.

The four conversation topics may be selected in any order, once each. Stable finite topic-mask nodes preserve selection history in ordinary saves. Leaving becomes available after the first topic, including postponing Lola's story. No new affection or trust adjustments are applied.

New original generated art, optimized WebP:
- assets/cg/after-garden/quiet.webp: only after hearing Lola's story, when Rowan places the glass within reach.
- assets/cg/after-garden/wave-v2.webp: the final wave across the lane.
Both use Rowan's established cardigan, hair, eyes and earrings. Existing art is preserved. Unlocks use the existing gallery.

Existing music reused, at the day-two mixer level with two-second transitions:
- Catching up: water, television and ordinary porch topics.
- The letters: Lola's conversation and its responses.
- Back together: topic returns, evening farewell and bedtime.
- Ending: music fades away, quiet outdoor ambience remains.
Existing phone notification is used for authored night texts. No generated or downloaded music, voice acting or additional effects.

The news describes Nicolas Sanchez taking office after his father's retirement, as in the approved draft. It does not reveal Rowan's connection. Private identity/profile remains Rowan only.

Night texts use the existing phone UI, 21:48 timestamps, and history-gated messages. Skipping the reply has no penalty. The childhood scare callback follows the garden greeting choice.

Validation: 67 tests pass, including all after-garden branches, serialization, topic ordering, previous saves, CG timing, and phone message visibility. Desktop UI checked using isolated review saves; actual player saves were not altered.

Wave v2 corrects standing proportions and opens the gate to show complete legs and footing. The original wave.webp is retained.
