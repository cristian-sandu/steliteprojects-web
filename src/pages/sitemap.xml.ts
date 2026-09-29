import type {APIRoute} from 'astro';
import {languages,pages,href} from '../data/company';
export const GET:APIRoute=({site})=>new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${languages.flatMap(l=>pages.map(p=>`<url><loc>${new URL(href(l,p),site)}</loc></url>`)).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
