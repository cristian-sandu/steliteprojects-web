export const DAILY_LIMIT = 50;
export const VISITOR_DAILY_LIMIT = 3;
export const VISITOR_COOLDOWN_MS = 10 * 60 * 1000;
export type QuotaResult = {ok:true} | {ok:false;code:'daily_limit'|'visitor_limit';retryAfter:number};
export type LedgerSql = Pick<SqlStorage, 'exec'>;
export const utcDay = (now:number) => new Date(now).toISOString().slice(0,10);
export const untilNextDay = (now:number) => Math.ceil((Date.parse(`${utcDay(now)}T00:00:00Z`) + 86400000 - now)/1000);
export function initLedger(sql:LedgerSql):void {
 sql.exec('CREATE TABLE IF NOT EXISTS quota (id INTEGER PRIMARY KEY CHECK (id = 1), used INTEGER NOT NULL)');
 sql.exec('INSERT OR IGNORE INTO quota (id, used) VALUES (1, 0)');
 sql.exec('CREATE TABLE IF NOT EXISTS visitors (visitor TEXT PRIMARY KEY, used INTEGER NOT NULL, last_attempt INTEGER NOT NULL)');
}
// All reads/writes run inside the Durable Object's synchronous SQLite transaction.
// Slots are not refunded: a provider timeout can occur after delivery was accepted.
export function reserveSlot(sql:LedgerSql,visitor:string,now:number):QuotaResult {
 const global=sql.exec<{used:number}>('SELECT used FROM quota WHERE id = 1').toArray()[0];
 if(global.used >= DAILY_LIMIT)return {ok:false,code:'daily_limit',retryAfter:untilNextDay(now)};
 const previous=sql.exec<{used:number;last_attempt:number}>('SELECT used, last_attempt FROM visitors WHERE visitor = ?',visitor).toArray()[0];
 if(previous?.used >= VISITOR_DAILY_LIMIT)return {ok:false,code:'visitor_limit',retryAfter:untilNextDay(now)};
 if(previous && now-previous.last_attempt < VISITOR_COOLDOWN_MS)return {ok:false,code:'visitor_limit',retryAfter:Math.ceil((VISITOR_COOLDOWN_MS-(now-previous.last_attempt))/1000)};
 sql.exec('UPDATE quota SET used = used + 1 WHERE id = 1');
 sql.exec('INSERT INTO visitors (visitor, used, last_attempt) VALUES (?, 1, ?) ON CONFLICT(visitor) DO UPDATE SET used = used + 1, last_attempt = excluded.last_attempt',visitor,now);
 return {ok:true};
}
