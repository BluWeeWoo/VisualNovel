from PIL import Image
from pathlib import Path
import json
sources=json.loads(Path('tmp/porch-art-sources.json').read_text())
out=Path('assets/cg/porch-door-v2')
out.mkdir(exist_ok=True)
for key,source in sources.items():
    Image.open(source).convert('RGB').save(out/(key+'.webp'),quality=90)
p=Path('assets/manifest.json')
m=json.loads(p.read_text(encoding='utf-8'))
mapping={
'assets/cg/reunion/reunion-porch.webp':'porch-day',
'assets/cg/opening/door-before-outfit.webp':'door-repair',
'assets/cg/opening/familiar-door-outfit.webp':'recognition',
'assets/cg/reunion/reunion-hug.webp':'hug',
'assets/cg/after-garden/quiet.webp':'quiet',
'assets/cg/after-garden/wave-outfit.webp':'wave',
'assets/cg/reunion.webp':'legacy-reunion',
'assets/cg/after-garden/porch-night.webp':'night',
'assets/cg/chapter-two/continuity-v1/porch-night.png':'night',
'assets/cg/chapter-two/continuity-v1/porch-early-evening.png':'evening',
'assets/cg/chapter-two/scene-approved-v1/mayumi.webp':'mayumi'
}
def replace(v):
    if isinstance(v,str) and v in mapping: return str(out/(mapping[v]+'.webp')).replace('\\','/')
    if isinstance(v,dict): return {k:replace(x) for k,x in v.items()}
    if isinstance(v,list): return [replace(x) for x in v]
    return v
m=replace(m)
m['backgrounds']['c2-painted-tricycle-stop']=str(out/'waiting.webp').replace('\\','/')
p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
Path('docs/porch-door-asset-map.json').write_text(json.dumps(mapping,indent=2)+'\n')

