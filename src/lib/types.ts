

import type { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

export type WorkType = 'full_time' | 'part_time' | 'freelance' | 'remote';
export type PostType = 'seeking_worker' | 'seeking_job';
export type SortByType = 'latest' | 'oldest';

export interface Job {
  id: string;
  userId: string;
  postType: PostType;
  title: string;
  categoryId?: string;
  categoryName?: string;
  country: string;
  city: string;
  workType: WorkType;
  description?: string;
  experience?: string;
  salary?: string;
  companyName?: string;
  openPositions?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  rating: number;
  likes: number;
  postedAt: string; // This is a derived string like "2 days ago"
  createdAt: Timestamp;
  ownerName: string;
  ownerAvatarColor?: string;
  applyUrl?: string;
  qualifications?: string;
  conditions?: string;
  tasks?: string;
  education?: string;
  status?: 'open' | 'closed';
  views?: number;
  howToApply?: string;
}

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  location: string;
  competitionType: string;
  positionsAvailable: number;
  requirements: string;
  documentsNeeded: string;
  deadline: string; // Storing as string for simplicity, can be converted to Date
  officialLink: string;
  description?: string;
  fileUrl?: string;
  postedAt: string;
  createdAt: Timestamp;
}

export interface Organizer {
  name: string;
  icon: string;
}

export interface User {
  id:string;
  name: string;
  email: string;
  country?: string;
  city?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  avatarColor?: string;
  categoryId?: string;
  description?: string;
  createdAt?: Timestamp;
  gender?: 'male' | 'female';
  isAdmin?: boolean;
}

export interface Testimonial {
    id: string;
    userId: string;
    userName: string;
    userAvatarColor: string;
    content: string;
    createdAt: Timestamp;
    postedAt: string;
}

export interface Country {
  name: string;
  cities: string[];
}
