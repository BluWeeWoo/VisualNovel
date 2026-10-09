from pathlib import Path
import json,csv,html
root=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent
items=json.loads((out/'inventory.json').read_text())
manifest=json.loads((root/'assets/manifest.json').read_text(encoding='utf-8'))
uses={}
def walk(value,key='manifest'):
 if isinstance(value,dict):
  for k,v in value.items():walk(v,key+'.'+k)
 elif isinstance(value,list):
  for k,v in enumerate(value):walk(v,key+'.'+str(k))
 elif isinstance(value,str) and value.startswith('assets/'):uses.setdefault(value,[]).append(key)
walk(manifest)
for name in ['rowan-showcase-reference.png','rowan-expressions.webp','rowan-outfits.webp','rowan-seaglass.webp','rowan-porch.webp','rowan-harbor.webp']:
 uses.setdefault('assets/gallery/'+name,[]).append('Character gallery (including reference-sheet crops)')
for name in ['affinity-sheet.png','chapter-reference.png']:
 uses.setdefault('assets/chapters/'+name,[]).append('Chapter menu illustration/crops')
uses.setdefault('assets/backgrounds/menu-seaglass.png',[]).append('Main menu and gallery')
uses.setdefault('assets/garden/rematch.webp',[]).append('Weed-pulling minigame')
for item in items:
 for ref in item['references']:
  if '/backups/' not in ref and ref!='assets/manifest.json':uses.setdefault(item['path'],[]).append(ref)

notes={}
def assign(numbers,status,note):
 for n in numbers:notes[n]=(status,note)
assign([2,6], 'Minor style pass','Rowan’s small menu figure has softer facial definition than the approved sprite. Match face/eye linework and cardigan motifs without enlarging him; the wide establishing composition is intentional.')
assign([11,106], 'Minor style pass','Keep seated pose, daylight and porch composition. Match Rowan’s face contour, ash-brown hair and line/shadow treatment to the approved adult reference; do not erase warm sunlight.')
assign([12,13,109], 'Keep','Full-height farewell composition and proportions are coherent. Keep the current corrected door, long legs and evening lighting. No positioning correction required.')
assign([14], 'Archive only','Older farewell gives a shortened-leg impression behind the railing. Superseded by the full-height version; retain as backup, never reconnect.')
assign([15,91,110,120,121,102], 'Keep','Drawn linework and adult identity are close to the approved Rowan reference. Preserve scene-specific expressions, soft smile, props and existing light. No redraw required.')
assign([17,18,68,69], 'Minor style pass','Keep bedside camera/pose. Standardize Rowan’s jaw, eye rendering and cardigan line weight with the live adult sprite; retain the concerned expression and sunlit room.')
assign([19,32,40], 'Correct','Mayumi’s smooth face and detailed fabric shading diverge from Rowan’s drawn style. Match both to the approved adult linework, keep her mature face and warm skin; the seated spacing is already appropriate. Preserve bread, glasses, night lighting (daylight in archived original).')
assign([29], 'Correct','Match Mayumi and eighteen-year-old Rowan to the same drawn rendering. Preserve Rowan’s short school hair, white uniform, youthful proportions and birthday lighting. Keep Lola exactly as she is. All three seated sizes are already plausible.')
assign([33], 'Correct','Match only Mayumi’s linework/shading and restore her established sage skirt (the visible blue floral patch drifts from her design). Keep her tense face and position. Preserve Enrich, Lola, the corrected hands and doorway unchanged.')
assign([34], 'Minor style pass','Match adult Rowan’s face and cardigan rendering to his reference. Keep his position beside the cabinet: the wider kitchen shot intentionally includes space between him and MC.')
assign([39], 'Minor style pass','Match Rowan’s facial proportions, eye linework and hair rendering to his sprite. Keep seated posture, meal, room, daylight and table perspective unchanged.')
assign(list(range(47,55)), 'Minor style pass','Use one consistent Rowan face/hair/linework correction across all four bouquet variants. Keep comfort versus standing poses, sad expression, golden light, flowers and grave unchanged; keep solo variants completely Rowan-free.')
assign([55,103], 'Minor style pass','Match Mayumi’s hair, skin and blouse/skirt shading to the proposed sprite standard. Do not move her toward the camera: she must remain at the door, facing it, holding bread. Preserve the fixed door and porch lighting.')
assign([70], 'Minor style pass','Rowan-only facial/linework alignment if this gallery asset is retained. Preserve workshop action, Nestor, tools and environment exactly; do not alter the unrelated character.')
assign([72,73,101,117], 'Minor style pass','Close views make Rowan’s broader/rounder eye and jaw rendering more noticeable. Match approved adult proportions while retaining affection, foreshortened arms, hair bun and existing lighting.')
assign([77,82,93,94,99], 'Keep','Rear-view identity, hair and clothing are consistent enough. Preserve intentional camera distance and work pose. Historical shoe/outfit and old-door versions remain backups.')
assign([78,79,80,81,83,88,89,90,152], 'Minor style pass','Align Rowan’s eye/jaw/hair linework with adult reference; retain gardening T-shirt, straw hat, bun, warm daylight and pose. Do not put him in a cardigan or reuse the minigame CG for normal dialogue.')
assign([84,85,86,87], 'Archive only','Older tank-top garden alternatives differ from the implemented T-shirt continuity. Preserve as unused drafts; do not silently reintroduce them.')
assign([95,96,107], 'Keep','Recognition illustration retains established face, kneeling scale and clothing. Preserve the approved identity and corrected-door version; earlier door/outfit versions remain backups.')
assign([116,119], 'Keep','Childhood proportions and short hair are intentional, not adult-design mistakes. Keep eleven-year-old Rowan distinct from eighteen- and twenty-three-year-old Rowan.')
assign([122,124], 'Keep','Chibi Rowan is an intentional menu illustration style. Preserve its simplified proportions and identity; do not force full-size adult anatomy onto the chibi artwork.')
assign([123,125,126,128,129,130,154], 'Archive only','Static UI reference/screenshot, not a new story CG. Preserve the historical preview. Future screenshots should be recaptured from approved assets rather than painting over UI or save text.')
assign([131,132,133,134,135,136], 'Keep','Gallery drawing style is close to the approved adult sprite. Alternative outfits are explicitly concepts and should remain. Cropped hero/thumbnail sources must be checked whenever a source is replaced so an older duplicate does not remain visible.')
assign(list(range(155,176)), 'Archive only','Superseded Rowan pose/eye/smile versions. Retain untouched backups; use current upgraded sprites as the live reference, not an older pupil or mouth variant.')
assign([176], 'Archive only','Older single Mayumi sprite has the same softer realistic rendering. Keep as source backup; new expressions should derive from the approved corrected master.')
assign(list(range(177,184)), 'Correct','Redraw shading and face/fabric linework to match Rowan while preserving Mayumi’s age, brown eyes, bun, blouse, sage skirt, jewelry and each expression/pose. Keep complete transparent full-body canvas and consistent head/feet anchors. Separate stage-scale correction is also needed.')
assign(list(range(184,192)), 'Archive only','Original cropped Rowan expression set; retain as design/source history, not as the live full-body sprite set.')
assign(list(range(192,198)), 'Keep','Approved age-eleven sprites form a coherent short-hair set. Preserve child scale, ordinary shirt/shorts/slippers and all expressions; no adult proportions or cardigan.')
assign(list(range(198,208)), 'Keep','Approved live Rowan sprite set is the style/identity anchor. Keep faces, expressions and full-body anatomy. Correct relative on-screen staging with Mayumi rather than redesigning Rowan.')
assign([208], 'Reference only','Original user-created Rowan identity reference. Preserve unchanged; use alongside the approved upgraded sprites for all future character edits.')

