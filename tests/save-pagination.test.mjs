import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

test('Changing save pages keeps the existing dialog layer mounted',()=>{
  const source=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
  const shell=source.slice(source.indexOf('function shell('),source.indexOf('function savePreview('));
  let removed=0,created=0,appended=0,bound=0;
  const layer={
    querySelector:selector=>selector==='.saves-modal'?{}:null,
    remove:()=>removed++,
    addEventListener:()=>assert.fail('Existing backdrop listener must be retained'),
  };
  const context={
    $:()=>layer,modal:'saves',busy:false,
    document:{createElement:()=>{created++;return layer;},body:{append:()=>appended++}},
    bind:()=>bound++,closeModal:()=>assert.fail('Pagination must not close the dialog'),
  };
  runInNewContext(shell+"\nshell('Saved moments','Page two','saves-modal');shell('Saved moments','Page three','saves-modal');",context);
  assert.equal(removed,0);
  assert.equal(created,0);
  assert.equal(appended,0);
  assert.equal(bound,2);
  assert.match(layer.innerHTML,/Page three/);
});
