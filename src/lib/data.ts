

import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, deleteDoc, setDoc, Query, and, QueryConstraint, QueryFilterConstraint } from 'firebase/firestore';
import type { Job, Category, PostType, User, WorkType, Testimonial, Competition, Organizer } from './types';
import Fuse from 'fuse.js';

const categories: Category[] = [
  { id: 'it', name: 'تكنولوجيا المعلومات', iconName: 'Code', color: '#1E88E5' }, // Blue
  { id: 'engineering', name: 'الهندسة', iconName: 'CircuitBoard', color: '#FB8C00' }, // Orange
  { id: 'construction', name: 'البناء والأشغال العامة', iconName: 'HardHat', color: '#78909C' }, // Blue Grey
  { id: 'healthcare', name: 'الصحة والتمريض', iconName: 'Stethoscope', color: '#43A047' }, // Green
  { id: 'education', name: 'التعليم والتدريب', iconName: 'BookOpen', color: '#8E24AA' }, // Purple
  { id: 'finance', name: 'المالية والمحاسبة', iconName: 'Calculator', color: '#00ACC1' }, // Cyan
  { id: 'admin', name: 'الإدارة والسكرتارية', iconName: 'KanbanSquare', color: '#5E35B1' }, // Deep Purple
  { id: 'marketing', name: 'التسويق والمبيعات', iconName: 'Megaphone', color: '#E53935' }, // Red
  { id: 'hr', name: 'الموارد البشرية', iconName: 'Users', color: '#3949AB' }, // Indigo
  { id: 'hospitality', name: 'الفندقة والسياحة', iconName: 'ConciergeBell', color: '#D81B60' }, // Pink
  { id: 'logistics', name: 'النقل واللوجستيك', iconName: 'Truck', color: '#F4511E' }, // Deep Orange
  { id: 'security', name: 'الخدمات الأمنية', iconName: 'Shield', color: '#546E7A' }, // Blue Grey
  { id: 'crafts', name: 'الحرف والصناعات التقليدية', iconName: 'PenTool', color: '#A1887F' }, // Brown
  { id: 'manufacturing', name: 'الصناعة والإنتاج', iconName: 'Factory', color: '#455A64' }, // Blue Grey
  { id: 'law', name: 'القانون والشؤون القانونية', iconName: 'Gavel', color: '#6D4C41' }, // Brown
  { id: 'gov', name: 'وظائف حكومية', iconName: 'Landmark', color: '#0277BD' }, // Light Blue
  { id: 'media', name: 'الإعلام والاتصال', iconName: 'Newspaper', color: '#00897B' }, // Teal
  { id: 'retail', name: 'التجارة والتوزيع', iconName: 'ShoppingCart', color: '#37474F' }, // Blue Grey
  { id: '1', name: 'نجار', iconName: 'Hammer', color: '#6D4C41' }, // Brown
  { id: '2', name: 'حداد', iconName: 'Wrench', color: '#616161' }, // Grey
  { id: '3', name: 'سباك', iconName: 'ShowerHead', color: '#0288D1' }, // Light Blue
  { id: '4', name: 'كهربائي منازل', iconName: 'Zap', color: '#FBC02D' }, // Yellow
  { id: '5', name: 'كهربائي سيارات', iconName: 'Car', color: '#F57C00' }, // Orange
  { id: '6', name: 'فني تبريد وتكييف', iconName: 'AirVent', color: '#0097A7' }, // Cyan
  { id: '7', name: 'فني صيانة هواتف', iconName: 'Smartphone', color: '#303F9F' }, // Indigo
  { id: '8', name: 'خياط', iconName: 'Scissors', color: '#C2185B' }, // Pink
  { id: '9', name: 'مصمم أزياء', iconName: 'Shirt', color: '#D32F2F' }, // Red
  { id: '10', name: 'صباغ', iconName: 'Paintbrush', color: '#7B1FA2' }, // Purple
  { id: '12', name: 'عامل بلاط', iconName: 'Layers', color: '#5D4037' }, // Brown
  { id: '13', name: 'عامل زليج', iconName: 'Layers', color: '#5D4037' }, // Brown
  { id: '14', name: 'ميكانيكي سيارات', iconName: 'Wrench', color: '#512DA8' }, // Deep Purple
  { id: '15', name: 'سائق شاحنة', iconName: 'Truck', color: '#E64A19' }, // Deep Orange
  { id: '16', name: 'سائق تاكسي', iconName: 'Car', color: '#F57C00' }, // Orange
  { id: '17', name: 'سائق توصيل', iconName: 'Bike', color: '#FFA000' }, // Amber
  { id: '18', name: 'فلاح', iconName: 'Sprout', color: '#388E3C' }, // Green
  { id: '19', name: 'راعي غنم', iconName: 'PersonStanding', color: '#689F38' }, // Light Green
  { id: '20', name: 'جزّار', iconName: 'ChefHat', color: '#D32F2F' }, // Red
  { id: '21', name: 'خبّاز', iconName: 'CookingPot', color: '#AFB42B' }, // Lime
  { id: '22', name: 'طباخ', iconName: 'ChefHat', color: '#F57C00' }, // Orange
  { id: '23', name: 'حلواني', iconName: 'Cake', color: '#E91E63' }, // Pink
  { id: '24', name: 'منظف منازل', iconName: 'SprayCan', color: '#03A9F4' }, // Light Blue
  { id: '25', name: 'منظف مكاتب', iconName: 'SprayCan', color: '#03A9F4' }, // Light Blue
  { id: '26', name: 'مربية أطفال', iconName: 'Baby', color: '#FFC107' }, // Amber
  { id: '27', name: 'عاملة منزلية', iconName: 'Home', color: '#455A64' }, // Blue Grey
  { id: '28', name: 'حارس أمن', iconName: 'Shield', color: '#263238' }, // Blue Grey
  { id: '29', name: 'عامل مستودع', iconName: 'Package', color: '#4E342E' }, // Brown
  { id: '30', name: 'نجار ألمنيوم', iconName: 'Hammer', color: '#757575' }, // Grey
  { id: '31', name: 'عامل حدادة فنية', iconName: 'Wrench', color: '#424242' }, // Grey
  { id: '32', name: 'نجار ديكور', iconName: 'Hammer', color: '#8D6E63' }, // Brown
  { id: '33', name: 'رسام جداريات', iconName: 'Paintbrush', color: '#673AB7' }, // Deep Purple
  { id: '34', name: 'عامل في مصنع', iconName: 'Factory', color: '#455A64' }, // Blue Grey
  { id: '35', name: 'عامل في المخابز', iconName: 'CookingPot', color: '#795548' }, // Brown
  { id: '36', name: 'معلم شاورما', iconName: 'ChefHat', color: '#FF9800' }, // Orange
  { id: '37', name: 'معلم مشاوي', iconName: 'ChefHat', color: '#F44336' }, // Red
  { id: '38', name: 'عامل مقهى', iconName: 'Coffee', color: '#5D4037' }, // Brown
  { id: '39', name: 'عامل مطعم', iconName: 'Utensils', color: '#4CAF50' }, // Green
  { id: '40', name: 'عامل غسيل سيارات', iconName: 'Car', color: '#03A9F4' }, // Light Blue
  { id: '41', name: 'فني ألواح شمسية', iconName: 'Sun', color: '#FFB300' }, // Amber
  { id: '42', name: 'معلم سيراميك', iconName: 'Layers', color: '#795548' }, // Brown
  { id: '43', name: 'صانع أحذية', iconName: 'Briefcase', color: '#6D4C41' }, // Brown
  { id: '44', name: 'فني إصلاح أثاث', iconName: 'Wrench', color: '#A1887F' }, // Brown
  { id: '45', name: 'عامل توصيل طلبات', iconName: 'Bike', color: '#FF7043' }, // Deep Orange
  { id: '46', name: 'حلاق رجالي', iconName: 'Scissors', color: '#3F51B5' }, // Indigo
  { id: '47', name: 'حلاقة نسائية', iconName: 'Scissors', color: '#AD1457' }, // Pink
  { id: '48', name: 'فني كاميرات مراقبة', iconName: 'Camera', color: '#263238' }, // Blue Grey
  { id: '49', name: 'فني حواسيب', iconName: 'Laptop', color: '#1976D2' }, // Blue
  { id: '50', name: 'فني طباعة وتصوير', iconName: 'Printer', color: '#546E7A' }, // Blue Grey
  { id: '51', name: 'بائع متجول', iconName: 'ShoppingCart', color: '#00796B' }, // Teal
  { id: '52', name: 'بائع في متجر', iconName: 'Store', color: '#00796B' }, // Teal
  { id: '53', name: 'مساعد بائع', iconName: 'Store', color: '#00796B' }, // Teal
  { id: '54', 'name': 'موظف كاشير', 'iconName': 'Calculator', 'color': '#37474F' }, // Blue Grey
  { id: '55', name: 'عامل تعبئة وتغليف', iconName: 'Package', color: '#4E342E' }, // Brown
  { id: '56', name: 'معلم حدائق وتشجير', iconName: 'Sprout', color: '#4CAF50' }, // Green
  { id: '57', name: 'مبلط', iconName: 'Layers', color: '#795548' }, // Brown
  { id: '58', name: 'دهّان', iconName: 'Paintbrush', color: '#6A1B9A' }, // Purple
  { id: '59', name: 'نجّار أثاث', iconName: 'Hammer', color: '#6D4C41' }, // Brown
  { id: '60', name: 'مرمم أثاث قديم', iconName: 'Wrench', color: '#8D6E63' }, // Brown
  { id: '61', name: 'تقني إصلاح أجهزة كهربائية', iconName: 'CircuitBoard', color: '#0277BD' }, // Light Blue
  { id: '62', name: 'خبير أعشاب طبيعية', iconName: 'Leaf', color: '#2E7D32' }, // Green
  { id: '63', name: 'صانع مواد تنظيف', iconName: 'SprayCan', color: '#006064' }, // Cyan
  { id: '64', name: 'مشغل آلات صناعية', iconName: 'Factory', color: '#455A64' }, // Blue Grey
  { id: '65', name: 'عامل نقل أثاث', iconName: 'Truck', color: '#BF360C' }, // Deep Orange
  { id: '66', name: 'عامل نظافة شوارع', iconName: 'Trash2', color: '#424242' }, // Grey
  { id: '67', name: 'عامل مغسلة ملابس', iconName: 'Shirt', color: '#1565C0' }, // Blue
  { id: '68', name: 'موزع إعلانات', iconName: 'Megaphone', color: '#D84315' }, // Deep Orange
];

