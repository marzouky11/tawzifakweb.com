
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
    { value: 'work', label: 'عمل', icon: 'Briefcase', color: '#0D47A1' }, // Dark Blue
    { value: 'study', label: 'دراسة', icon: 'BookOpen', color: '#8E24AA' }, // Purple
    { value: 'seasonal', label: 'موسمي', icon: 'Leaf', color: '#43A047' }, // Green
    { value: 'training', label: 'تدريب', icon: 'Award', color: '#FB8C00' }, // Orange
    { value: 'volunteer', label: 'تطوع', icon: 'Handshake', color: '#d946ef' }, // Fuchsia
];

export function getProgramTypeDetails(programType: 'work' | 'study' | 'seasonal' | 'training' | 'volunteer') {
    const details = programTypes.find(p => p.value === programType);
    // Return a default object if no match is found to prevent errors
    return details || { value: 'work', label: 'عمل', icon: 'Plane', color: '#0ea5e9' };
}
