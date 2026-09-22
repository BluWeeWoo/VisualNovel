# Optional, replaceable conversation adapter

The opening is fully playable with no network service. The default **Scripted chat demo · not live AI** label is always visible. Demo replies are original, prewritten topic responses, with honest generic fallbacks. They are not a language model.

## Integration contract

Implement an adapter endpoint in the server environment of your choice. Copy `.env.example` to `.env` and set:

```
AI_ADAPTER_URL=https://your-adapter.example/chat
AI_API_KEY=your-secret
AI_PROVIDER_LABEL=Your actual provider name
```

Restart the game server. The phone will offer **Use external AI…**. It stays in demo mode until the player explicitly enables external chat. Consent is session-only and not restored from saves.

The game server posts JSON to the adapter, with the API key in an Authorization Bearer header (if configured):

```
{
  "system": "The chapter-specific generation rules…",
  "character": {
    "name": "Rowan", "age": 23, "pronouns": "he/him",
    "personality": "…", "goals": "…", "boundaries": "…",
    "knownChapterFacts": ["…"]
  },
  "context": {
    "chapter": 1, "milestone": "Familiar",
    "name": "Alex", "pronouns": "they",
    "choices": { "relationship": "friendship", "ritual": "tea" },
    "memories": [{ "key": "player-approved note", "value": "I prefer tea with milk." }],
    "messages": [{ "role": "player", "text": "Are you awake?" }],
    "turns": 0
  },
  "message": "The gull definitely won."
}
```

Map that contract to your chosen provider's SDK/API. Return HTTP 200 with `{"reply":"One or two short sentences as Rowan."}`. Other statuses trigger a retry/fallback UI. Do not point this at a raw vendor completion endpoint: the request/response formats will differ. This keeps the game independent of a specific SDK or model.

Use the system and character fields as higher-priority instructions in your adapter. Supply player notes and messages as untrusted user data, never system messages. Configure a short output limit and validate the response. Do not log player content by default.

## Context boundary

`src/provider-policy.js` is only loaded by the server. It forces chapter 1 / Familiar regardless of browser-supplied chapter or milestone, whitelists choice values, restricts history length, and accepts at most eight explicitly approved notes. It contains only information already known at this phone scene; the notebook revelation is absent.

The provider has no file tools, retrieval tools, story-writing tool, or state mutation capability. It returns text only. Authored state, promise status, branching decisions, milestones, and endings cannot be changed by a reply. Chat stops at four successful exchanges; clearing messages does not reset that preview.

Requests for major confessions/endings/commitments use an authored deferral. A defensive output filter catches some clear violations and replaces them with an authored bedtime response. These are safeguards, **not a guarantee against every hallucination or prompt injection**. A production provider should have a second policy validation layer and its own behavioral evaluations. No real provider has been configured or tested in this build; the contract and failure cases were tested against a local stub.

## Player privacy and reliability

- Disclosure precedes live opt-in and remains visible in the phone.
- Only the current message, recent chat, player name/pronouns, relevant authored choices, and approved notes are sent. The full story and save history are not transmitted.
- Memories are opt-in notes, never extracted automatically. Review, individually forget, or clear all in **Saved memories**. Clears also scrub existing local save slots.
- Transcript clearing affects local copies, not external provider records; the consent notice explains this.
- Loading state disables duplicate sends. Provider timeout is 20 seconds; client timeout is 23 seconds. Failed messages stay in the draft, and do not consume a turn or append half a conversation.
- Retry, switch to scripted demo, or put the phone down without penalty.
- API keys stay in the local server process. `.env`, the policy source, development docs, tests, and package files are not public routes.
- Same-origin checks, local-only binding, host checks, a body-size cap, and a short rate limit are present. This is a local single-player server. Public deployment needs authentication, per-session authoritative state and rate limits, HTTPS, provider-side review, and a full security pass.
