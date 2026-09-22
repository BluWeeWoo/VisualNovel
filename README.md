# Our Summer, Unfinished

A playable, original visual novel opening about returning to a seaside guesthouse and a childhood friend. Chapter one is complete; the rest of the summer is outlined, not yet implemented.

## Play

1. Install **Node.js 20 or newer** if it is not already installed. This project has no package dependencies to install.
2. On Windows, double-click **Launch.cmd**, then keep its console window open. If the browser opens before the server finishes starting, refresh once.
3. Alternatively, open a terminal in this folder and run `npm start` (PowerShell users can use `npm.cmd start`).
4. Open **http://127.0.0.1:4173**. Stop the server with Ctrl+C when finished.

Use the local address consistently: browser storage for `localhost` and `127.0.0.1` is separate. Do not open index.html directly; browser modules and the optional server adapter need the local server. The server listens only on this computer, not the network.

## What is playable

- A complete first day: reunion, room sorting, three childhood-memory choices, the promise list, chip-shop outing, an optional pier walk, a quiet grief scene, sunrise planning, exchanged numbers, limited nighttime texting, and an authored closing hook.
- About **3,600–3,800 words per route**, approximately **20–30 minutes** with interaction. Reading speed varies. There is no forced delay or timed choice.
- Rowan (23, he/him), one central potential love interest. The protagonist is 23; choose a name and he/him, she/her, or they/them pronouns.
- Friendship, romantic openness, or uncertainty; choices about boundaries, honesty, support, and memories appear in later dialogue. No affection score or grind.
- Five illustrated locations with lighting variations, seven transparent Rowan expressions plus a matching book pose, and original synthesized sea ambience (off by default).
- Autosave, three manual save slots, dialogue history, adjustable text speed, reduced motion, sound and volume settings, and mouse/keyboard controls.
- A promise journal that distinguishes **planned** from **fulfilled**. The sunrise happens after this build’s closing scene.
- Four-message free-typing preview with suggested replies. Default is a **scripted demo, not live AI**. It sends nothing off-device.
- Optional server-side AI adapter, consent, loading, retry and fallback states, manually approved memories, and memory/transcript clearing across local save slots.

## Controls

| Control | Action |
| --- | --- |
| Click dialogue / Continue | Reveal text, then advance |
| Space or Enter | Reveal / advance |
| 1, 2, 3 | Select the corresponding visible choice |
| H / P / S | History / promise list / save and load |
| Tab / Shift+Tab | Move between controls |
| Escape | Close a panel |
| Enter in phone | Send (Shift+Enter adds a line break) |

Choices never time out. Reduced motion also displays text instantly. Settings are available before starting. Browser zoom is supported. Progress is stored in browser local storage on this device; clearing browser site data removes it. No account or cloud save is used.

## Art replacement

Rowan’s official design is your original illustration. Seven expressions and a book pose are integrated through **src/staging.js**. Open **Rowan** on the title screen to preview them against each location. Edit **assets/manifest.json** for later art changes. See **docs/ASSETS.md** for dimensions and credits.

## Optional AI

No configuration is needed to finish the chapter. For a real provider, see **docs/AI-INTEGRATION.md** and **.env.example**. The adapter uses an explicit JSON contract; a raw provider API URL is not sufficient. Secrets belong in `.env` or server environment variables, never browser code. The supplied server is intended for local play, not a public multi-user deployment.

## Development

The engine uses native browser modules, HTML/CSS, and a small Node HTTP server. No build tool or network dependency is required. Refresh the page after changes. This practical choice keeps art/story iteration simple and leaves the option of packaging the game into a desktop shell later.

`npm test` runs the story graph, every branch, save round-trips, callback, promise/phone state, asset, and local adapter tests. `node tools/build-art.mjs` regenerates the archived first-build vector art only; the active manifest uses the new PNG artwork. `./tools/audit-art.ps1` checks sprite alpha and framing.

- `src/story.js`: authored scene graph and choice effects.
- `src/engine.js`: serializable state, interpolation, validation, milestones.
- `src/app.js` / `styles.css`: player interface and persistence.
- `src/chat.js`: honest offline demo and browser adapter client.
- `src/provider-policy.js` / `server.mjs`: server-only character context and adapter boundary.
- `docs/STORY-OUTLINE-SPOILERS.md`: **developer-only full-summer outline, including endings**. Not served by the game.
- `docs/QA.md`: verification and remaining limitations.

Rowan’s official illustration is user-created. Additional sprites and backgrounds were generated with the built-in image tool from that reference. The writing, interface, and synthesized sound are original to this project. No third-party image, music, font download, or copied character design is included. Emotional inspiration does not imply an affiliation with *Our Life: Beginnings & Always*.
