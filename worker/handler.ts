import {activeServices} from '../src/data/services';
import {utcDay} from './quota-ledger';
export type Env = Omit<Cloudflare.Env,'QUOTES_ENABLED'|'MAIL_FROM'|'TURNSTILE_HOSTNAME'|'CONTACT_TO'> & {
 TURNSTILE_SECRET_KEY:string; QUOTES_ENABLED:string; MAIL_FROM:string; TURNSTILE_HOSTNAME:string; CONTACT_TO:string;
};
const RECIPIENT='cristian.sandu.connect@gmail.com';
async function visitorKey(ip:string,day:string,secret:string):Promise<string>{
 const encoder=new TextEncoder();
 const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signature=await crypto.subtle.sign('HMAC',key,encoder.encode(`${day}:${ip}`));
 return Array.from(new Uint8Array(signature),byte=>byte.toString(16).padStart(2,'0')).join('');
}
const MB=1024*1024;
const json=(body:object,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const fail=(code:string,status=400)=>json({ok:false,code},status);
// Enforce the limit while reading; Content-Length alone is not trustworthy.
async function limitedBody(request:Request):Promise<ArrayBuffer>{
 if(Number(request.headers.get('content-length'))>10*MB)throw new Error('too_large');
 const reader=request.body?.getReader();if(!reader)throw new Error('empty_body');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>10*MB){await reader.cancel();throw new Error('too_large');}chunks.push(value);}
 const body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}return body.buffer;
}
function imageType(bytes:Uint8Array):string|null {
 if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 if([137,80,78,71,13,10,26,10].every((x,i)=>bytes[i]===x))return 'image/png';
 if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')return 'image/webp';
 return null;
}
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  const url=new URL(request.url);
  if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
  if(url.pathname!=='/api/quote')return fail('not_found',404);
  if(request.method!=='POST')return new Response(null,{status:405,headers:{Allow:'POST'}});
  if(env.QUOTES_ENABLED!=='true'||!env.EMAIL||!env.QUOTE_LIMITS||!env.TURNSTILE_SECRET_KEY||!env.TURNSTILE_HOSTNAME||!env.MAIL_FROM||env.CONTACT_TO!==RECIPIENT)return fail('not_configured',503);
  if(url.hostname!==env.TURNSTILE_HOSTNAME)return fail('hostname_rejected',403);
  if(request.headers.get('origin')!==url.origin)return fail('origin_rejected',403);
  if(!request.headers.get('content-type')?.startsWith('multipart/form-data;'))return fail('invalid_content_type',415);
  try {
   const body=await limitedBody(request);
   const form=await new Response(body,{headers:{'Content-Type':request.headers.get('content-type')!}}).formData();
   const value=(name:string,max:number)=>{const item=form.get(name);if(typeof item!=='string'||item.length>max)return '';return item.trim();};
   if(value('website',500))return fail('spam',400);
   const name=value('name',120),phone=value('phone',40),email=value('email',254),city=value('city',120),service=value('service',40),description=value('description',5000),token=value('cf-turnstile-response',2048);
   if(!name||!city||!/^[+\d\s().-]{6,40}$/.test(phone)||description.length<10||form.get('consent')!=='yes'||!activeServices.some(s=>s.id===service)||!token)return fail('invalid_fields');
   if(form.has('email')&&(typeof form.get('email')!=='string'||String(form.get('email')).length>254))return fail('invalid_email');
   if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return fail('invalid_email');
   const ip=request.headers.get('CF-Connecting-IP');
   if(!ip)return fail('visitor_unavailable',403);
   const files=form.getAll('photos').filter((v):v is File=>typeof v!=='string'&&v.size>0);
   if(files.length>5||files.some(f=>f.size>2*MB)||files.reduce((n,f)=>n+f.size,0)>8*MB)return fail('invalid_photos');
   const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:request.headers.get('CF-Connecting-IP')||undefined}),signal:AbortSignal.timeout(10000)});
   if(!verify.ok)return fail('verification_unavailable',502);
   const challenge=await verify.json() as {success:boolean;hostname?:string;action?:string};
   if(!challenge.success||challenge.hostname!==env.TURNSTILE_HOSTNAME||challenge.action!=='quote')return fail('verification_failed',403);
   const attachments=[];
   for(let i=0;i<files.length;i++){
    const bytes=new Uint8Array(await files[i].arrayBuffer());const type=imageType(bytes);
    if(!type||type!==files[i].type)return fail('invalid_photo_type');
    attachments.push({filename:`photo-${i+1}.${type==='image/jpeg'?'jpg':type==='image/png'?'png':'webp'}`,content:bytes,type,disposition:'attachment' as const});
   }
   let slot:{ok:boolean;code?:string;retryAfter?:number}={ok:false,code:'day_changed'};
   try {
    for(let attempt=0;attempt<2 && slot.code==='day_changed';attempt++){
     const day=utcDay(Date.now());
     const hash=await visitorKey(ip,day,env.TURNSTILE_SECRET_KEY);
     slot=await env.QUOTE_LIMITS.getByName(`quotes:${day}`).reserve(hash,day);
    }
   }catch{return fail('limit_unavailable',503);}
   if(!slot.ok){
    if(slot.code==='daily_limit'||slot.code==='visitor_limit')return new Response(JSON.stringify({ok:false,code:slot.code}),{status:429,headers:{'Content-Type':'application/json','Cache-Control':'no-store','Retry-After':String(slot.retryAfter||60)}});
    return fail('limit_unavailable',503);
   }
   const serviceLabel=activeServices.find(item=>item.id===service)!.fr.name;
   try {
    await env.EMAIL.send({from:{email:env.MAIL_FROM,name:'ST ÉLITE PROJECTS'},to:RECIPIENT,...(email?{replyTo:email}:{}),subject:`Demande de devis — ${serviceLabel}`,text:`Nom: ${name}\nTéléphone: ${phone}\nE-mail: ${email||'Non renseigné'}\nVille: ${city}\nService: ${serviceLabel}\nLangue: ${value('lang',2)}\n\n${description}\n\nPolitique de confidentialité lue: oui`,...(attachments.length?{attachments}:{})});
   }catch{return fail('delivery_failed',502);}
   return json({ok:true});
  }catch(error){return fail(error instanceof Error&&error.message==='too_large'?'too_large':'request_failed',error instanceof Error&&error.message==='too_large'?413:400);}
 }
};
