# Chapter 1 relationship branches

Implemented from the approved editable proposal, including “Going to Saint Luis.”

New games started through character setup opt into the new graph. Existing saves retain their original graph and reading positions; no past choices or histories are rewritten. Start a new summer to read the revised opening.

## Behavior

- The journey, reunion and second visit capture their entry state in saved flags. Later reflection does not rewrite earlier scenes.
- Uncertain has no Rowan nostalgia during the journey, no stop at his gate, a brief reunion and a grocery delivery with an invitation/leave choice.
- The revised Uncertain reunion uses the player's edited awkward greeting and neutral expressions. It skips the childhood letter flashback, exchanges numbers in the present, and explains the unanswered letters briefly before Rowan leaves. The later Manila family flashback remains; other states retain the childhood memory.
- Familiar keeps short friendly visits, optional watering and a short conversation, without the intimate porch-topic sequence.
- Drawn to You keeps optional comfort, breakfast, gardening and personal conversations, with explicit invitations to stay.
- In Love interior narration reflects the MC's selected feelings. Mutually affectionate interaction requires the existing explicit `relationship: romance` state. Starting affinity, friendship commitment, and a comfort gesture do not supply that state. The current new-game flow does not manufacture prior romantic history, so it uses Drawn to You interaction until reciprocation is established.
- The latest approved Uncertain draft is in `drafts/Chapter-1-Uncertain-Approved.md` and supersedes that route's older proposal. It skips envelope discovery, the Manila letter flashback, and letter reading after Rowan leaves, proceeding directly to the first evening. Other states keep those scenes. Morning messages and the actual `aEnd` completion remain shared, including the ending animation and chapter reflection.
- The news report names the established mayor Enrich Sanchez and covers municipal services. The obsolete Nicolas/inauguration/retiring-father report and Chapter 2 “new mayor” wording are removed.
- Solo afternoons retain the mayor news. Chapter 2 no longer assumes the MC ate Rowan's tapa on the revised routes. Existing Chapter 2 revelations remain accessible regardless of optional Chapter 1 topics.
- The parents remain in Manila. No new parent visit or backstory change was made.

## Authoring

`chapter-one-branch-data.js` contains plain story data compiled from the approved draft. `chapter-one-branches.js` installs new nodes and state-dependent incoming edges. Existing node IDs remain intact for old saves. `tools/build-chapter-one-branches.mjs` is a manual authoring tool; the browser never reads or serves draft documents.

No new artwork, relationship score changes, automatic promotions or new unlock rules were added. The explicit reciprocity requirement guards affectionate scenes without changing the selected feelings level.

## Validation

Route tests cover all four starting feelings, accepting/declining invitations, mutual-romance eligibility, saved scene snapshots, private-letter continuity, graph exits and older saves. Browser checks cover setup-to-opening, the four interaction previews and the Chapter 1 ending/reflection screen.

The full existing suite has four pre-existing artwork assertion failures reproduced against HEAD: grave comfort, old Mayumi ending, and two lunch-art tests. These are separate from this change. Restricted local-network tests are rerun outside the sandbox when needed.
