# One More Weed

Original background generated with the built-in image-generation tool from the
user-approved minigame mockup and established Rowan design. The original mockup
and all previous game assets were preserved. `rematch.webp` is the optimized
production copy (about 500 KiB). Interactive weeds, buckets and controls are
drawn separately in `assets/garden-game.js` and `styles.css`.

Generation prompt:

> Edit this approved game mockup into a CLEAN BACKGROUND ART PLATE. Preserve exact widescreen composition, Rowan on right same face brown low bun blue eyes white tshirt straw hat, hand drawn textured anime art, garden framing and morning lighting. REMOVE ALL text, UI panels, scoreboards, timer, arrows, selection rings, labels, both foreground buckets, and ALL grass/weeds inside the rectangular soil bed. Fill removed areas with natural continuous background scenery or dirt. The large middle-left rectangular bed must be bare textured brown soil ready for interactive weeds layered later. Keep only ornamental flowers outside its border. Rowan still crouches right holding one weed, entire face visible. No text whatsoever, no interface, no MC. Preserve large empty soil play area approximately x15%-63%, y30%-72%. This is a polished original production garden minigame background.

Story: garden greeting → optional appearance/hat/care response → breakfast →
childhood chore memory → invitation → timed / untimed / decline → result → water.

Timed rounds last up to 45 seconds or until all 18 weeds are cleared. Untimed
rounds finish when all weeds are cleared. Pause, tab switching and loss of window
focus stop the clock. Resume always waits for the player. Progress is autosaved;
the pause menu can return to the main menu without losing the round.

Hidden `rowanAffection`: +1 for completing either mode, regardless of result;
-1 for declining. Applied once per playthrough through the event. Trust,
romance boundaries, promises and milestone unlocks are unchanged.

Existing approved Back Together music and outdoor ambience are reused. No music
was generated or replaced.

Desktop pulling revision: each weed receives a random 2–5-tug requirement when
the round is created. Requirements and partial attempts are saved. Older rounds
are upgraded without changing their clock, scores or removed weeds. A short
post-removal guard and explicit selection prevent input from spilling onto the
next weed. Soil particles and progressively stronger motion accompany tugs;
original synthesized rustles respect the existing sound and volume settings.

The wide `rematch.webp` illustration is exclusive to the minigame. Related
dialogue uses the existing `assets/cg/day-two/garden-reveal.webp` close view.
