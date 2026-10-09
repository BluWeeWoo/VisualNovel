from pathlib import Path
from PIL import Image
import json

root=Path(__file__).resolve().parents[1]
source=root/'output/father-reveal-art-review-v1'
dest=root/'assets/cg/chapter-two/father-continuation-v1'
dest.mkdir(parents=True,exist_ok=True)
manifest_path=root/'assets/manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
captions={
 'dinner-interrupted':'Rowan stops reaching for bread when Mayumi mentions his father.',
 'kitchen-honesty':'Rowan listens quietly beside the kitchen cabinet at night.',
 'birthday':'Rowan at eighteen celebrates his birthday with Mayumi and Lola.',
 'cardigan-gifts':'Lola’s handmade gray dog-pattern and brown cat-pattern cardigans on the bed.',
 'father-reveal':'Mayumi introduces Enrich while Lola stands beside the blue doorway, hands clasped.'
}
for key in [*captions,'kitchen-night','dining-background','stair-background']:
    image=source/('father-reveal-v2.png' if key=='father-reveal' else key+'.png')
    target=dest/(key+'.webp')
    Image.open(image).convert('RGB').save(target,'WEBP',quality=94,method=6)
    path=target.relative_to(root).as_posix()
    if key in captions: manifest['cgs']['c2-father-'+key]={'src':path,'alt':captions[key]}
    else: manifest['backgrounds']['c2-father-'+key]=path
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Installed eight approved images; original previews and assets retained.')
