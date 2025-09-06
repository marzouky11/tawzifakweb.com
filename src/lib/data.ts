

import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, deleteDoc, setDoc, Query, and, QueryConstraint, QueryFilterConstraint, documentId, increment } from 'firebase/firestore';
import type { Job, Category, PostType, User, WorkType, Testimonial, Competition, Organizer, Article, Report, ContactMessage, ImmigrationPost } from './types';
import Fuse from 'fuse.js';
import { getProgramTypeDetails, slugify } from './utils';
import { revalidatePath } from './revalidate';


const categories: Category[] = [
  { id: 'it', name: 'تكنولوجيا المعلومات', iconName: 'Code', color: '#1E88E5' },
  { id: 'engineering', name: 'الهندسة', iconName: 'CircuitBoard', color: '#FB8C00' },
  { id: 'construction', name: 'البناء والأشغال العامة', iconName: 'HardHat', color: '#78909C' },
  { id: 'healthcare', name: 'الصحة والتمريض', iconName: 'Stethoscope', color: '#43A047' },
  { id: 'education', name: 'التعليم والتدريب', iconName: 'BookOpen', color: '#8E24AA' },
  { id: 'finance', name: 'المالية والمحاسبة', iconName: 'Calculator', color: '#00ACC1' },
  { id: 'admin', name: 'الإدارة والسكرتارية', iconName: 'KanbanSquare', color: '#5E35B1' },
  { id: 'marketing', name: 'التسويق والمبيعات', iconName: 'Megaphone', color: '#E53935' },
  { id: 'hr', name: 'الموارد البشرية', iconName: 'Users', color: '#3949AB' },
  { id: 'hospitality', name: 'الفندقة والسياحة', iconName: 'ConciergeBell', color: '#D81B60' },
  { id: 'logistics', name: 'النقل واللوجستيك', iconName: 'Truck', color: '#F4511E' },
  { id: 'security', name: 'الخدمات الأمنية', iconName: 'Shield', color: '#546E7A' },
  { id: 'crafts', name: 'الحرف والصناعات التقليدية', iconName: 'PenTool', color: '#A1887F' },
  { id: 'manufacturing', name: 'الصناعة والإنتاج', iconName: 'Factory', color: '#455A64' },
  { id: 'law', name: 'القانون والشؤون القانونية', iconName: 'Gavel', color: '#6D4C41' },
  { id: 'gov', name: 'وظائف حكومية', iconName: 'Landmark', color: '#0277BD' },
  { id: 'media', name: 'الإعلام والاتصال', iconName: 'Newspaper', color: '#00897B' },
  { id: 'retail', name: 'التجارة والتوزيع', iconName: 'ShoppingCart', color: '#37474F' },
  { id: 'agriculture', name: 'الفلاحة والزراعة', iconName: 'Sprout', color: '#388E3C' },
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
      const createdAt = data.createdAt.toDate();
      const isNew = (new Date().getTime() - createdAt.getTime()) < 24 * 60 * 60 * 1000; // Less than 24 hours
      return {
        id: doc.id,
        ...data,
        postedAt: formatTimeAgo(data.createdAt),
        isNew,
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
    if (searchQuery) {
        const fuse = new Fuse(jobs, {
            keys: ['title', 'description', 'categoryName', 'country', 'city', 'companyName', 'experience', 'qualifications'],
            includeScore: true,
            threshold: 0.4, // Adjust threshold for more or less strict matching
        });
        jobs = fuse.search(searchQuery).map(result => result.item);
    }
    
    // These filters are applied after the main search to refine results
    if (country) {
        const fuse = new Fuse(jobs, { keys: ['country'], includeScore: true, threshold: 0.3 });
        jobs = fuse.search(country).map(result => result.item);
    }

    if (city) {
        const fuse = new Fuse(jobs, { keys: ['city'], includeScore: true, threshold: 0.3 });
        jobs = fuse.search(city).map(result => result.item);
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


export async function postJob(jobData: Omit<Job, 'id' | 'createdAt' | 'likes' | 'rating' | 'postedAt' | 'isNew'>): Promise<{ id: string }> {
    try {
        const adsCollection = collection(db, 'ads');
        const newJob: { [key: string]: any } = {
            ...jobData,
            createdAt: serverTimestamp(),
            likes: 0,
        };
        
        Object.keys(newJob).forEach(key => {
            if (newJob[key] === undefined || newJob[key] === '') {
                delete newJob[key];
            }
        });

        const newDocRef = await addDoc(adsCollection, newJob);
        
        revalidatePath('/');
        revalidatePath(jobData.postType === 'seeking_job' ? '/workers' : '/jobs');
        
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

        revalidatePath('/');
        revalidatePath('/jobs');
        revalidatePath('/workers');
        revalidatePath(`/jobs/${adId}`);
        revalidatePath(`/workers/${adId}`);

    } catch (e) {
        console.error("Error updating ad: ", e);
        throw new Error("Failed to update ad");
    }
}

export async function deleteAd(adId: string) {
    try {
        const adRef = doc(db, 'ads', adId);
        await deleteDoc(adRef);

        revalidatePath('/');
        revalidatePath('/jobs');
        revalidatePath('/workers');
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
            ...testimonialData,
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



// Functions for Competitions
export async function postCompetition(competitionData: Omit<Competition, 'id' | 'createdAt' | 'postedAt'>): Promise<{ id: string }> {
  try {
    const competitionsCollection = collection(db, 'competitions');
    const newCompetition: { [key: string]: any } = {
        ...competitionData,
        createdAt: serverTimestamp(),
        positionsAvailable: competitionData.positionsAvailable === undefined ? null : competitionData.positionsAvailable,
    };
    
    Object.keys(newCompetition).forEach(key => {
        if (newCompetition[key] === undefined || newCompetition[key] === '') {
             delete newCompetition[key];
        }
    });

    const newDocRef = await addDoc(competitionsCollection, newCompetition);
    
    revalidatePath('/');
    revalidatePath('/competitions');
    
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
  excludeId?: string;
} = {}): Promise<Competition[]> {
  try {
    const { count, searchQuery, location, excludeId } = options;
    const competitionsRef = collection(db, 'competitions');
    const q = query(competitionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    let competitions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt.toDate();
      const isNew = (new Date().getTime() - createdAt.getTime()) < 24 * 60 * 60 * 1000;
      return {
        id: doc.id,
        ...data,
        postedAt: formatTimeAgo(data.createdAt),
        isNew,
      } as Competition;
    });

     // Client-side filtering
    competitions = competitions.filter(comp => {
       if (excludeId && comp.id === excludeId) {
        return false;
      }
      return true;
    });

    if (searchQuery) {
        const fuse = new Fuse(competitions, {
            keys: ['title', 'organizer', 'description', 'location', 'competitionType'],
            includeScore: true,
            threshold: 0.4,
        });
        competitions = fuse.search(searchQuery).map(result => result.item);
    }
    
    if (location) {
        const fuse = new Fuse(competitions, {
            keys: ['location'],
            includeScore: true,
            threshold: 0.3,
        });
        competitions = fuse.search(location).map(result => result.item);
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
        
        if (dataToUpdate.positionsAvailable === undefined) {
            dataToUpdate.positionsAvailable = null;
        }

        await updateDoc(competitionRef, dataToUpdate);

        revalidatePath('/');
        revalidatePath('/competitions');
        revalidatePath(`/competitions/${id}`);
    } catch (e) {
        console.error("Error updating competition: ", e);
        throw new Error("Failed to update competition");
    }
}

export async function deleteCompetition(competitionId: string) {
    try {
        await deleteDoc(doc(db, 'competitions', competitionId));

        revalidatePath('/');
        revalidatePath('/competitions');
    } catch (e) {
        console.error("Error deleting competition: ", e);
        throw new Error("Failed to delete competition");
    }
}

// Functions for Immigration Posts
export async function getImmigrationPosts(options: { 
  count?: number;
  searchQuery?: string;
  excludeId?: string;
} = {}): Promise<ImmigrationPost[]> {
  try {
    const { count, searchQuery, excludeId } = options;
    const postsRef = collection(db, 'immigration');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    let posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const programDetails = getProgramTypeDetails(data.programType);
      return {
        id: doc.id,
        ...data,
        iconName: programDetails.icon,
        postedAt: formatTimeAgo(data.createdAt),
        isNew: (new Date().getTime() - data.createdAt.toDate().getTime()) < 24 * 60 * 60 * 1000,
      } as ImmigrationPost;
    });

    if (excludeId) {
      posts = posts.filter(post => post.id !== excludeId);
    }

    if (searchQuery) {
      const fuse = new Fuse(posts, {
        keys: ['title', 'targetCountry', 'city', 'description', 'targetAudience', 'programType'],
        includeScore: true,
        threshold: 0.4,
      });
      posts = fuse.search(searchQuery).map(result => result.item);
    }

    if (count) {
      return posts.slice(0, count);
    }
    
    return posts;
  } catch (error) {
    console.error("Error fetching immigration posts: ", error);
    return [];
  }
}

export async function getImmigrationPostBySlug(slug: string): Promise<ImmigrationPost | null> {
    try {
        const q = query(collection(db, "immigration"), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        const programDetails = getProgramTypeDetails(data.programType);
        return {
            id: docSnap.id,
            ...data,
            iconName: programDetails.icon,
            postedAt: formatTimeAgo(data.createdAt)
        } as ImmigrationPost;
    } catch (error) {
        console.error("Error fetching immigration post by slug:", error);
        return null;
    }
}

export async function getImmigrationPostById(id: string): Promise<ImmigrationPost | null> {
  try {
    const docRef = doc(db, 'immigration', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const programDetails = getProgramTypeDetails(data.programType);
      return { 
          id: docSnap.id, 
          ...data,
          iconName: programDetails.icon,
          postedAt: formatTimeAgo(data.createdAt),
     } as ImmigrationPost;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching immigration post by ID: ", error);
    return null;
  }
}

export async function postImmigration(postData: Omit<ImmigrationPost, 'id' | 'createdAt' | 'postedAt' | 'isNew' | 'iconName'>): Promise<{ id: string }> {
  try {
    const postsCollection = collection(db, 'immigration');
    const newPost: { [key: string]: any } = {
        ...postData,
        createdAt: serverTimestamp(),
    };
    
    Object.keys(newPost).forEach(key => {
        if (newPost[key] === undefined || newPost[key] === '') {
             delete newPost[key];
        }
    });

    const newDocRef = await addDoc(postsCollection, newPost);

    revalidatePath('/');
    revalidatePath('/immigration');

    return { id: newDocRef.id };
  } catch (e) {
    console.error("Error adding immigration post: ", e);
    throw new Error("Failed to post immigration ad");
  }
}

export async function updateImmigrationPost(id: string, postData: Partial<ImmigrationPost>): Promise<void> {
    try {
        const postRef = doc(db, 'immigration', id);
        const dataToUpdate: { [key: string]: any } = {
            ...postData,
            updatedAt: serverTimestamp()
        };

        if (postData.programType) {
            dataToUpdate.programType = postData.programType;
        }
        
        Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] === undefined) {
                 delete dataToUpdate[key];
            }
        });
        
        await updateDoc(postRef, dataToUpdate);

        revalidatePath('/');
        revalidatePath('/immigration');
        revalidatePath(`/immigration/${id}`);

    } catch (e) {
        console.error("Error updating immigration post: ", e);
        throw new Error("Failed to update immigration post");
    }
}

export async function deleteImmigrationPost(postId: string) {
    try {
        await deleteDoc(doc(db, 'immigration', postId));

        revalidatePath('/');
        revalidatePath('/immigration');
    } catch (e) {
        console.error("Error deleting immigration post: ", e);
        throw new Error("Failed to delete immigration post");
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

// --- Articles Functions ---
export async function getArticles(options: { count?: number } = {}): Promise<Article[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    
    let articles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postedAt: formatTimeAgo(doc.data().createdAt),
    } as Article));

    if (options.count) {
      return articles.slice(0, options.count);
    }
    
    return articles;
  } catch (error) {
    console.error("Error fetching articles: ", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      postedAt: formatTimeAgo(data.createdAt),
    } as Article;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}

