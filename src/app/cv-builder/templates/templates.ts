
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
import Template7 from './template7/component';
import styles7 from './template7/styles';
import Template8 from './template8/component';
import styles8 from './template8/styles';
import Template9 from './template9/component';
import styles9 from './template9/styles';
import Template10 from './template10/component';
import styles10 from './template10/styles';
import { FileText, Palette, Feather, Award, Gem, Briefcase, Star, Newspaper, Sparkles, FolderArchive, LucideIcon } from 'lucide-react';

export interface CVTemplate {
  id: string;
  name: string;
  component: React.FC<{ data: CVData }>;
  thumbnail: string;
  styles: string;
  icon: LucideIcon;
}

export const templates: CVTemplate[] = [
  {
    id: 'template1',
    name: 'أزرق عصري',
    component: Template1,
    thumbnail: 'https://i.ibb.co/3sHwM3r/template1.png',
    styles: styles1,
    icon: Palette,
  },
  {
    id: 'template2',
    name: 'رمادي جانبي',
    component: Template2,
    thumbnail: 'https://i.ibb.co/6P0p2my/template2.png',
    styles: styles2,
    icon: Feather,
  },
   {
    id: 'template3',
    name: 'أحمر أنيق',
    component: Template3,
    thumbnail: 'https://i.ibb.co/Q8Q49p4/template3.png',
    styles: styles3,
    icon: Award
  },
  {
    id: 'template4',
    name: 'أزرق بسيط',
    component: Template4,
    thumbnail: 'https://i.ibb.co/CBrz3fT/template4.png',
    styles: styles4,
    icon: FileText
  },
    {
    id: 'template5',
    name: 'احترافي مقسّم',
    component: Template5,
    thumbnail: 'https://i.ibb.co/68gPZYC/template5.png',
    styles: styles5,
    icon: Briefcase,
  },
   {
    id: 'template6',
    name: 'لافتة مبتكرة',
    component: Template6,
    thumbnail: 'https://i.ibb.co/pLgX9n9/template6.png',
    styles: styles6,
    icon: Sparkles
  },
  {
    id: 'template7',
    name: 'أخضر هادئ',
    component: Template7,
    thumbnail: 'https://i.ibb.co/tZ5G7qd/template7.png',
    styles: styles7,
    icon: Gem
  },
  {
    id: 'template8',
    name: 'داكن حديث',
    component: Template8,
    thumbnail: 'https://i.ibb.co/Kz2gVq5/template8.png',
    styles: styles8,
    icon: Star
  },
  {
    id: 'template9',
    name: 'أصفر جريء',
    component: Template9,
    thumbnail: 'https://i.ibb.co/L5Qyv2k/template9.png',
    styles: styles9,
    icon: Newspaper
  },
  {
    id: 'template10',
    name: 'بسيط جداً',
    component: Template10,
    thumbnail: 'https://i.ibb.co/rfn3Y2r/template10.png',
    styles: styles10,
    icon: FolderArchive
  },
];
