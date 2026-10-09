from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, hashlib, re
root=Path(__file__).resolve().parents[2]
out=Path(__file__).resolve().parent
sources=[p for folder in ['src','assets'] for p in (root/folder).rglob('*') if p.suffix in ['.js','.json']]+[root/'styles.css',root/'index.html']
refs={p.relative_to(root).as_posix():p.read_text(encoding='utf-8') for p in sources}
items=[]; seen={}
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',14)
for p in sorted((root/'assets').rglob('*')):
 if p.suffix.lower() not in ['.png','.webp','.jpg']:continue
 rel=p.relative_to(root).as_posix();im=Image.open(p).convert('RGBA')
 digest=hashlib.sha256(im.tobytes()+str(im.size).encode()).hexdigest()
 used=[k for k,v in refs.items() if rel in v]
 item={'path':rel,'width':im.width,'height':im.height,'alpha_bounds':im.getchannel('A').getbbox(),'references':used,'identical_to':seen.get(digest)}
 seen.setdefault(digest,rel);items.append(item)
 # Inspect PNG source separately only if no sibling WebP; retain both in the inventory.
 if item['identical_to'] or (p.suffix=='.png' and p.with_suffix('.webp').exists()):continue
 item['tile']=len([x for x in items if 'tile' in x])
imlist=[x for x in items if 'tile' in x]
for page in range((len(imlist)+19)//20):
 sheet=Image.new('RGB',(1600,1450),'#ddd6c8');draw=ImageDraw.Draw(sheet)
 for j,item in enumerate(imlist[page*20:(page+1)*20]):
  x=(j%4)*400;y=(j//4)*290
  im=Image.open(root/item['path']).convert('RGBA');im.thumbnail((392,244))
  sheet.paste(im,(x+(400-im.width)//2,y),im)
  label=f"{item['tile']:03d} "+item['path'].replace('assets/','')
  for n in range(0,len(label),53):draw.text((x+4,y+245+n//53*16),label[n:n+53],font=font,fill='black')
 sheet.save(out/f'sheet-{page+1:02d}.jpg',quality=90)
(out/'inventory.json').write_text(json.dumps(items,indent=2),encoding='utf-8')
print(json.dumps({'files':len(items),'tiles':len(imlist),'sheets':(len(imlist)+19)//20}))
