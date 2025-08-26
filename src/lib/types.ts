
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
  workType?: WorkType;
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
  featuresAndOpportunities?: string;
  education?: string;
  status?: 'open' | 'closed';
  howToApply?: string;
  isNew?: boolean;
}

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  positionsAvailable: string | number | null;
  deadline: string; // last day for registration
  officialLink: string;
  email?: string;
  howToApply?: string;

  // Optional fields for more detail
  description?: string;
  trainingFeatures?: string;
  fileUrl?: string;
  
  jobProspects?: string; // أفق العمل
  requirements?: string; // الشروط (can include qualifications, age, etc.)
  competitionStages?: string; // مراحل المباراة
  documentsNeeded?: string;
  
  // New date fields
  registrationStartDate?: string;
  competitionDate?: string;

  // New optional fields
  competitionType?: string;
  location?: string;
  
  // Timestamps
  postedAt: string;
  createdAt: Timestamp;
  isNew?: boolean;
}

export interface ImmigrationPost {
  id: string;
  title: string;
  slug: string;
  targetCountry: string;
  city?: string;
  programType: 'work' | 'study' | 'seasonal' | 'training' | 'volunteer';
  iconName: string;
  targetAudience: string;
  salary?: string;
  deadline?: string;
  description?: string;
  requirements?: string;
  qualifications?: string;
  experience?: string;
  tasks?: string;
  featuresAndOpportunities?: string;
  howToApply?: string;
  applyUrl?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  createdAt: Timestamp;
  postedAt: string;
  isNew?: boolean;
}


export interface Organizer {
  name: string;
  icon: string;
  color: string;
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
    rating: number;
    createdAt: Timestamp;
    postedAt: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    author: string;
    imageUrl: string;
    imageHint: string;
    summary: string;
    content: string;
    createdAt: Timestamp;
    postedAt: string;
}

export interface Report {
    id: string;
    adId: string;
    adUrl: string;
    reason: string;
    details?: string;
    createdAt: Timestamp;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Timestamp;
}


export interface Country {
  name: string;
  cities: string[];
}
