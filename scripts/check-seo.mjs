import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
import {join} from 'node:path';

const root=new URL('../dist/',import.meta.url).pathname;
const origin=new URL(process.env.PUBLIC_SITE_URL||'https://steliteprojects.com').origin;
const decode=value=>value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const attributes=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([,key,value])=>[key,decode(value)]));
const tags=(html,name)=>[...html.matchAll(new RegExp(`<${name}\\b[^>]*>`,'g'))].map(([tag])=>attributes(tag));
async function walk(path){const files=[];for(const file of await readdir(path,{withFileTypes:true})){const name=join(path,file.name);files.push(...file.isDirectory()?await walk(name):[name]);}return files;}
async function exists(path){return stat(path).then(()=>true,()=>false);}
const titles=new Set(),descriptions=new Set(),canonicals=new Set();
let links=0;
for(const path of (await walk(root)).filter(path=>path.endsWith('.html'))){
 const html=await readFile(path,'utf8');
 assert.equal(tags(html,'h1').length,1,`${path}: one main heading required`);
 const metas=tags(html,'meta'),headLinks=tags(html,'link');
 const meta=key=>metas.find(item=>item.name===key||item.property===key)?.content;
 const scripts=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(([,json])=>JSON.parse(json));
 if(path.endsWith('/404.html')){assert(meta('robots').includes('noindex'));assert.equal(scripts.length,0);assert(!headLinks.some(link=>link.rel==='canonical'));continue;}
 const canonical=headLinks.filter(link=>link.rel==='canonical');assert.equal(canonical.length,1);
 const url=canonical[0].href;assert.equal(new URL(url).origin,origin);
 const alternates=headLinks.filter(link=>link.rel==='alternate');assert.deepEqual(alternates.map(link=>link.hreflang).sort(),['en','fr','x-default']);
 assert(alternates.some(link=>link.href===url));assert.equal(alternates.find(link=>link.hreflang==='x-default').href,alternates.find(link=>link.hreflang==='fr').href);
 for(const link of alternates)assert.equal(new URL(link.href).origin,origin);
 assert.equal(meta('og:url'),url);assert.equal(meta('og:title'),meta('twitter:title'));
 assert.equal(meta('description'),meta('og:description'));assert.equal(meta('description'),meta('twitter:description'));
 assert.equal(meta('twitter:card'),'summary_large_image');
 for(const image of [meta('og:image'),meta('twitter:image')])assert(await exists(join(root,new URL(image).pathname)),`${path}: share image missing`);
 assert.equal(scripts.length,1);const graph=scripts[0]['@graph'];assert.equal(scripts[0]['@context'],'https://schema.org');
 const ids=graph.map(node=>node['@id']);assert.equal(new Set(ids).size,ids.length);
 const business=graph.find(node=>Array.isArray(node['@type'])&&node['@type'].includes('Electrician'));
 assert(business?.['@type'].includes('Plumber'));assert.equal(business.address.addressCountry,'FR');assert.equal(business.address.postalCode,'93100');
 assert.equal(graph.filter(node=>node['@type']==='Service').length,7);
 const webpage=graph.find(node=>['WebPage','AboutPage','ContactPage','CollectionPage'].includes(node['@type']));assert.equal(webpage.url,url);
 const lang=tags(html,'html')[0].lang;assert.equal(webpage.inLanguage,lang);
 for(const {href} of tags(html,'a').filter(a=>a.href?.startsWith('/'))){
  const target=new URL(href,origin);let file=join(root,target.pathname);
  if((await stat(file)).isDirectory())file=join(file,'index.html');assert(await exists(file),`${path}: broken link ${href}`);
  if(target.hash&&file.endsWith('.html')){const destination=await readFile(file,'utf8');assert([...destination.matchAll(/\bid="([^"]+)"/g)].some(([,id])=>id===decodeURIComponent(target.hash.slice(1))),`${path}: missing fragment ${href}`);}
  links++;
 }
 // French root alias is served as a permanent redirect by Workers assets.
 if(path.endsWith('/fr/index.html'))continue;
 assert(!titles.has(meta('og:title')),`${path}: duplicate title`);assert(!descriptions.has(meta('description')),`${path}: duplicate description`);
 titles.add(meta('og:title'));descriptions.add(meta('description'));canonicals.add(url);
}
assert.equal(canonicals.size,14);
const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');
const entries=[...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([,entry])=>entry);
assert.equal(entries.length,14);
for(const entry of entries){
 const loc=decode(entry.match(/<loc>(.*?)<\/loc>/)[1]);assert(canonicals.has(loc));
 const alternates=tags(entry,'xhtml:link');assert.equal(alternates.length,3);assert(alternates.some(link=>link.href===loc));
 const images=[...entry.matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map(([,url])=>decode(url));assert.equal(images.length,loc.includes('/projects/')?7:0);
 for(const image of images)assert(await exists(join(root,new URL(image).pathname)),`Sitemap image missing: ${image}`);
}
console.log(`SEO checks passed: ${canonicals.size} canonical pages, unique metadata, structured data, sitemap images and ${links} internal links.`);
