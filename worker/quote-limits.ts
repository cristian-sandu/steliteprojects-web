import {DurableObject} from 'cloudflare:workers';
import {initLedger,reserveSlot,utcDay,type QuotaResult} from './quota-ledger';
export class QuoteLimits extends DurableObject<Cloudflare.Env> {
 constructor(ctx:DurableObjectState,env:Cloudflare.Env){
  super(ctx,env);
  ctx.storage.transactionSync(()=>initLedger(ctx.storage.sql));
 }
 async reserve(visitor:string,day:string):Promise<QuotaResult | {ok:false;code:'day_changed'}> {
  const now=Date.now();
  if(day!==utcDay(now))return {ok:false,code:'day_changed'};
  if(!/^[a-f0-9]{64}$/.test(visitor))throw new Error('invalid_visitor');
  const result=this.ctx.storage.transactionSync(()=>reserveSlot(this.ctx.storage.sql,visitor,now));
  if(result.ok && await this.ctx.storage.getAlarm()===null)await this.ctx.storage.setAlarm(Date.parse(`${day}T00:00:00Z`)+2*86400000);
  return result;
 }
 async alarm():Promise<void>{await this.ctx.storage.deleteAll();}
}
