import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, deleteDoc, setDoc, QueryConstraint, and, or, QueryFilterConstraint } from 'firebase/firestore';
import type { Job, Category, PostType, User, WorkType, Testimonial } from './types';
import Fuse from 'fuse.js';

const categories: Category[] = [
  { id: '1', name: 'نجار', iconName: 'Hammer', color: '#a16207' },
  { id: '2', name: 'حداد', iconName: 'Wrench', color: '#475569' },
  { id: '3', name: 'سباك', iconName: 'ShowerHead', color: '#0ea5e9' },
  { id: '4', name: 'كهربائي منازل', iconName: 'Zap', color: '#facc15' },
  { id: '5', name: 'كهربائي سيارات', iconName: 'Car', color: '#f59e0b' },
  { id: '6', name: 'فني تبريد وتكييف', iconName: 'AirVent', color: '#38bdf8' },
  { id: '7', name: 'فني صيانة هواتف', iconName: 'Smartphone', color: '#64748b' },
  { id: '8', name: 'خياط', iconName: 'Scissors', color: '#ec4899' },
  { id: '9', name: 'مصمم أزياء', iconName: 'Shirt', color: '#d946ef' },
  { id: '10', name: 'صباغ', iconName: 'Paintbrush', color: '#a855f7' },
  { id: '11', name: 'بناء', iconName: 'HardHat', color: '#f97316' },
  { id: '12', name: 'عامل بلاط', iconName: 'Layers', color: '#78716c' },
  { id: '13', name: 'عامل زليج', iconName: 'Layers', color: '#78716c' },
  { id: '14', name: 'ميكانيكي سيارات', iconName: 'Wrench', color: '#ef4444' },
  { id: '15', name: 'سائق شاحنة', iconName: 'Truck', color: '#0284c7' },
  { id: '16', name: 'سائق تاكسي', iconName: 'Car', color: '#eab308' },
  { id: '17', name: 'سائق توصيل', iconName: 'Bike', color: '#22c55e' },
  { id: '18', name: 'فلاح', iconName: 'Sprout', color: '#16a34a' },
  { id: '19', name: 'راعي غنم', iconName: 'PersonStanding', color: '#84cc16' },
  { id: '20', name: 'جزّار', iconName: 'ChefHat', color: '#dc2626' },
  { id: '21', name: 'خبّاز', iconName: 'CookingPot', color: '#d97706' },
  { id: '22', name: 'طباخ', iconName: 'ChefHat', color: '#ea580c' },
  { id: '23', name: 'حلواني', iconName: 'Cake', color: '#f472b6' },
  { id: '24', name: 'منظف منازل', iconName: 'SprayCan', color: '#3b82f6' },
  { id: '25', name: 'منظف مكاتب', iconName: 'SprayCan', color: '#60a5fa' },
  { id: '26', name: 'مربية أطفال', iconName: 'Baby', color: '#fb923c' },
  { id: '27', name: 'عاملة منزلية', iconName: 'Home', color: '#f43f5e' },
  { id: '28', name: 'حارس أمن', iconName: 'Shield', color: '#1d4ed8' },
  { id: '29', name: 'عامل مستودع', iconName: 'Package', color: '#57534e' },
  { id: '30', name: 'نجار ألمنيوم', iconName: 'Hammer', color: '#94a3b8' },
  { id: '31', name: 'عامل حدادة فنية', iconName: 'Wrench', color: '#1f2937' },
  { id: '32', name: 'نجار ديكور', iconName: 'Hammer', color: '#b45309' },
  { id: '33', name: 'رسام جداريات', iconName: 'Paintbrush', color: '#8b5cf6' },
  { id: '34', name: 'عامل في مصنع', iconName: 'Factory', color: '#4b5563' },
  { id: '35', name: 'عامل في المخابز', iconName: 'CookingPot', color: '#f59e0b' },
  { id: '36', name: 'معلم شاورما', iconName: 'ChefHat', color: '#c2410c' },
  { id: '37', name: 'معلم مشاوي', iconName: 'ChefHat', color: '#b91c1c' },
  { id: '38', name: 'عامل مقهى', iconName: 'Coffee', color: '#78350f' },
  { id: '39', name: 'عامل مطعم', iconName: 'Utensils', color: '#f97316' },
  { id: '40', name: 'عامل غسيل سيارات', iconName: 'Car', color: '#0ea5e9' },
  { id: '41', name: 'فني ألواح شمسية', iconName: 'Sun', color: '#fcd34d' },
  { id: '42', name: 'معلم سيراميك', iconName: 'Layers', color: '#a8a29e' },
  { id: '43', name: 'صانع أحذية', iconName: 'Briefcase', color: '#92400e' },
  { id: '44', name: 'فني إصلاح أثاث', iconName: 'Wrench', color: '#ca8a04' },
  { id: '45', name: 'عامل توصيل طلبات', iconName: 'Bike', color: '#16a34a' },
  { id: '46', name: 'حلاق رجالي', iconName: 'Scissors', color: '#374151' },
  { id: '47', name: 'حلاقة نسائية', iconName: 'Scissors', color: '#db2777' },
  { id: '48', name: 'فني كاميرات مراقبة', iconName: 'Camera', color: '#111827' },
  { id: '49', name: 'فني حواسيب', iconName: 'Laptop', color: '#3b82f6' },
  { id: '50', name: 'فني طباعة وتصوير', iconName: 'Printer', color: '#4f46e5' },
  { id: '51', name: 'بائع متجول', iconName: 'ShoppingCart', color: '#10b981' },
  { id: '52', name: 'بائع في متجر', iconName: 'Store', color: '#059669' },
  { id: '53', name: 'مساعد بائع', iconName: 'Store', color: '#047857' },
  { id: '54', name: 'موظف كاشير', iconName: 'Calculator', color: '#0891b2' },
  { id: '55', name: 'عامل تعبئة وتغليف', iconName: 'Package', color: '#ca8a04' },
  { id: '56', name: 'معلم حدائق وتشجير', iconName: 'Sprout', color: '#65a30d' },
  { id: '57', name: 'مبلط', iconName: 'Layers', color: '#84cc16' },
  { id: '58', name: 'دهّان', iconName: 'Paintbrush', color: '#9333ea' },
  { id: '59', name: 'نجّار أثاث', iconName: 'Hammer', color: '#a16207' },
  { id: '60', name: 'مرمم أثاث قديم', iconName: 'Wrench', color: '#92400e' },
  { id: '61', name: 'تقني إصلاح أجهزة كهربائية', iconName: 'CircuitBoard', color: '#c026d3' },
  { id: '62', name: 'خبير أعشاب طبيعية', iconName: 'Leaf', color: '#4d7c0f' },
  { id: '63', name: 'صانع مواد تنظيف', iconName: 'SprayCan', color: '#2563eb' },
  { id: '64', name: 'مشغل آلات صناعية', iconName: 'Factory', color: '#334155' },
  { id: '65', name: 'عامل نقل أثاث', iconName: 'Truck', color: '#0369a1' },
  { id: '66', name: 'عامل نظافة شوارع', iconName: 'Trash2', color: '#e11d48' },
  { id: '67', name: 'عامل مغسلة ملابس', iconName: 'Shirt', color: '#7c3aed' },
  { id: '68', name: 'موزع إعلانات', iconName: 'Megaphone', color: '#be123c' },
  { id: '69', name: 'متطوع', iconName: 'Handshake', color: '#10b981' }
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
    let q: QueryConstraint[] = [];

    // Base filters that are always applied to the Firestore query
    let whereClauses: QueryFilterConstraint[] = [];

    if (postType) whereClauses.push(where('postType', '==', postType));
    if (categoryId) whereClauses.push(where('categoryId', '==', categoryId));
    if (workType) whereClauses.push(where('workType', '==', workType));

    // Combine where clauses with and()
    if (whereClauses.length > 0) {
      q.push(and(...whereClauses));
    }
    
    // Add sorting
    q.push(orderBy('createdAt', 'desc'));

    // Handle search query with OR condition
    if (searchQuery) {
        // Firestore does not support mixing `in` or `array-contains-any` with `!=` or `not-in`,
        // and has limitations on OR queries. A client-side search or a more complex backend
        // (like using a dedicated search service) would be better.
        // For simplicity, we'll stick to a client-side search if there's a query.
    }
    
    // Client-side filtering logic for text search, country, and city
    const useClientSideSearch = !!searchQuery || !!country || !!city;

    if (!useClientSideSearch) {
      if (count) {
        q.push(limit(count));
      }
    }

    const finalQuery = query(adsRef, ...q);
    const querySnapshot = await getDocs(finalQuery);

    let jobs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        postedAt: formatTimeAgo(data.createdAt),
      } as Job;
    });

    if (useClientSideSearch) {
      const fuseOptions = {
        includeScore: true,
        threshold: 0.4,
        keys: ['title', 'description', 'categoryName', 'ownerName', 'country', 'city'],
      };

      const searchPatterns: any[] = [];
      if (searchQuery) {
        searchPatterns.push({ 
          $or: [
            { title: searchQuery }, 
            { description: searchQuery }, 
            { categoryName: searchQuery },
            { ownerName: searchQuery }
          ] 
        });
      }
      if (country) {
        searchPatterns.push({ country: `=${country}` });
      }
      if (city) {
        searchPatterns.push({ city: `=${city}` });
      }
      
      const fuse = new Fuse(jobs, fuseOptions);
      const results = searchPatterns.length > 0 
        ? fuse.search({ $and: searchPatterns }) 
        : jobs.map(job => ({ item: job }));
        
      jobs = results.map(result => result.item);
    }
    
    if (excludeId) {
      jobs = jobs.filter(job => job.id !== excludeId);
    }
    
    if (useClientSideSearch && count) {
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
            text: testimonialData.content,
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
                content: data.text,
                postedAt: formatTimeAgo(data.createdAt),
            } as Testimonial;
        });
    } catch (error) {
        console.error("Error fetching testimonials: ", error);
        return [];
    }
}


export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const docRef = doc(db, 'reviews', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
          id: docSnap.id, 
          ...data,
          content: data.text,
          postedAt: formatTimeAgo(data.createdAt),
     } as Testimonial;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching testimonial by ID: ", error);
    return null;
  }
}

export async function updateTestimonial(testimonialId: string, content: string) {
    try {
        const testimonialRef = doc(db, 'reviews', testimonialId);
        await updateDoc(testimonialRef, {
            text: content,
            updatedAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error updating testimonial: ", e);
        throw new Error("Failed to update testimonial");
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
    await setDoc(viewDocRef, { viewedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error(`Error recording view for ad ${adId} by user ${viewerId}:`, error);
  }
}


export function getCategories() {
  return categories;
}

export function getCategoryById(id: string) {
    return categories.find((cat) => cat.id === id);
}
