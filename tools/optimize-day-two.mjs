import sharp from 'sharp';
import {readdirSync,readFileSync,writeFileSync,statSync} from 'node:fs';
const dir='assets/cg/day-two/';
for(const name of readdirSync(dir).filter(n=>n.endsWith('.png'))){
 const target=dir+name.replace('.png','.webp');
 await sharp(dir+name).webp({quality:82}).toFile(target);
 if(statSync(target).size>=600000)await sharp(dir+name).webp({quality:72}).toFile(target);
 console.log(name,statSync(target).size);
}
const path='assets/manifest.json',m=JSON.parse(readFileSync(path,'utf8'));
for(const [key,value] of Object.entries(m.backgrounds))if(key.startsWith('d2-'))m.backgrounds[key]=value.replace('.png','.webp');
for(const [key,value] of Object.entries(m.cgs))if(key.startsWith('d2-'))value.src=value.src.replace('.png','.webp');
for(const key of ['bedroom-evening','bedroom-night','bedroom-morning'])delete m.cgs['d2-'+key];
writeFileSync(path,JSON.stringify(m,null,2)+'\n');
