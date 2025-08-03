
import type { CVData } from '../cv-form';
import Template1 from './template1/component';
import styles1 from './template1/styles';
import Template2 from './template2/component';
import styles2 from './template2/styles';
import Template3 from './template3/component';
import styles3 from './template3/styles';
import Template4 from './template4/component';
import styles4 from './template4/styles';
import Template5 from './template5/component';
import styles5 from './template5/styles';
import Template6 from './template6/component';
import styles6 from './template6/styles';


export interface CVTemplate {
  id: string;
  name: string;
  component: React.FC<{ data: CVData }>;
  thumbnail: string;
  styles: string;
}

export const templates: CVTemplate[] = [
  {
    id: 'template1',
    name: 'قالب عصري',
    component: Template1,
    thumbnail: 'https://i.ibb.co/3sHwM3r/template1.png',
    styles: styles1,
  },
  {
    id: 'template2',
    name: 'قالب كلاسيكي',
    component: Template2,
    thumbnail: 'https://i.ibb.co/6P0p2my/template2.png',
    styles: styles2,
  },
   {
    id: 'template3',
    name: 'قالب أنيق',
    component: Template3,
    thumbnail: 'https://i.ibb.co/Q8Q49p4/template3.png',
    styles: styles3,
  },
  {
    id: 'template4',
    name: 'قالب بسيط',
    component: Template4,
    thumbnail: 'https://i.ibb.co/CBrz3fT/template4.png',
    styles: styles4,
  },
    {
    id: 'template5',
    name: 'قالب احترافي',
    component: Template5,
    thumbnail: 'https://i.ibb.co/68gPZYC/template5.png',
    styles: styles5,
  },
   {
    id: 'template6',
    name: 'قالب مبتكر',
    component: Template6,
    thumbnail: 'https://i.ibb.co/pLgX9n9/template6.png',
    styles: styles6,
  },
];
