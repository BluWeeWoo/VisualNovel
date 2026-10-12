# Chapter Two ending implementation

Approved continuation is in src/chapter-two-ending.js, installed after the existing father continuation. Existing scene IDs and lines remain intact. Saves at c2FatherPresent keep their reading position and continue instead of remaining completed.

## Branches
- c2KitchenListen: listen to Rowan or finish cleaning without asking.
- Two support responses rejoin at the apprenticeship conversation.
- Sevi joke follows the existing seviDescription flag.
- Heard-backstory and quiet routes have separate closing narration.
- Rowan Sanchez appears in the character gallery after the heard-backstory closing line.
- No relationship values are changed by the new choices.

## Approved artwork
All new files are versioned under assets/cg/chapter-two/ending-v1; original files remain preserved.
- confrontation.webp: exec-0a38ca8a-8b6a-46b8-b1ca-00584e0b7dd7.png, birthday confrontation.
- glass.webp: exec-a073976e-33a6-4162-b4ee-3dcd1d99f12a.png, corrected table perspective.
- stay.webp: exec-0f9ad1a6-048d-4f1c-b270-ffcb3935e6e9.png, user-selected shy/blushing Rowan with lip shine removed.
- kitchen-honesty.webp: exec-05d678cb-c490-4d26-90c6-4c6d3db81b88.png, approved matching perspective correction; replaces manifest reference only.

Generated originals are preserved in the thread's generated_images directory. Rejected face/jaw experiments are not used.

## Verification
Branch tests cover ask/skip, both support choices, Sevi variations, ending selection, surname reveal, and old-save continuation.
Desktop check: tools/check-chapter-two-ending.mjs verifies all four images, skip choice, old endpoint continuation, and the ending screen without page or asset errors.
