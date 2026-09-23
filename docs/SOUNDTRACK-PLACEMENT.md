# Approved opening soundtrack

Integrated after the user confirmed all eight tracks and approved the placement plan. Original Downloads files, existing audio and synthesized music demos are preserved. Project copies and their source filenames are listed in `assets/audio/soundtrack/sources.json`.

| Track | Start / end | Relative level before master volume |
| --- | --- | --- |
| The Slow Breath of Cedar | Sea appears → funeral thought | 55% |
| Morning at the Edge of Sight | “Then I remember Lola’s funeral.” → conductor call | 43% |
| Inside City Bus Sound Effect | Initial bus ambience; conductor call → driver help; continues quietly through drop-off | 26%, lowered to 12% under music |
| Sunday Morning Strums | Driver waives fare → after “Ingat.” | 52% |
| First Light in the Orchard | MC turns toward hill → Rowan’s house decision | 50%, lowered to 36% for grief |
| Sunday Window Light | “Rowan’s house is right there.” → repair scene, both branches | 46% |
| hammer-and-seaside-outdoors.wav | Repair scene begins → “Excuse me!” | 75%; plays once, never loops |
| Afternoon in Amber | Recognition CG → section end | 53% |

Scene fades generally last 3 seconds; kindness and reunion use 2 seconds. Conductor transition is 0.45 seconds. The hammer fades out in 0.12 seconds at MC’s call. An original outdoor-only layer accompanies the repair scene at low volume and continues after hammer playback ends, so slow readers don't lose ambience. It remains under reunion music. No duplicate procedural music plays over the supplied tracks.

Music and ambience repeat with a 2-second whole-file crossfade (shorter for very short files). These are general repeat fades, not manually auditioned beat-matched loop edits. Track mood and relative gain were assigned from the approved scene plan; no claim is made that these files were audibly mastered or loudness-normalized. Settings provides master volume and a music/ambience toggle, off by default unless previously enabled.

Next does not restart a matching track. Save/load restores the correct cue for the saved line, starting with a fade when playback is newly created; exact playback time is not saved. Scene changes follow reading, never the song duration. Return to menu or disable sound to fade out active opening tracks. Failed playback reports a message; toggling sound off/on retries.

Implementation: `src/opening-audio.js`; integration: `src/app.js`; media MIME types: `server.mjs`. `tests/soundtrack.test.mjs` covers cue boundaries, branch consistency, persistent playback, volume updates, crossfades, one-shot hammer behavior, error handling, and mute/retry. Server tests verify MP3/WAV delivery. No new dependencies.