tiles={x['path']:x['tile'] for x in items if 'tile' in x}
by_path={x['path']:x for x in items}
for item in items:
 p=item['path'];base=p
 while by_path.get(base,{}).get('identical_to'):base=by_path[base]['identical_to']
 if base not in tiles and base.endswith('.png') and base[:-4]+'.webp' in tiles:base=base[:-4]+'.webp'
 tile=tiles.get(base)
 status,note=notes.get(tile,('Out of scope','No Rowan or Mayumi figure requiring correction. Preserve environment, unrelated character or interface artwork unchanged.'))
 if '/backups/' in p:status='Archive only';note+=' Backup retained unchanged.'
 item.update(status=status,review=note,usage=sorted(set(uses.get(p,[]))))
 if not item['usage'] and status in ['Correct','Minor style pass']:
  item['review']+=' Unreferenced source/draft: retain it; apply the correction to the live version, not this historical file.'
 if item['usage'] and status in ['Correct','Minor style pass']:
  if '/mayumi-v2/' in p:target=p.replace('/mayumi-v2/','/mayumi-consistent-v1/')
  else:target='assets/character-consistency-v1/'+p.removeprefix('assets/')
  item['proposed_target']=target
 else:item['proposed_target']='No replacement proposed'

for name in ['neutral','smile','thoughtful']:
 items.append({'path':f'assets/portraits/rowan-{name}.svg','status':'Archive only','review':'Legacy SVG placeholder, inspected as source. Keep untouched and do not reintroduce into the current illustrated game.','usage':[],'proposed_target':'No replacement proposed'})
(out/'reviewed-inventory.json').write_text(json.dumps(items,indent=2,ensure_ascii=False),encoding='utf-8')
affected=[x for x in items if x['proposed_target']!='No replacement proposed']
with (out/'replacement-map.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f);w.writerow(['Current asset','Proposed new asset (not installed)','Correction','Consumers'])
 for x in affected:w.writerow([x['path'],x['proposed_target'],x['review'],'; '.join(x['usage'])])
print(json.dumps({'reviewed':len(items),'planned_replacements':len(affected)},indent=2))