const organizers: Organizer[] = [
  { name: "الوزارات والجماعات المحلية", icon: "Landmark", color: "#37474F" },
  { name: "وزارة التربية الوطنية", icon: "BookOpen", color: "#8E24AA" },
  { name: "الأمن والقوات المسلحة", icon: "ShieldCheck", color: "#1E88E5" },
  { name: "الصحة العامة", icon: "Stethoscope", color: "#43A047" },
  { name: "المعاهد العليا والمؤسسات العامة", icon: "FileText", color: '#00897B' },
  { name: "خرّيجون جدد (باك/دبلوم)", icon: "Users", color: '#FB8C00' }
];

function formatTimeAgo(timestamp: any) {
  if (!timestamp || !timestamp.toDate) {
    return 'غير معروف';
  }
  const date = timestamp.toDate();
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    const years = Math.floor(interval);
    return years === 1 ? `قبل سنة` : `قبل ${years} سنوات`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const months = Math.floor(interval);
    return months === 1 ? `قبل شهر` : `قبل ${months} أشهر`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return days === 1 ? `قبل يوم` : `قبل ${days} أيام`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hours = Math.floor(interval);
    return hours === 1 ? `قبل ساعة` : `قبل ${hours} ساعات`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return minutes === 1 ? `قبل دقيقة` : `قبل ${minutes} دقائق`;
  }
  return 'الآن';
}