export async function getArticleById(articleId: string): Promise<Article | null> {
  try {
    const docRef = doc(db, 'articles', articleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
          id: docSnap.id, 
          ...data,
          postedAt: formatTimeAgo(data.createdAt),
     } as Article;
    } else {
      console.log("No such article document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching article by ID: ", error);
    return null;
  }
}


export async function addArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'postedAt' | 'slug' | 'date'>): Promise<{ id: string }> {
    try {
        const newSlug = slugify(articleData.title);
        const docRef = await addDoc(collection(db, 'articles'), {
            ...articleData,
            slug: newSlug,
            createdAt: serverTimestamp()
        });
        
        revalidatePath('/articles');
        revalidatePath(`/articles/${newSlug}`);

        return { id: docRef.id };
    } catch (e) {
        console.error("Error adding article: ", e);
        throw new Error("Failed to add article");
    }
}

export async function updateArticle(articleId: string, articleData: Partial<Omit<Article, 'id' | 'createdAt' | 'postedAt' | 'date'>>): Promise<void> {
    try {
        const dataToUpdate: { [key: string]: any } = {
            ...articleData,
            updatedAt: serverTimestamp()
        };
        if(articleData.title) {
            dataToUpdate.slug = slugify(articleData.title);
        }
        Object.keys(dataToUpdate).forEach(key => {
            if (dataToUpdate[key] === undefined) {
                delete dataToUpdate[key];
            }
        });
        await updateDoc(doc(db, 'articles', articleId), dataToUpdate);

        revalidatePath('/articles');
        if (dataToUpdate.slug) {
            revalidatePath(`/articles/${dataToUpdate.slug}`);
        }

    } catch (e) {
        console.error("Error updating article: ", e);
        throw new Error("Failed to update article");
    }
}

