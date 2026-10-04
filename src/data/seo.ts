import {company, href, pages, type Lang, type Page} from './company';
import {activeServices} from './services';
import copy from './copy.json';

interface Metadata {title:string; description:string}
export const metadata:Record<Lang,Record<Page,Metadata>> = {
 fr: {
  '': {title:'Électricité & plomberie en Île-de-France',description:'ST ÉLITE PROJECTS : électricité et plomberie à Montreuil, Paris et en Île-de-France. Installation, rénovation et dépannage. Demandez un devis gratuit.'},
  services: {title:'Électricité, plomberie et chauffage en Île-de-France',description:'Découvrez nos services : électricité, plomberie, dépannage, eau chaude, pompes à chaleur, photovoltaïque et bornes de recharge en Île-de-France.'},
  about: {title:'Notre entreprise à Montreuil',description:'Découvrez ST ÉLITE PROJECTS, entreprise basée à Montreuil, spécialisée en électricité, plomberie, chauffage et climatisation en Île-de-France.'},
  projects: {title:'Nos réalisations : chauffage, eau chaude et solaire',description:'Découvrez les photos de nos installations : eau chaude, chauffage, climatisation et photovoltaïque. Consultez les réalisations de ST ÉLITE PROJECTS.'},
  contact: {title:'Contact et devis gratuit en Île-de-France',description:'Contactez ST ÉLITE PROJECTS par téléphone, e-mail ou formulaire pour un devis gratuit. Électricité, plomberie et autres travaux à Montreuil et en Île-de-France.'},
  legal: {title:'Mentions légales',description:'Informations légales de ST ÉLITE PROJECTS : identité de l’entreprise, siège à Montreuil, immatriculation, directeur de publication et hébergement.'},
  privacy: {title:'Politique de confidentialité',description:'Consultez les informations sur les données recueillies par le formulaire de ST ÉLITE PROJECTS et les coordonnées pour exercer vos droits.'},
 },
 en: {
  '': {title:'Electrical & plumbing services in Île-de-France',description:'ST ÉLITE PROJECTS provides electrical and plumbing work in Montreuil, Paris and Île-de-France. Installation, renovation and repairs. Request a free quote.'},
  services: {title:'Electrical, plumbing & heating services in Île-de-France',description:'Explore electrical work, plumbing, repairs, hot water, heat pumps, solar power and EV charging services from ST ÉLITE PROJECTS in Île-de-France.'},
  about: {title:'Our company in Montreuil',description:'Meet ST ÉLITE PROJECTS, a Montreuil-based company specialising in electrical work, plumbing, heating and air conditioning throughout Île-de-France.'},
  projects: {title:'Our projects: heating, hot water & solar power',description:'View photographs of heating, hot-water, air-conditioning and solar installations shared by ST ÉLITE PROJECTS. Explore our project gallery.'},
  contact: {title:'Contact & free quotes in Île-de-France',description:'Contact ST ÉLITE PROJECTS by phone, email or enquiry form for a free quote. Electrical, plumbing and other work in Montreuil and Île-de-France.'},
  legal: {title:'Legal notice',description:'Legal information for ST ÉLITE PROJECTS: company identity, registered office in Montreuil, registration, publication director and hosting provider.'},
  privacy: {title:'Privacy policy',description:'Read about the information collected through the ST ÉLITE PROJECTS enquiry form and the contact details for exercising your data rights.'},
 },
};

// Markup describes only facts and services already shown on the website.
export function structuredData(site:URL,lang:Lang,page:Page) {
 const origin=site.origin;
 const url=new URL(href(lang,page),site).href;
 const businessId=`${origin}/#business`;
 const websiteId=`${origin}/#website`;
 const webpageId=`${url}#webpage`;
 const image=`${origin}/images/social-${lang}.png`;
 const meta=metadata[lang][page];
 const business={
  '@type':['Electrician','Plumber'], '@id':businessId, name:company.name,
  url:`${origin}/`, telephone:company.phoneHref, email:company.email,
  logo:`${origin}${company.logo}`, image,
  address:{'@type':'PostalAddress',streetAddress:company.address,addressLocality:'Montreuil',postalCode:'93100',addressRegion:'Île-de-France',addressCountry:'FR'},
  areaServed:[{'@type':'AdministrativeArea',name:'Île-de-France'},{'@type':'City',name:'Paris'},{'@type':'City',name:'Montreuil'}],
  hasOfferCatalog:{'@type':'OfferCatalog',name:lang==='fr'?'Nos services':'Our services',itemListElement:activeServices.map(service=>({'@type':'Offer',itemOffered:{'@id':`${origin}${href(lang,'services')}#${service.id}`}}))},
 };
 const services=activeServices.map(service=>({
  '@type':'Service','@id':`${origin}${href(lang,'services')}#${service.id}`,
  name:service[lang].name,description:service[lang].description,
  url:`${origin}${href(lang,'services')}#${service.id}`,provider:{'@id':businessId},
  areaServed:{'@type':'AdministrativeArea',name:'Île-de-France'},
 }));
 const webpage={
  '@type':page==='about'?'AboutPage':page==='contact'?'ContactPage':page==='projects'?'CollectionPage':'WebPage',
  '@id':webpageId,url,name:`${meta.title} | ${company.name}`,description:meta.description,inLanguage:lang,
  isPartOf:{'@id':websiteId},about:{'@id':businessId},primaryImageOfPage:{'@type':'ImageObject',url:image,width:1200,height:630},
  ...(page?{breadcrumb:{'@id':`${url}#breadcrumb`}}:{}),
 };
 const breadcrumbs=page?[{'@type':'BreadcrumbList','@id':`${url}#breadcrumb`,itemListElement:[
  {'@type':'ListItem',position:1,name:lang==='fr'?'Accueil':'Home',item:new URL(href(lang),site).href},
  {'@type':'ListItem',position:2,name:page==='legal'?copy[lang].legal:page==='privacy'?copy[lang].privacy:copy[lang].nav[pages.indexOf(page)],item:url},
 ]}]:[];
 return {'@context':'https://schema.org','@graph':[
  business,{'@type':'WebSite','@id':websiteId,url:`${origin}/`,name:company.name,inLanguage:['fr','en'],publisher:{'@id':businessId}},
  webpage,...breadcrumbs,...services,
 ]};
}
