

import { notFound } from 'next/navigation';
import { getJobById, getCategoryById, getJobs, getViewsCount } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import {
  Phone,
  MessageSquare,
  MapPin,
  CalendarDays,
  User as UserIcon,
  Award,
  Clock,
  Instagram,
  GraduationCap,
  Mail,
  LayoutGrid,
  FileText,
  Eye,
  Search,
} from 'lucide-react';
import type { WorkType } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { ShareButton } from '@/app/jobs/[id]/share-button';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { JobCard } from '@/components/job-card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import Link from 'next/link';
import { ViewCounter } from '@/app/jobs/[id]/view-counter';


interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/YCz0LvMj/Screenshot-20250704-173231.jpg';
  
  if (!job) {
    return {
      title: 'الإعلان غير موجود',
      description: 'لم نتمكن من العثور على الإعلان الذي تبحث عنه.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }
  
  const employmentTypeMapping: {[key: string]: string} = {
    'full_time': 'FULL_TIME',
    'part_time': 'PART_TIME',
    'freelance': 'CONTRACTOR',
    'remote': 'OTHER',
  };

  const jobTitle = job.title || (job.postType === 'seeking_job' ? `باحث عن عمل: ${job.ownerName}` : 'إعلان وظيفة');
  const jobCity = job.city || 'مدينة غير محددة';
  const jobCountry = job.country || 'دولة غير محددة';

  const metaDescription = (job.description || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`).substring(0, 160);
  const jsonLdDescription = job.description || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`;

  const createdAtDate = (job.createdAt && typeof job.createdAt.toDate === 'function') 
    ? job.createdAt.toDate() 
    : new Date();

  const jobPostingJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: jobTitle,
      description: jsonLdDescription,
      datePosted: createdAtDate.toISOString(),
      employmentType: job.workType ? employmentTypeMapping[job.workType] : 'OTHER',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName || 'توظيفك',
        sameAs: baseUrl,
        logo: siteThumbnail,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: jobCity,
          addressCountry: jobCountry,
        },
      },
      ...(job.workType === 'remote' && { jobLocationType: 'TELECOMMUTE' }),
      ...(job.qualifications && { qualifications: job.qualifications }),
  };

  const canonicalUrl = `${baseUrl}/workers/${job.id}`;

  return {
    title: jobTitle,
    description: metaDescription,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: jobTitle,
        description: metaDescription,
        url: canonicalUrl,
        siteName: 'توظيفك',
        type: 'article',
        images: [
            {
                url: siteThumbnail,
                width: 1200,
                height: 630,
                alt: jobTitle,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: jobTitle,
        description: metaDescription,
        images: [siteThumbnail],
    },
    other: {
        'application/ld+json': JSON.stringify(jobPostingJsonLd, null, 2)
    }
  };
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

const SeekerInfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number | undefined; }) => {
    if (!value) return null;
    return (
       <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg text-center">
        <Icon className="h-6 w-6 text-primary mx-auto mb-1" />
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold text-sm">{value}</dd>
      </div>
    );
};

const DetailSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-primary">
            <Icon className="h-5 w-5" />
            {title}
        </h3>
        <div className="prose dark:prose-invert max-w-none text-foreground">
            {children}
        </div>
    </div>
);


