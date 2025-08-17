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
