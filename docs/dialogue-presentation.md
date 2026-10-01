# Dialogue presentation

All chapters use the existing dialogue panel. Each source row has one presentation:
- Plain row: narration, normal text, visible empty nameplate.
- Thought|Silent words here: MC internal thought, italic text, visible empty nameplate.
- You|Spoken words here: spoken MC dialogue, chosen player name, normal text.
- Rowan|Spoken words here (or another character name): spoken dialogue, named, normal text.

The final story assembly normalizes Thought markers into kind: 'thought' and an empty speaker. It sets kind: 'narration' or 'spoken' for other rows. Object-authored lines can explicitly set kind. Text messages and written notes remain normal text and retain the existing phone/note interface.

Do not mark a sentence as thought just because it starts with “I.” Actions and retrospective scene descriptions remain narration. Use thoughts for direct silent self-talk, questions, and immediate private reactions. Keep mixed action-and-reflection lines as narration rather than italicizing physical actions. Spoken MC lines retain You as their speaker.

Never insert or remove lines for formatting alone: saved positions and CG/audio cues depend on line order. Thought markers are metadata and must not appear in displayed text or saved speakers. Existing punctuation is preserved.
