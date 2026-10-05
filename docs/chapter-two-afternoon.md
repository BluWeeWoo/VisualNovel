# Chapter Two afternoon implementation

The approved script continues from the existing c2End recovery scene through lunch, the three solo home activities or market/solo-grave routes, Lola’s grave, Mayumi’s visit, and c2NewEnding. Chapter One adds the repaired-door conversation, workshop lines in the letter, and the optional apprenticeship conversation.

Gardening uses a separate saved untimed round under flags.soloGardenRound. Stopping early and finishing both continue, without changing the original gardening round or relationships. TV channels form a finite browse menu; the news appears only after Rowan returns. Time passes in narration.

Conditions remember the TV callback, workshop visit, grave companion, and earlier apprenticeship discussion. Existing scene IDs stay loadable. The old Chapter Two ending now continues to lunch. Revised ambition history is archived when its original line no longer exists; choices, relationships and memories stay intact.

## Music
| Scene | Existing track |
| --- | --- |
| Lunch and returns | Back Together |
| Solo garden and porch | Outdoor ambience |
| TV and workshop | Catching Up |
| Market | Neighborhood |
| Grave | Lola |
| Mayumi’s greeting | Back Together |
| Father’s request and ending | Letters |

Existing mute, volume, reduced motion and cleanup controls apply. Nightmare ownership and wake transition stay intact.

## Artwork
Final assets: assets/cg/chapter-two/lunch.webp, solo-garden.webp, television.webp, television-news.webp, workshop.webp, grave-solo.webp, mayumi.webp.
Created with the built-in image generation tool. Original PNGs are retained as source artwork. The grave background has no people so it works on the solo route.

## Prompt set
### lunch
Use case: illustration-story. Create a finished widescreen 16:9 anime visual novel CG for Our Summer, Unfinished. Match the reference's painterly detailed Philippine seaside house, warm natural light and character drawing. Reference is Rowan identity and outfit: adult 21, brown shaggy hair tied in small low bun, blue eyes, small earrings, grey cardigan with white doodles over white tshirt, no moles/freckles. First-person MC viewpoint: do not depict MC, their body, gender or hands. No text, UI, panels, borders, watermark. Keep faces and focal objects in upper two-thirds for dialogue overlay. Rowan sits across a wooden dining table smiling quietly at viewer. Fried whole tilapia, sliced tomatoes in small bowl, rice and two place settings. Bright midday Filipino ancestral home kitchen with capiz windows, blue sea distance. Domestic tender casual moment.

### solo-garden
Use case: illustration-story. Create a finished widescreen 16:9 anime visual novel CG for Our Summer, Unfinished. Match the reference's painterly detailed Philippine seaside house, warm natural light and character drawing. Reference is Rowan identity and outfit: adult 21, brown shaggy hair tied in small low bun, blue eyes, small earrings, grey cardigan with white doodles over white tshirt, no moles/freckles. First-person MC viewpoint: do not depict MC, their body, gender or hands. No text, UI, panels, borders, watermark. Keep faces and focal objects in upper two-thirds for dialogue overlay. Empty backyard of this same Philippine seaside house, leafy pots and small earthen garden patch with weeds, gardening gloves and empty metal bucket beside wooden steps. Midday sun and shade. No people anywhere.

### television
Use case: illustration-story. Create a finished widescreen 16:9 anime visual novel CG for Our Summer, Unfinished. Match the reference's painterly detailed Philippine seaside house, warm natural light and character drawing. Reference is Rowan identity and outfit: adult 21, brown shaggy hair tied in small low bun, blue eyes, small earrings, grey cardigan with white doodles over white tshirt, no moles/freckles. First-person MC viewpoint: do not depict MC, their body, gender or hands. No text, UI, panels, borders, watermark. Keep faces and focal objects in upper two-thirds for dialogue overlay. Empty living room of same house, sofa foreground, small television on wooden cabinet showing an indistinct colorful daytime cooking program, electric fan, capiz window afternoon sun. No people anywhere. Screen small enough no text needed.

### workshop
Use case: illustration-story. Create a finished widescreen 16:9 anime visual novel CG for Our Summer, Unfinished. Match the reference's painterly detailed Philippine seaside house, warm natural light and character drawing. Reference is Rowan identity and outfit: adult 21, brown shaggy hair tied in small low bun, blue eyes, small earrings, grey cardigan with white doodles over white tshirt, no moles/freckles. First-person MC viewpoint: do not depict MC, their body, gender or hands. No text, UI, panels, borders, watermark. Keep faces and focal objects in upper two-thirds for dialogue overlay. Rowan in three-quarter profile inspecting a handmade wood dining table inside a modest Philippine carpenter's workshop near market. Older Filipino carpenter Mang Nestor in faded work shirt stands by bench with sandpaper. Sawdust, clamps, practical hand tools. Rowan intent yet hesitant. Afternoon warm light.

### grave
Use case: illustration-story. Create a finished widescreen 16:9 anime visual novel CG for Our Summer, Unfinished. Match the reference's painterly detailed Philippine seaside house, warm natural light and character drawing. Reference is Rowan identity and outfit: adult 21, brown shaggy hair tied in small low bun, blue eyes, small earrings, grey cardigan with white doodles over white tshirt, no moles/freckles. First-person MC viewpoint: do not depict MC, their body, gender or hands. No text, UI, panels, borders, watermark. Keep faces and focal objects in upper two-thirds for dialogue overlay. Quiet small Philippine town cemetery under a leafy tree, fresh white and yellow flowers placed beside a simple pale stone grave. No legible names, no crosses obscuring view, no people. Compassionate peaceful afternoon sunlight with sea hillside beyond.

### mayumi
Use case: illustration-story. Create a finished widescreen 16:9 anime visual novel CG for Our Summer, Unfinished. Match the reference's painterly detailed Philippine seaside house, warm natural light and character drawing. Reference is Rowan identity and outfit: adult 21, brown shaggy hair tied in small low bun, blue eyes, small earrings, grey cardigan with white doodles over white tshirt, no moles/freckles. First-person MC viewpoint: do not depict MC, their body, gender or hands. No text, UI, panels, borders, watermark. Keep faces and focal objects in upper two-thirds for dialogue overlay. Rowan sits at wooden kitchen table listening uneasily, his mother Mayumi sits opposite in three-quarter view, mature Filipino woman around 48 with brown hair loosely pinned back, simple cream blouse, kind serious expression, a bag with bread and glasses of water between them. Late afternoon capiz window. Family conversation not dramatic confrontation.
### Grave correction
Remove Rowan completely and fill his silhouette with the path, grass, foliage and seaside background. Keep the stone, flowers, tree, sunlight, camera and anime painting style. No people or silhouettes.
### News
Use case: precise-object-edit. Edit this visual novel living-room CG. Keep all furniture, composition, lighting, painting style and widescreen format unchanged. Change ONLY the television screen to a local Philippine news report: a distinguished Filipino man about 50 in a cream barong outside a modest health clinic, brown hair with grey at temples, speaking beside clinic staff. On the screen lower-third write exactly 'MAYOR SANCHEZ' and smaller 'SAINT LUIS'. No people in the actual room. The man exists ONLY within the television screen.

