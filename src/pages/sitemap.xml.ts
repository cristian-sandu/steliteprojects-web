import type {APIRoute} from 'astro';
import {languages,pages,href} from '../data/company';
import {projects} from '../data/projects';
import {getImage} from 'astro:assets';
const escapeXml=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
export const GET:APIRoute=async({site})=>{
 const absolute=(path:string)=>escapeXml(new URL(path,site).href);
 const images=await Promise.all(projects.map(project=>getImage({src:project.image,width:1280,format:'webp',quality:85})));
 const entries=languages.flatMap(lang=>pages.map(page=>{
  const alternates=[...languages.map(l=>`<xhtml:link rel="alternate" hreflang="${l}" href="${absolute(href(l,page))}"/>`),`<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(href('fr',page))}"/>`].join('');
  const photographs=page==='projects'?images.map(image=>`<image:image><image:loc>${absolute(image.src)}</image:loc></image:image>`).join(''):'';
  return `<url><loc>${absolute(href(lang,page))}</loc>${alternates}${photographs}</url>`;
 }));
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=UTF-8'}});
};
