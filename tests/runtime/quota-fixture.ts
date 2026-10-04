import {QuoteLimits} from '../../worker/quote-limits';
import {utcDay} from '../../worker/quota-ledger';
// Local test adapter only; these inspection methods are never deployed.
export class TestQuoteLimits extends QuoteLimits {
 async inspect(){return {used:this.ctx.storage.sql.exec<{used:number}>('SELECT used FROM quota').one().used,alarm:await this.ctx.storage.getAlarm()};}
 async expire(){await this.alarm();return this.ctx.storage.sql.exec('SELECT name FROM sqlite_master WHERE type = \'table\' AND name NOT LIKE \'_cf_%\'').toArray();}
}
export default {async fetch(request:Request,env:any){const url=new URL(request.url);const day=utcDay(Date.now());const stub=env.QUOTE_LIMITS.getByName(`quotes:${day}`);return Response.json(url.pathname==='/inspect'?await stub.inspect():url.pathname==='/expire'?await stub.expire():await stub.reserve(url.searchParams.get('visitor'),day));}};