export async function deleteArticle(articleId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'articles', articleId));
        revalidatePath('/articles');
    } catch (e) {
        console.error("Error deleting article: ", e);
        throw new Error("Failed to delete article");
    }
}

// --- Admin Functions ---
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
        await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
        console.error("Error deleting user document: ", e);
        throw new Error("Failed to delete user document");
    }
}

// --- Saved Ads Functions ---
export async function getSavedAdIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const savedAdsRef = collection(db, 'users', userId, 'savedAds');
    const snapshot = await getDocs(savedAdsRef);
    return snapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error("Error fetching saved ad IDs: ", error);
    return [];
  }
}

export async function getSavedAds(userId: string): Promise<(Job | Competition | ImmigrationPost)[]> {
    if (!userId) return [];
    try {
        const savedAdIds = await getSavedAdIds(userId);
        if (savedAdIds.length === 0) return [];

        const adPromises = savedAdIds.map(id => getJobById(id));
        const competitionPromises = savedAdIds.map(id => getCompetitionById(id));
        const immigrationPromises = savedAdIds.map(id => getImmigrationPostById(id));

        const results = await Promise.all([...adPromises, ...competitionPromises, ...immigrationPromises]);
        
        return results.filter(item => item !== null) as (Job | Competition | ImmigrationPost)[];
    } catch (error) {
        console.error("Error fetching saved ads details: ", error);
        return [];
    }
}

