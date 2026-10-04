import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {utcDay} from '../../worker/quota-ledger';
test('real Durable Object serialises 100 requests, schedules retention and purges SQLite',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'quote-limits-'));let runtime:Miniflare|undefined;
 try{
  await build({entryPoints:['tests/runtime/quota-fixture.ts'],bundle:true,format:'esm',external:['cloudflare:workers'],outfile:join(dir,'worker.js')});
  runtime=new Miniflare(convertV4MiniflareOptions({name:'quota-test',modules:true,script:await readFile(join(dir,'worker.js'),'utf8'),compatibilityDate:'2026-09-29',durableObjects:{QUOTE_LIMITS:{className:'TestQuoteLimits',useSQLite:true}}}));
  const results=await Promise.all(Array.from({length:100},async(_,i)=>{const response=await runtime!.dispatchFetch('https://example.test/?visitor='+i.toString(16).padStart(64,'0'));return await response.json() as {ok:boolean;code?:string};}));
  assert.equal(results.filter(r=>r.ok).length,50);assert.equal(results.filter(r=>r.code==='daily_limit').length,50);
  const status=await (await runtime.dispatchFetch('https://example.test/inspect')).json() as {used:number;alarm:number};
  assert.equal(status.used,50);assert.equal(status.alarm,Date.parse(utcDay(Date.now())+'T00:00:00Z')+2*86400000);
  const tables=await (await runtime.dispatchFetch('https://example.test/expire')).json();assert.deepEqual(tables,[]);
 }finally{await runtime?.dispose();await rm(dir,{recursive:true,force:true});}
});
