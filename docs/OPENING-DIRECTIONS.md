# A Familiar Door — approved PDF adaptation

Source: user-provided *Our Summer Unfinished (1).pdf*, pages 4–11. The user approved the revised script and three-CG plan before implementation. Pages 1–3 are planning reference; relationship mechanics were not rewritten from that document.

## Scope and continuity

New games begin at `journey` and stop at `recognition`, on Rowan's “{name}?”. MC and Rowan are 23. Saint Luis is a small fishing town in the Philippines; MC has been away more than four years, and Lola died two years ago during finals. MC's name and pronouns remain player-selected. First-person internal narration keeps anger, defensiveness, exhaustion and affection together. No funeral flashback, new shared history, romantic commitment or later plot is introduced.

The older graph is retained with its original IDs so manual saves and autosaves remain loadable. It is a legacy draft with different continuity, not the continuation of this revision. Start a new summer to read the approved opening. No prior sprite or CG has been removed or overwritten. New choices store `strangerResponse`, `griefResponse`, and `knocked`; none awards trust or punishes grief/space. Promises, phone and completion remain locked/unset throughout this section.

## Scene direction

| Nodes | Background / CG | Sprite and expression | Sound / music | Transition |
| --- | --- | --- | --- | --- |
| journey | Bus interior; **The Way Back** CG from the sea's appearance until conductor's call | No MC portrait; no Rowan | Low bus bed. Four-note instrumental phrase at bay reveal; conductor is text, not recorded voice | Decoded 420 ms crossfade; unchanged art persists |
| busBump, four responses, wallet | Same bus interior | Incidental distant silhouettes only | Bus bed; soft impact on fall; no comic crash | Return to interior at conductor call |
| driver | Same bus interior | Driver off-screen / background silhouette | Low bus bed; no dramatic sting for kindness | Hold through dialogue |
| hill | Two houses above Saint Luis; **The Hill Between Our Houses** begins at recognition of the houses | No ghost images or portraits | Gentle wind-like bed and sparse instrumental theme | Dissolve from bus |
| hillCry / hillHold | Hold hill CG | No judgement encoded in visuals | Same restrained theme for both choices | No restart of art or music |
| otherDoor, neighborVisit / neighborWait | Hill environment reused to preserve geography | Rowan absent; no response from house | Soft knocks on authored knock lines, otherwise quiet theme | Hold environment; no forced camera motion |
| doorRepair | Supporting back-view repair illustration; face hidden | Rowan from behind, no expression overlay | Music stops; three measured taps, low ambience | Dissolve to porch |
| recognition | **A Familiar Door**, special reunion CG throughout | Rowan's surprised recognition; small parted mouth, no smirk; no separate sprite on top | Quiet unresolved instrumental phrase over ambience | Full-screen crossfade; stop on player name |

All new art has original PNG masters and optimized WebP delivery in `assets/cg/opening/`. Rowan's face stays in the upper center for dialogue clearance. Settings control sound and volume; sound is off by default. Audio is original procedural synthesis: no licensed samples, recorded speech or full Foley track. Directions involving wind, engine and knocks are conveyed by these restrained synthesized approximations. Text remains readable with sound disabled. Reduced motion removes visual fades. No automatic advancement or mandatory pauses.

## Script and branches

`src/opening.js` is the complete player-facing script. Each line is a dialogue advance. The four bus responses rejoin at `wallet`; both grief responses rejoin at `otherDoor`; visiting or postponing rejoins at `doorRepair`. All 16 paths reach recognition. The ending is a section boundary, not a completed summer or fulfilled promise.

## Validation

`tests/opening.test.mjs` traverses all 16 paths, round-trips every line through save/load and history refresh, checks choice persistence, verifies Rowan's face CG cannot precede the reveal, and confirms no promise/phone/trust unlock. The older chapter, sprite, CG, server and transition tests remain in the test suite.
