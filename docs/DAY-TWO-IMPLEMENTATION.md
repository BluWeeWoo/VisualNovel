# Bedroom evening and day-two garden continuation

The approved script now continues after rLetterLaterAfter through d2Reveal. Existing IDs and reading positions remain intact. The former ending's completed flag clears on loading so the player can continue.

Choices: call Rowan or sleep; hug or say I missed you; read or skip the family messages; window or stairs; four garden greetings. Every route joins at breakfast and the garden reveal. No choices grant trust, romance or phone-chat access. SG messages are authored, read-only UI and never contact anyone. Sevi's role in sharing the account remains an unconfirmed suspicion.

Art uses the user's selected body reference, changed to a pale gray short-sleeved T-shirt. Face identity, matched skin tone and sweat are retained. New front-facing reveal, amused, hat-poke and startled images use that reference. The preexisting T-shirt window and rear-view garden illustrations are retained: generation of their replacements hit the image service usage limit. No non-garden CG was regenerated for the revision. Earlier review images remain separate.

PNG masters and optimized WebP assets: assets/cg/day-two/. Review drafts: assets/cg/day-two-review/. Built-in image_gen was used. The source dialogue is src/day-two.js. Phone overlays use src/morning-phone.js. Existing music fades follow scenes; the present-day bedroom does not inherit the flashback rain soundtrack or Manila label.

Base edit prompt: Edit only clothing in the user-approved Rowan garden image: replace gray sleeveless tank with a plain pale gray short-sleeved crew-neck T-shirt of comfortable natural fit. Preserve exact approved build, face, pose, skin tone, sweat, hair, hat, garden, camera and illustration style. Do not enlarge muscles. No logos or text.

Reaction prompts: Preserve the approved T-shirt reference in full. Amused: change only to a conversational smile with subtly raised eyebrow. Hat poke: tip brim forward, mildly puzzled smile. Startled: wide eyes and small open mouth, left hand catches the hat, natural fingers and unchanged lean arm size.

Validation: day-two.test.mjs covers all 48 branch combinations, line-by-line save validity, exclusive hug and phone routes, old ending resume, no flashback rain, and sender-specific messages without future-message spoilers. Existing continuation tests retain their 5,184-route coverage through the handoff to d2Settling.

Final checks: all 54 automated tests passed. Desktop (1440 × 900) and mobile (390 × 844) browser checks passed for garden art, phone messages, choices and the ending with no page errors or failed requests. Screenshots are in tmp/day-two-qa/. Each new WebP is below 400 KB. The local server allowlist includes both new modules while retaining its existing restrictions.
