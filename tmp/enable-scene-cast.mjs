import fs from 'node:fs';
let s=fs.readFileSync('src/app.js','utf8').replace('import {spriteAt, cgAt, sceneAt}', 'import {spriteAt, spritesAt, cgAt, sceneAt}');
s=s.replace('  const staging=spriteAt(story,state);','  const cast=spritesAt(story,state);\n  const staging=cast[0];');
const start=s.indexOf("    ${cg?");const end=s.indexOf('\n    </div>',start);
s=s.slice(0,start)+"    ${cg?`<img class=\"event-cg\" src=\"${escape(cg.src)}\" width=\"1672\" height=\"941\" alt=\"${escape(cg.alt)}\" fetchpriority=\"high\" decoding=\"async\">`:cast.map(actor=>{const src=manifest.portraits[actor.character||'Rowan']?.[actor.key];return src?`<aside class=\"character-stage ${node.time}${node.childhood?' childhood':''}${actor.slot?' cast-'+actor.slot:''}\" data-character=\"${actor.character||'Rowan'}\" data-expression=\"${actor.expression}\" data-pose=\"${actor.pose}\"><img src=\"${escape(src)}\" width=\"${manifest.spriteCanvas.width}\" height=\"${manifest.spriteCanvas.height}\" alt=\"${actor.character||'Rowan'}, ${actor.expression}\" fetchpriority=\"high\"></aside>`:'';}).join('')}"+s.slice(end);
s=s.replace("`sprite:${portrait||'none'}:${node.time}`","`sprite:${cast.map(a=>(a.character||'Rowan')+':'+a.key+':'+(a.slot||'')).join('|')}:${node.time}`");
const a=s.indexOf('  if(currentSprite&&nextSprite){'),b=s.indexOf('  host.append(layer);',a);
s=s.slice(0,a)+`  if(currentSprite&&nextSprite){
    current.getAnimations().forEach(animation=>animation.cancel());
    const existing=new Map([...current.querySelectorAll('.character-stage')].map(el=>[el.dataset.character,el]));
    for(const next of layer.querySelectorAll('.character-stage')){
      const old=existing.get(next.dataset.character);
      if(old){
        old.className=next.className;
        old.dataset.expression=next.dataset.expression;old.dataset.pose=next.dataset.pose;
        const image=old.querySelector('img'),replacement=next.querySelector('img');
        for(const name of ['src','alt','width','height'])if(image.getAttribute(name)!==replacement.getAttribute(name))image.setAttribute(name,replacement.getAttribute(name));
        existing.delete(next.dataset.character);
      }else current.append(next);
    }
    existing.forEach(el=>el.remove());
    previous.filter(old=>old!==current).forEach(old=>old.remove());
    return;
  }
`+s.slice(b);
fs.writeFileSync('src/app.js',s);
