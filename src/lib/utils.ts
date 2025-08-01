import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string | undefined): string {
  if (!name) return '';
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length === 0) return '';
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  const firstNameInitial = nameParts[0][0];
  const lastNameInitial = nameParts[nameParts.length - 1][0];
  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
}