export async function getJobs(
  options: {
    postType?: PostType;
    count?: number;
    searchQuery?: string;
    country?: string;
    city?: string;
    categoryId?: string;
    workType?: WorkType;
    excludeId?: string;
  } = {}
): Promise<Job[]> {
  try {
    const {
      postType,
      count,
      searchQuery,
      country,
      city,
      categoryId,
      workType,
      excludeId,
    } = options;

    const adsRef = collection(db, 'ads');
    
    // Start with a base query
    let q: Query;

    // Array to hold all our constraints
    const queryConstraints: QueryConstraint[] = [];

    if (postType) {
        queryConstraints.push(where('postType', '==', postType));
    }
    if (categoryId) {
        queryConstraints.push(where('categoryId', '==', categoryId));
    }
    if (workType) {
        queryConstraints.push(where('workType', '==', workType));
    }
    
    // Always sort by creation date
    queryConstraints.push(orderBy('createdAt', 'desc'));

    // Apply the constraints to the query
    q = query(adsRef, ...queryConstraints);


    const querySnapshot = await getDocs(q);

    let jobs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        postedAt: formatTimeAgo(data.createdAt),
      } as Job;
    });
    
    // Client-side filtering
    jobs = jobs.filter(job => {
       if (excludeId && job.id === excludeId) {
        return false;
      }
      return true;
    });

    // Fuzzy search using Fuse.js if a search query is provided
    if (searchQuery || country || city) {
        const searchList = jobs;
        let results = searchList;

        if(searchQuery) {
            const fuse = new Fuse(results, {
                keys: ['title', 'description', 'categoryName', 'country', 'city'],
                includeScore: true,
                threshold: 0.4, // Adjust threshold for more or less strict matching
            });
            results = fuse.search(searchQuery).map(result => result.item);
        }

        if(country) {
            const fuse = new Fuse(results, { keys: ['country'], includeScore: true, threshold: 0.3 });
            results = fuse.search(country).map(result => result.item);
        }

        if(city) {
            const fuse = new Fuse(results, { keys: ['city'], includeScore: true, threshold: 0.3 });
            results = fuse.search(city).map(result => result.item);
        }

        jobs = results;
    }

    if (count) {
      return jobs.slice(0, count);
    }

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    return [];
  }
}


