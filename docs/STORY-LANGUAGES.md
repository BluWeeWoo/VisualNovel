# Story language

Players choose English or Taglish during new-game setup or in Settings. English
is the default. The browser remembers the preference independently of save slots.
Loading an older save uses the player's current language preference.

English retains cultural terms and names such as Lola, Tita, and food names.
Taglish mixes Filipino and English in dialogue, letters, messages, and nightmare
thoughts; narration and general interface navigation remain English.

## Editing

- The original story modules remain canonical. Do not change scene IDs, line
  counts, choice effects, or CG anchors to translate dialogue.
- `assets/story-translations.js` contains hand-written full-line adaptations.
  Each entry has `canonical text|||adapted text`. Keep name placeholders intact.
- `assets/story-language.js` resolves presentation text. Quoted choices reuse the
  corresponding spoken-line adaptation unless an explicit entry is provided.
- An unlisted line remains as authored. This permits intentionally shared English
  dialogue in the lighter Taglish voice. When adding Filipino text to the script,
  also add its English adaptation. Update catalog keys when editing source lines.
- History stores canonical text. Only its display changes, preserving save
  migrations and story/phone cue matching. Player-entered memories are not translated.

The active scope is the playable Chapter 1 route and Chapter 2 opening. The legacy
AI chat demo is not a translation service; free-form user/provider replies are
not rewritten into another language.

Validation: `node --test tests/language.test.mjs`, then `npm test`. Browser-check
switching on the same line, new-game preference, letters, messages, and mini-games.
