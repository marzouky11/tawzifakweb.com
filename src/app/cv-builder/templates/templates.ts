
import type { CVData } from '../cv-form';
import Template1 from './template1/component';
import styles1 from './template1/styles';
import Template2 from './template2/component';
import styles2 from './template2/styles';
import Template3 from './template3/component';
import styles3 from './template3/styles';
import Template6 from './template6/component';
import styles6 from './template6/styles';
import Template11 from './template11/component';
import styles11 from './template11/styles';
import Template12 from './template12/component';
import styles12 from './template12/styles';
import Template13 from './template13/component';
import styles13 from './template13/styles';
import Template14 from './template14/component';
import styles14 from './template14/styles';
import { FileText, Palette, Feather, Award, Gem, Briefcase, Star, Newspaper, Sparkles, FolderArchive, LucideIcon, Type, CheckCircle } from 'lucide-react';

export interface CVTemplate {
  id: string;
  name: string;
  component: React.FC<{ data: CVData }>;
  thumbnail: string;
  styles: string;
  icon: LucideIcon;
  color: string;
  type: 'creative' | 'ats';
}

export const templates: CVTemplate[] = [
  {
    id: 'template1',
    name: 'أزرق عصري',
    component: Template1,
    thumbnail: 'https://i.ibb.co/3sHwM3r/template1.png',
    styles: styles1,
    icon: Palette,
    color: '#0056b3',
    type: 'creative',
  },
  {
    id: 'template2',
    name: 'رمادي جانبي',
    component: Template2,
    thumbnail: 'https://i.ibb.co/6P0p2my/template2.png',
    styles: styles2,
    icon: Feather,
    color: '#1abc9c',
    type: 'creative',
  },
   {
    id: 'template3',
    name: 'أحمر أنيق',
    component: Template3,
    thumbnail: 'https://i.ibb.co/Q8Q49p4/template3.png',
    styles: styles3,
    icon: Award,
    color: '#C0392B',
    type: 'creative',
  },
   {
    id: 'template6',
    name: 'لافتة مبتكرة',
    component: Template6,
    thumbnail: 'https://i.ibb.co/pLgX9n9/template6.png',
    styles: styles6,
    icon: Sparkles,
    color: '#3498DB',
    type: 'creative',
  },
  {
    id: 'template11',
    name: 'ATS بسيط',
    component: Template11,
    thumbnail: 'https://i.ibb.co/L5Qyv2k/template9.png',
    styles: styles11,
    icon: Type,
    color: '#334155',
    type: 'ats',
  },
  {
    id: 'template12',
    name: 'ATS احترافي',
    component: Template12,
    thumbnail: 'https://i.ibb.co/L5Qyv2k/template9.png',
    styles: styles12,
    icon: Type,
    color: '#1e293b',
    type: 'ats',
  },
    {
    id: 'template13',
    name: 'ATS حديث',
    component: Template13,
    thumbnail: 'https://i.ibb.co/L5Qyv2k/template9.png',
    styles: styles13,
    icon: Type,
    color: '#4338ca',
    type: 'ats',
  },
  {
    id: 'template14',
    name: 'ATS كلاسيكي',
    component: Template14,
    thumbnail: 'https://i.ibb.co/L5Qyv2k/template9.png',
    styles: styles14,
    icon: Type,
    color: '#7f1d1d',
    type: 'ats',
  },
];
