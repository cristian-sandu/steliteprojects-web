import type { Lang } from './company';
import type { ImageMetadata } from 'astro';
import photo1 from '../assets/projects/heating-hot-water.jpg';
import photo2 from '../assets/projects/thermodynamic-water-heater.jpg';
import photo3 from '../assets/projects/wall-air-conditioning.jpg';
import photo4 from '../assets/projects/solar-inverter-storage.jpg';
import photo5 from '../assets/projects/rooftop-solar-panels.jpg';
import photo6 from '../assets/projects/outdoor-climate-units.jpg';
import photo7 from '../assets/projects/outdoor-heat-pump.jpg';
export interface Project {slug:string;service:string;title:Record<Lang,string>;description:Record<Lang,string>;image:ImageMetadata}
export const projects:Project[]=[
 {slug:"heating-hot-water",service:"water-heaters",title:{"fr": "Chauffage et eau chaude", "en": "Heating and hot water"},description:{"fr": "Équipements de chauffage et d’eau chaude avec leurs raccordements hydrauliques.", "en": "Heating and hot-water equipment with associated pipework."},image:photo1},
 {slug:"thermodynamic-water-heater",service:"water-heaters",title:{"fr": "Chauffe-eau thermodynamique", "en": "Heat-pump water heater"},description:{"fr": "Chauffe-eau thermodynamique et ses raccordements.", "en": "Heat-pump water heater and its connections."},image:photo2},
 {slug:"wall-air-conditioning",service:"heat-pumps",title:{"fr": "Climatisation murale", "en": "Wall-mounted air conditioning"},description:{"fr": "Unité intérieure de climatisation avec goulotte de raccordement.", "en": "Indoor air-conditioning unit with connection trunking."},image:photo3},
 {slug:"solar-inverter-storage",service:"solar",title:{"fr": "Onduleur et stockage photovoltaïque", "en": "Solar inverter and battery storage"},description:{"fr": "Onduleur photovoltaïque, batterie et coffrets électriques associés.", "en": "Solar inverter, battery and associated electrical enclosures."},image:photo4},
 {slug:"rooftop-solar-panels",service:"solar",title:{"fr": "Panneaux photovoltaïques en toiture", "en": "Rooftop solar panels"},description:{"fr": "Panneaux photovoltaïques disposés sur une toiture en tuiles.", "en": "Solar panels mounted on a tiled roof."},image:photo5},
 {slug:"outdoor-climate-units",service:"heat-pumps",title:{"fr": "Unités extérieures de chauffage et climatisation", "en": "Outdoor heating and cooling units"},description:{"fr": "Unités extérieures et cheminement des raccordements en façade.", "en": "Outdoor units and connection trunking on an exterior wall."},image:photo6},
 {slug:"outdoor-heat-pump",service:"heat-pumps",title:{"fr": "Unité extérieure de pompe à chaleur", "en": "Outdoor heat-pump unit"},description:{"fr": "Unité extérieure de pompe à chaleur montée sur supports.", "en": "Outdoor heat-pump unit mounted on supports."},image:photo7},
];
