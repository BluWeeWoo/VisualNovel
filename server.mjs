import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildProviderRequest, guardReply, normalizeContext} from './src/provider-policy.js';

const root = path.dirname(fileURLToPath(import.meta.url));
// Optional local configuration; never served by the static route.
try {
  const env = await readFile(path.join(root,'.env'),'utf8');
  for (const row of env.split(/\r?\n/)) {
    const match = row.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g,'');
  }
} catch (e) { if (e.code !== 'ENOENT') console.error('Could not read local configuration.'); }
const port = Number(process.env.PORT || 4173);
const endpoint = process.env.AI_ADAPTER_URL;
const configured = !!endpoint;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg'};
let lastRequest=0;
const send=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(body));};
export const server = http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  res.setHeader('Cache-Control','no-store');
  const allowedHost = `127.0.0.1:${port}`;
  if (![allowedHost,`localhost:${port}`].includes(req.headers.host)) return send(res,403,{error:'Local host only'});
  const url = new URL(req.url,`http://${allowedHost}`);
  if (url.pathname === '/api/config' && req.method === 'GET') return send(res,200,{available:configured,provider:configured?(process.env.AI_PROVIDER_LABEL || 'Configured external AI provider').slice(0,80):null});
  if (url.pathname === '/api/chat' && req.method === 'POST') {
    if (![`http://${allowedHost}`,`http://localhost:${port}`].includes(req.headers.origin)) return send(res,403,{error:'Origin rejected'});
    if (!configured) return send(res,503,{error:'No AI provider configured'});
    if (Date.now()-lastRequest<800) return send(res,429,{error:'Please wait'});
    lastRequest=Date.now();
    let raw='';
    try {
      for await (const chunk of req) {raw+=chunk; if(Buffer.byteLength(raw)>16000) return send(res,413,{error:'Message too large'});}
      const body=JSON.parse(raw);
      if(typeof body.message!=='string' || !body.message.trim() || body.message.length>600) return send(res,400,{error:'Message must be 1–600 characters'});
      const context=normalizeContext(body.context);
      if(context.turns>=4) return send(res,409,{error:'Opening preview complete'});
      const bounded=guardReply(null,body.message);
      if(bounded) return send(res,200,{reply:bounded});
      const result=await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json',...(process.env.AI_API_KEY?{Authorization:`Bearer ${process.env.AI_API_KEY}`}:{})},body:JSON.stringify(buildProviderRequest(context,body.message)),signal:AbortSignal.timeout(20000)});
      if(!result.ok) return send(res,502,{error:'Provider unavailable'});
      const data=await result.json();
      if(typeof data.reply!=='string' || !data.reply.trim() || data.reply.length>900) return send(res,502,{error:'Invalid provider reply'});
      send(res,200,{reply:guardReply(data.reply,body.message) || data.reply.trim()});
    } catch {send(res,502,{error:'Unable to reach provider'});}
    return;
  }
  if (req.method!=='GET' && req.method!=='HEAD') return send(res,405,{error:'Method not allowed'});
  let pathname;
  try {pathname=decodeURIComponent(url.pathname);} catch{return send(res,400,{error:'Invalid path'});}
  const relative=pathname==='/'?'index.html':pathname.slice(1);
  const publicFile=relative==='index.html'||relative==='styles.css'||/^src\/(app|phone-ui|engine|story|continuation|opening|opening-audio|chat|audio|characters|staging)\.js$/.test(relative)||/^assets\/[a-zA-Z0-9_./-]+$/.test(relative);
  const target=path.resolve(root,relative);
  if(!publicFile || !target.startsWith(root+path.sep) || relative.split('/').includes('..')) return send(res,404,{error:'Not found'});
  try {const bytes=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:bytes);}
  catch {send(res,404,{error:'Not found'});}
});
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  server.listen(port,'127.0.0.1',()=>console.log(`Our Summer, Unfinished is ready at http://127.0.0.1:${port}\nKeep this window open while playing. Press Ctrl+C to stop.`));
  server.on('error',e=>{console.error(e.code==='EADDRINUSE'?`Port ${port} is already in use. The game may already be running.`:e.message);process.exitCode=1;});
}