export async function getJobsByUserId(userId: string): Promise<Job[]> {
    try {
        const adsRef = collection(db, 'ads');
        const q = query(adsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            postedAt: formatTimeAgo(doc.data().createdAt),
        } as Job));
    } catch (error) {
        console.error("Error fetching jobs by user ID: ", error);
        return [];
    }
}


export async function getJobById(id: string): Promise<Job | null> {
  try {
    const docRef = doc(db, 'ads', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
          id: docSnap.id, 
          ...data,
          postedAt: formatTimeAgo(data.createdAt),
     } as Job;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching job by ID: ", error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by ID: ", error);
    return null;
  }
}


export async function postJob(jobData: Omit<Job, 'id' | 'createdAt' | 'likes' | 'rating' | 'postedAt'>): Promise<{ id: string }> {
    try {
        const adsCollection = collection(db, 'ads');
        const newJob: { [key: string]: any } = {
            ...jobData,
            createdAt: serverTimestamp(),
            likes: 0,
            rating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
        };
        
        Object.keys(newJob).forEach(key => {
            if (newJob[key] === undefined || newJob[key] === '') {
                delete newJob[key];
            }
        });

        const newDocRef = await addDoc(adsCollection, newJob);
        return { id: newDocRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to post job");
    }
}

export async function updateAd(adId: string, adData: Partial<Job>) {
    try {
        const adRef = doc(db, 'ads', adId);
        
        const dataToUpdate: { [key: string]: any } = {
            ...adData,
            updatedAt: serverTimestamp()
        };
        
        Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] === undefined) {
                delete dataToUpdate[key];
            }
        });

        await updateDoc(adRef, dataToUpdate);
    } catch (e) {
        console.error("Error updating ad: ", e);
        throw new Error("Failed to update ad");
    }
}

export async function deleteAd(adId: string) {
    try {
        const adRef = doc(db, 'ads', adId);
        await deleteDoc(adRef);
    } catch (e) {
        console.error("Error deleting ad: ", e);
        throw new Error("Failed to delete ad");
    }
}

export async function updateUserProfile(uid: string, profileData: Partial<User>) {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error updating user profile: ", e);
        throw new Error("Failed to update profile");
    }
}

export async function addTestimonial(testimonialData: Omit<Testimonial, 'id' | 'createdAt' | 'postedAt'>): Promise<{ id: string }> {
    try {
        const reviewsCollection = collection(db, 'reviews');
        const dataToSave = {
            userId: testimonialData.userId,
            userName: testimonialData.userName,
            userAvatarColor: testimonialData.userAvatarColor,
            content: testimonialData.content,
            createdAt: serverTimestamp(),
        };
        const newDocRef = await addDoc(reviewsCollection, dataToSave);
        return { id: newDocRef.id };
    } catch (e) {
        console.error("Error adding testimonial: ", e);
        throw new Error("Failed to add testimonial");
    }
}

export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                postedAt: formatTimeAgo(data.createdAt),
            } as Testimonial;
        });
    } catch (error) {
        console.error("Error fetching testimonials: ", error);
        return [];
    }
}

export async function deleteTestimonial(testimonialId: string) {
    try {
        await deleteDoc(doc(db, 'reviews', testimonialId));
    } catch (e) {
        console.error("Error deleting testimonial: ", e);
        throw new Error("Failed to delete testimonial");
    }
}

