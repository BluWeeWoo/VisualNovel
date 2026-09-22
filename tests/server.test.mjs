import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import http from 'node:http';

async function launch(port,extra={}){
  const child=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port),AI_ADAPTER_URL:'',...extra},stdio:['ignore','pipe','pipe'],windowsHide:true});
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Server did not start')),5000);child.stdout.on('data',data=>{if(String(data).includes('ready at')){clearTimeout(timer);resolve();}});child.once('error',reject);});
  return {child,base:`http://127.0.0.1:${port}`};
}
test('Server serves game but protects secrets and spoiler documents; offline API is explicit',async()=>{
  const {child,base}=await launch(4187);
  try {
    assert.equal((await fetch(base)).status,200);
    assert.equal((await fetch(base+'/src/story.js')).status,200);
    for(const file of ['/.env','/.env.example','/server.mjs','/docs/STORY-OUTLINE-SPOILERS.md','/src/provider-policy.js','/package.json','/assets/../../.env'])assert.equal((await fetch(base+file)).status,404);
    assert.deepEqual(await(await fetch(base+'/api/config')).json(),{available:false,provider:null});
    assert.equal((await fetch(base+'/api/chat',{method:'POST',headers:{Origin:'https://unrelated.example'},body:'{}'})).status,403);
    assert.equal((await fetch(base+'/api/chat',{method:'POST',headers:{Origin:base},body:'{}'})).status,503);
    const badHost=await new Promise((resolve,reject)=>{http.get(base,{headers:{Host:'evil.example'}},res=>{res.resume();resolve(res.statusCode);}).on('error',reject);});
    assert.equal(badHost,403);
  }finally{child.kill();}
});
test('Configured adapter receives bounded context and a server-side key; errors retry safely',async()=>{
  let captured,mode='success';
  const mock=http.createServer(async(req,res)=>{let raw='';for await(const c of req)raw+=c;captured={headers:req.headers,body:JSON.parse(raw)};res.setHeader('Content-Type','application/json');if(mode==='fail'){res.writeHead(503);res.end('{}');}else res.end(JSON.stringify({reply:mode==='unsafe'?'I love you forever.':'I’ll bring the flask. You bring yourself.'}));});
  await new Promise(r=>mock.listen(4189,'127.0.0.1',r));
  const {child,base}=await launch(4188,{AI_ADAPTER_URL:'http://127.0.0.1:4189/chat',AI_API_KEY:'test-only-key',AI_PROVIDER_LABEL:'Local test adapter'});
  const post=()=>fetch(base+'/api/chat',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({message:'hello',context:{chapter:5,milestone:'Committed',turns:0,choices:{relationship:'friendship'}}})});
  try {
    assert.equal((await(await fetch(base+'/api/config')).json()).provider,'Local test adapter');
    const response=await post();assert.equal(response.status,200);assert.match((await response.json()).reply,/flask/);
    assert.equal(captured.headers.authorization,'Bearer test-only-key');assert.equal(captured.body.context.chapter,1);assert.equal(captured.body.context.milestone,'Familiar');
    assert.equal((await post()).status,429);
    await new Promise(r=>setTimeout(r,830));mode='fail';assert.equal((await post()).status,502);
    await new Promise(r=>setTimeout(r,830));mode='unsafe';assert.doesNotMatch((await(await post()).json()).reply,/I love you/);
  }finally{child.kill();await new Promise(r=>mock.close(r));}
});
