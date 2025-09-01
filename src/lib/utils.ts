
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string | undefined): string {
  if (!name) return '';
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length === 0) return '';
  return nameParts[0].substring(0, 1).toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w-]+/g, '') // remove all non-word chars
    .replace(/--+/g, '-'); // replace multiple - with single -
}

export const programTypes = [
    { value: 'work', label: 'عقد عمل', icon: 'FileSignature', color: '#00897B' },
    { value: 'study', label: 'دراسة', icon: 'BookOpen', color: '#8E24AA' },
    { value: 'seasonal', label: 'عمل موسمي', icon: 'Leaf', color: '#43A047' },
    { value: 'training', label: 'تدريب', icon: 'Award', color: '#FB8C00' },
    { value: 'volunteer', label: 'تطوع', icon: 'Handshake', color: '#d946ef' },
    { value: 'crafts', label: 'المهن اليدوية والحرفية', icon: 'Hammer', color: '#6D4C41' },
    { value: 'health', label: 'الصحة', icon: 'Stethoscope', color: '#E53935' },
    { value: 'tech', label: 'التقنية والمكتبي', icon: 'Laptop', color: '#1E88E5' },
    { value: 'transport', label: 'النقل والخدمات', icon: 'Truck', color: '#F4511E' },
    { value: 'hospitality', label: 'الضيافة والتجارة', icon: 'ShoppingCart', color: '#546E7A' },
    { value: 'education', label: 'التعليم', icon: 'School', color: '#3949AB' },
    { value: 'agriculture', label: 'الفلاحة والزراعة', icon: 'Sprout', color: '#7CB342' },
];

export function getProgramTypeDetails(programType: string) {
    const details = programTypes.find(p => p.value === programType);
    // Return a default object if no match is found to prevent errors
    return details || { value: 'work', label: 'عمل', icon: 'Plane', color: '#0ea5e9' };
}