export async function getViewsCount(adId: string): Promise<number> {
    try {
        const viewsCollectionRef = collection(db, 'ads', adId, 'views');
        const snapshot = await getDocs(viewsCollectionRef);
        return snapshot.size;
    } catch (error) {
        console.error(`Error getting views for ad ${adId}:`, error);
        return 0;
    }
}

export async function recordView(adId: string, viewerId: string): Promise<void> {
  if (!adId || !viewerId) {
    console.warn("recordView: adId or viewerId is missing.");
    return;
  }
  try {
    const viewDocRef = doc(db, 'ads', adId, 'views', viewerId);
    await setDoc(viewDocRef, { viewedAt: serverTimestamp() });
  } catch (error) {
    console.error(`Error recording view for ad ${adId} by user ${viewerId}:`, error);
  }
}


// Functions for Competitions
export async function postCompetition(competitionData: Omit<Competition, 'id' | 'createdAt' | 'postedAt'>): Promise<{ id: string }> {
  try {
    const competitionsCollection = collection(db, 'competitions');
    const newCompetition: { [key: string]: any } = {
        ...competitionData,
        createdAt: serverTimestamp(),
    };
    
    Object.keys(newCompetition).forEach(key => {
        if (newCompetition[key] === undefined || newCompetition[key] === '') {
            delete newCompetition[key];
        }
    });

    const newDocRef = await addDoc(competitionsCollection, newCompetition);
    return { id: newDocRef.id };
  } catch (e) {
    console.error("Error adding competition: ", e);
    throw new Error("Failed to post competition");
  }
}

export async function getCompetitions(options: { 
  count?: number;
  searchQuery?: string;
  location?: string;
} = {}): Promise<Competition[]> {
  try {
    const { count, searchQuery, location } = options;
    const competitionsRef = collection(db, 'competitions');
    const q = query(competitionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    let competitions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        postedAt: formatTimeAgo(data.createdAt),
      } as Competition;
    });

    if (searchQuery || location) {
        const searchList = competitions;
        let results = searchList;

        if (searchQuery) {
            const fuse = new Fuse(results, {
                keys: ['title', 'organizer', 'description'],
                includeScore: true,
                threshold: 0.4,
            });
            results = fuse.search(searchQuery).map(result => result.item);
        }

        if (location) {
            const fuse = new Fuse(results, {
                keys: ['location'],
                includeScore: true,
                threshold: 0.3,
            });
            results = fuse.search(location).map(result => result.item);
        }

        competitions = results;
    }

    if (count) {
      return competitions.slice(0, count);
    }
    
    return competitions;
  } catch (error) {
    console.error("Error fetching competitions: ", error);
    return [];
  }
}


export async function getCompetitionById(id: string): Promise<Competition | null> {
  try {
    const docRef = doc(db, 'competitions', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
          id: docSnap.id, 
          ...data,
          postedAt: formatTimeAgo(data.createdAt),
     } as Competition;
    } else {
      console.log("No such competition document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching competition by ID: ", error);
    return null;
  }
}

export async function updateCompetition(id: string, competitionData: Partial<Competition>): Promise<void> {
    try {
        const competitionRef = doc(db, 'competitions', id);
        const dataToUpdate: { [key: string]: any } = {
            ...competitionData,
            updatedAt: serverTimestamp()
        };
        
        Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] === undefined) {
                delete dataToUpdate[key];
            }
        });

        await updateDoc(competitionRef, dataToUpdate);
    } catch (e) {
        console.error("Error updating competition: ", e);
        throw new Error("Failed to update competition");
    }
}

export async function deleteCompetition(competitionId: string) {
    try {
        await deleteDoc(doc(db, 'competitions', competitionId));
    } catch (e) {
        console.error("Error deleting competition: ", e);
        throw new Error("Failed to delete competition");
    }
}

export function getCategories() {
  return categories;
}

export function getCategoryById(id: string) {
    return categories.find((cat) => cat.id === id);
}

export function getOrganizers() {
  return organizers;
}

export function getOrganizerByName(organizerName?: string): Organizer | undefined {
    if (!organizerName) return undefined;
    return organizers.find(o => o.name === organizerName);
}

// Admin Functions
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as User));
  } catch (error) {
    console.error("Error fetching all users: ", error);
    return [];
  }
}

export async function deleteUser(userId: string) {
    try {
        // This only deletes the Firestore document, not the Firebase Auth user.
        // Deleting the Auth user requires admin privileges, typically via a backend function.
        await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
        console.error("Error deleting user document: ", e);
        throw new Error("Failed to delete user document");
    }
}

    