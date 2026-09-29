import type { Lang } from './company';
export interface Project { slug: string; city: string; service: string; title: Record<Lang,string>; description: Record<Lang,string>; images: {src:string;alt:Record<Lang,string>}[] }
// Add only real projects. See README for a complete example.
export const projects: Project[] = [];
