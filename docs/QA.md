# Verification

Run `npm test` (or `npm.cmd test` in Windows PowerShell).

## Automated coverage

- Every node is reachable; exits resolve; no cycles strand the player.
- Every choice branch terminates at the chapter ending. Three complete alternate routes cover every scene; additional traversals exercise every individual choice.
- State round-trips through JSON at every line, preserving memories, choices, and progress.
- All childhood objects, headquarters, and nicknames appear later; pronoun interpolation is checked.
- Declining a hug, respectful disagreement, choosing friendship, and declining the pier detour keep progression at Familiar.
- Promise list becomes available, sunrise becomes planned rather than completed, phone unlocks, ending completes.
- Chat replies cannot mutate authored state. Provider context cannot claim later chapters or milestones; unapproved notes are discarded; ending information is absent.
- All assets referenced by the manifest exist.
- Local server returns the app, rejects foreign origins/hosts, and does not serve secrets or spoiler documents.
- Local mock adapter verifies server-side authorization, bounded context, rate limiting, failure recovery, and a basic output guard.

## Browser checks

Completed in the browser on 22 September 2026:

- Full playthrough from title to chapter ending using a custom name, she/her pronouns, the space boundary, independent sorting, different childhood memories, respectful disagreement, the pier detour, a grief boundary, cocoa, and friendship.
- Manual save followed by a different choice, then load: exact prior choice point restored.
- Page reload followed by Continue: dialogue position and remembered choices retained.
- Promise journal before planning and after the ending: unstarted → planned, cocoa retained, not falsely marked fulfilled.
- Four successful scripted exchanges using suggestions and free typing; the fifth input is unavailable and trust remains Familiar. Another loaded route ends the chat after two messages and still reaches the closing hook.
- Explicitly approved note saved, then individually forgotten; loading an earlier manual save confirms the forgotten detail is gone.
- Reduced motion shows text immediately; Escape and numeric choice keyboard controls work.
- Desktop layout at 1366 × 768 and phone layout at 390 × 844 visually inspected. Narrow game choices also remain readable and scrollable.
- No browser console warnings or errors during the final route.

An existing Alex playthrough was preserved in manual slot 3 before using River as the test character. The original progress is restored for delivery.

## Honest limitations

- Only chapter one is implemented. Later trust stages, open conversations, relationship-specific committed scenes, and the hopeful/bittersweet final endings are outlined separately, not falsely exposed as playable.
- No real external AI provider is configured. The adapter is functional with the documented contract, but production model quality, provider privacy policy, and safety validation need to be checked when a service is chosen.
- Timing is estimated from per-route word counts plus interaction, not a timed human playtest.
- Saves are browser-local; no cloud, portable save export, or native desktop installer is included.
- The accessibility implementation uses semantic controls, keyboard navigation, focus trapping, dialogue announcements, contrast-conscious colors, and reduced motion. It has not undergone a dedicated screen-reader audit.

## Rowan artwork update verification

- All 15 automated tests pass after integration, including every story branch, save persistence, promise/chat progression, canonical ages/pronouns, explicit sprite cues, book staging and old-save history refresh.
- Eight RGBA sprite files pass the alpha/framing audit (`ART-AUDIT.json`); all use 1254 × 1254 canvases. Transparent surroundings and stable head placement were also visually checked against illustrated backgrounds.
- All eight expressions/poses were previewed in the running cast gallery with identical display bounds. Arrival choices and the sorting scene were checked at desktop size; the illustrated-book pose switches back to ordinary neutral and teasing expressions as sorting progresses.
- Desktop dialogue and choices remain fully readable beside Rowan. Portrait placement was moved outside the dialogue container to prevent movement with panel height. A 390 × 844 narrow-screen check confirms readable stacked dialogue and portrait framing.
- Generated backgrounds were visually inspected for a consistent illustrated palette and texture. The pier has matching daylight and dawn variants.
- The Rowan update's test route used a separate localhost origin, leaving the existing 127.0.0.1 saves untouched. No console warnings or errors were observed on that route.
- Phone identity and bounded AI profile now use Rowan, age 23, he/him; external AI remains unconfigured and the scripted demo is explicitly labeled. Prior full chapter/browser checks above remain the baseline for unchanged features.

## Centered layout and CG update

- All 17 automated checks pass, including five CG cue windows, restoration from serialized states, asset descriptions/formats/size budgets, and the existing branch/save/promise/chat checks.
- Desktop ordinary sprites are centered above the dialogue with three-column choices; mobile uses stacked choices. Desktop and 390 × 844 layouts were visually checked. Art and dialogue bounds meet without overlapping; no horizontal overflow was found.
- Promise discovery, seaside laughter, third-cup grief and sunrise-planning CGs were reached through the actual game. All five generated paintings were inspected for consistent identity and outfit.
- Reload and Continue restored the third-cup CG at the same choice point. Choosing to put the cup away returned to ordinary staging, and progression reached the hopeful planning illustration.
- The final planning image loaded successfully at its native 1536-pixel width. Browser console showed no warnings or errors during the test route.
- Tests used the existing Sam test save on localhost; the user's 127.0.0.1 save origin was not modified. Existing story content, state schema and chat implementation were left unchanged.

## Full-screen presentation and smooth visual updates

CGs now fill the viewport using cover sizing, with responsive center framing and no blurred side panels. This supersedes the earlier contained-CG/side-fill presentation; edge cropping is expected on different aspect ratios. Dialogue remains in front of the painting.

The game retains its artwork containers between lines. Identical visual keys leave existing image elements untouched. Changed sprites, CGs and backgrounds decode before a 420 ms crossfade; stale asynchronous requests are ignored. Reduced-motion mode uses direct swaps. Three focused tests cover reuse, pending/stale loads, and motion behavior; all 20 tests pass. Full-screen CG rendering and return to the ordinary sprite were checked in the running game.

## Standing sprites and smaller CG framing

- All eight active portraits are standing 1024 × 1536 RGBA sprites. Alpha is verified; body pixels reach the bottom edge so no chest cut floats above dialogue. Ordinary expression silhouettes differ by at most one pixel at the right edge.
- All 20 tests pass, including portrait aspect/dimensions, existing branching and saves, and persistent-art transition tests.
- Desktop standing neutral and mobile standing concerned were visually checked in the running game. Mobile choices remain usable and Rowan's face remains clear of the dialogue.
- The reduced, uncropped reunion CG was checked at desktop and 390 × 844 mobile sizes. No blurred filler is used. Smooth visual loading/crossfades remain unchanged.

## Dialogue-box navigation revision

Full-screen cover framing is restored for CGs at the player's preference. Separate in-game branding, chapter and location bars are removed. History, save/load, settings, promises and the title-menu control now live in the dialogue footer. Standing sprites and persistent smooth visual transitions remain unchanged.

All 20 automated checks passed after this change. The relocated settings, save/load, history and promises buttons were opened successfully in the running game. Desktop and 390 × 844 mobile layouts were checked; the toolbar is inside the dialogue panel, no top bars remain, and mobile has no horizontal overflow.