export default async function WorkerDetailPage({ params }: JobDetailPageProps) {
    const job = await getJobById(params.id);

    if (!job || job.postType !== 'seeking_job') {
        notFound();
    }
    
    const [similarJobs, viewsCount] = await Promise.all([
      getJobs({
        categoryId: job.categoryId,
        postType: job.postType,
        count: 4,
        excludeId: job.id,
      }),
      getViewsCount(params.id)
    ]);


    const category = getCategoryById(job.categoryId || '');
    const categoryName = category?.name || job.categoryName;
    const translatedWorkType = job.workType ? workTypeTranslations[job.workType] : undefined;
    const finalColor = category?.color || 'hsl(var(--destructive))';
    const finalIconName = category?.iconName || 'Users';

    const jobTitle = job.title || 'هذا الإعلان';
    const whatsappMessage = `مرحبًا، اطلعت على ملفك الشخصي كـ'${jobTitle}' على منصة توظيفك وأنا مهتم بالتواصل بخصوص فرصة عمل.`;
    const emailSubject = `فرصة عمل بخصوص: ${jobTitle}`;
    const emailBody = `مرحبًا ${job.ownerName || ''},

اطلعت على ملفك الشخصي كـ'${jobTitle}' على منصة توظيفك، وأود التواصل معك بخصوص فرصة عمل محتملة تتناسب مع خبراتك.

يرجى إعلامي بالوقت المناسب للحديث.

شكرًا لك.`;

    return (
        <AppLayout>
            <ViewCounter adId={params.id} />
            <MobilePageHeader title="ملف باحث عن عمل">
                <UserIcon className="h-5 w-5" style={{ color: finalColor }} />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={UserIcon}
                title="ملف باحث عن عمل"
                description="استعرض مهارات وخبرات هذا المرشح وتواصل معه مباشرة."
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8">
                <div className="space-y-6">
                    <Card 
                        className="overflow-hidden shadow-lg border-2 border-dashed"
                        style={{ borderColor: finalColor }}
                    >
                        <CardHeader className="bg-muted/30 p-4 sm:p-6">
                           <div className="flex flex-col items-start gap-4">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="p-2 sm:p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${finalColor}1A` }}>
                                        <CategoryIcon name={finalIconName} className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: finalColor }} />
                                    </div>
                                    <div className="flex-grow">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                            {job.title || 'عنوان غير متوفر'}
                                        </h1>
                                    </div>
                               </div>
                               <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.country || 'دولة غير محددة'}, {job.city || 'مدينة غير محددة'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays className="h-4 w-4" />
                                        <span>نُشر: {job.postedAt}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" />
                                        <span>{viewsCount} مشاهدات</span>
                                    </div>
                                </div>
                           </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                <SeekerInfoItem icon={LayoutGrid} label="الفئة" value={categoryName} />
                                {job.workType && <SeekerInfoItem icon={Clock} label="نوع الدوام" value={translatedWorkType} />}
                            </div>

                            <Separator/>
                            
                            {job.experience && (
                               <DetailSection icon={Award} title="الخبرة">
                                    <p>{job.experience}</p>
                               </DetailSection>
                            )}

                            {job.experience && (job.qualifications || job.description) && <Separator />}
                            
                            {job.qualifications && (
                               <DetailSection icon={GraduationCap} title="المؤهلات">
                                    <p>{job.qualifications}</p>
                               </DetailSection>
                            )}
                            
                            {job.qualifications && job.description && <Separator />}

                            {job.description && (
                               <DetailSection icon={FileText} title="وصف المهارات والخبرة">
                                    <p>{job.description}</p>
                               </DetailSection>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Phone className="h-5 w-5 text-primary" />
                                    معلومات التواصل
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {job.phone && (
                                        <Button asChild style={{ backgroundColor: finalColor }} className="text-primary-foreground hover:opacity-90">
                                            <a href={`tel:${job.phone}`}><Phone className="ml-2 h-4 w-4" />اتصال</a>
                                        </Button>
                                    )}
                                    {job.whatsapp && (
                                        <Button asChild className="bg-green-600 hover:bg-green-700 text-primary-foreground">
                                            <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer">
                                                <MessageSquare className="ml-2 h-4 w-4" />واتساب
                                            </a>
                                        </Button>
                                    )}
                                    {job.email && (
                                        <Button asChild className="bg-gray-600 hover:bg-gray-700 text-primary-foreground">
                                            <a href={`mailto:${job.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}><Mail className="ml-2 h-4 w-4" />البريد الإلكتروني</a>
                                        </Button>
                                    )}
                                    {job.instagram && (
                                        <Button asChild className="text-primary-foreground bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90">
                                            <a href={`https://instagram.com/${job.instagram.replace(/@/g, '')}`} target="_blank" rel="noopener noreferrer">
                                                <Instagram className="ml-2 h-4 w-4" />إنستغرام
                                            </a>
                                        </Button>
                                    )}
                                </div>
                                <ShareButton title={job.title || ''} text={job.description || ''} />
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                    صاحب الإعلان
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-row items-center gap-4">
                                    <UserAvatar name={job.ownerName} color={job.ownerAvatarColor} className="h-16 w-16 text-2xl flex-shrink-0" />
                                    <div className="font-semibold text-lg text-right flex-grow">
                                        {job.ownerName || 'صاحب الإعلان'}
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href={`/user/${job.userId}`}>
                                        <Search className="mr-2 h-4 w-4" />
                                        عرض جميع إعلاناته
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                    
                    <div className="text-center pt-4">
                        <ReportAdDialog adId={job.id} />
                    </div>
                    
                    {similarJobs.length > 0 && (
                        <div className="space-y-4 pt-6 mt-6 border-t">
                            <h2 className="text-2xl font-bold">باحثون عن عمل مشابهون</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {similarJobs.map((similarJob) => (
                                <JobCard key={similarJob.id} job={similarJob} />
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
