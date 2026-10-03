export const company = {
 name: 'ST ÉLITE PROJECTS', phone: '07 51 38 28 97', phoneHref: '+33751382897',
 email: 'steliteprojects@gmail.com', address: '29 rue Saint-Exupéry', city: '93100 Montreuil',
 siren: '130 324 429', rcs: 'Bobigny — 2026 B 10309', capital: '1 000 €',
 director: 'Artur SANDU', president: 'Artur SANDU',
 registrationDate: '22/09/2026', activityStartDate: '13/09/2026', euid: 'FR9301.130324429', siret: '130 324 429 00013', vat: '', mediator: '', host: '',
 // Originals go in public/images. Leave blank until supplied.
 logo: '/images/st-elite-projects-signature.png', heroImage: '',
};
export type Lang = 'fr' | 'en';
export const defaultLanguage: Lang = 'fr';
export const languages: Lang[] = ['fr', 'en'];
export const pages = ['', 'services', 'projects', 'about', 'contact', 'legal', 'privacy'] as const;
export type Page = typeof pages[number];
export const href = (lang: Lang, page: string = '') => lang === defaultLanguage && !page ? '/' : `/${lang}/${page ? page + '/' : ''}`;