export async function toggleSaveAd(userId: string, adId: string, adType: 'job' | 'competition' | 'immigration') {
    if (!userId || !adId) {
        throw new Error("User ID and Ad ID are required.");
    }

    const savedAdRef = doc(db, 'users', userId, 'savedAds', adId);
    
    try {
        const docSnap = await getDoc(savedAdRef);
        if (docSnap.exists()) {
            await deleteDoc(savedAdRef);
            return false; // Ad was unsaved
        } else {
            await setDoc(savedAdRef, {
                savedAt: serverTimestamp(),
                type: adType,
            });
            return true; // Ad was saved
        }
    } catch (error) {
        console.error("Error toggling saved ad status: ", error);
        throw new Error("Failed to update saved status.");
    }
}

// --- Reports and Contacts Functions ---
export async function addReport(reportData: Omit<Report, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'reports'), {
    ...reportData,
    createdAt: serverTimestamp(),
  });
}

export async function getReports(): Promise<Report[]> {
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
}

export async function deleteReport(reportId: string): Promise<void> {
  await deleteDoc(doc(db, 'reports', reportId));
}

export async function addContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'contacts'), {
    ...messageData,
    createdAt: serverTimestamp(),
  });
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
}

export async function deleteContactMessage(messageId: string): Promise<void> {
  await deleteDoc(doc(db, 'contacts', messageId));
}


    

    



