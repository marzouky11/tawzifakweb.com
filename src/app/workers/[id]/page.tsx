

import { notFound } from 'next/navigation';
import { getJobById, getCategoryById, getJobs } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Search,
  Bookmark,
  Share2,
} from 'lucide-react';
import type { WorkType } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { ShareButton } from '@/app/jobs/[id]/share-button';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { JobCard } from '@/components/job-card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import Link from 'next/link';
import { SaveAdButton } from '@/app/jobs/[id]/save-ad-button';
import { cn } from '@/lib/utils';


interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  
  if (!job) {
    return {
      title: 'الإعلان غير موجود',
    };
  }

  // Prevent indexing of job seeker profiles
  return {
    title: job.title,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'none',
        'max-snippet': -1,
      },
    },
  };
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

const SeekerInfoItem = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number | undefined; color?: string }) => {
    if (!value) return null;
    return (
       <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg text-center">
        <Icon className="h-6 w-6 mx-auto mb-1" style={{ color }} />
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold text-sm">{String(value)}</dd>
      </div>
    );
};

const FormattedText = ({ text }: { text?: string }) => {
    if (!text) return null;

    const contentBlocks = text.split('\n').map(paragraph => paragraph.trim()).filter(p => p.length > 0);

    return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
            {contentBlocks.map((block, index) => {
                if (block.startsWith('- ') || block.startsWith('* ')) {
                    const listItems = block.split('\n').filter(i => i.trim()).map(item => item.trim().replace(/^[-*]\s*/, ''));
                    return (
                        <ul key={index} className="list-disc pr-5 space-y-2 mb-4">
                            {listItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }
                return <p key={index} className="mb-4">{block}</p>;
            })}
        </div>
    );
}

const DetailSection = ({ icon: Icon, title, color, children }: { icon: React.ElementType, title: string, color?: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-xl font-bold flex items-center gap-2 mb-3" style={{color}}>
            <Icon className="h-5 w-5" />
            {title}
        </h3>
        {children}
    </div>
);


export default async function WorkerDetailPage({ params }: JobDetailPageProps) {
    const job = await getJobById(params.id);

    if (!job || job.postType !== 'seeking_job') {
        notFound();
    }
    
    const [similarJobs] = await Promise.all([
      getJobs({
        categoryId: job.categoryId,
        postType: job.postType,
        count: 2,
        excludeId: job.id,
      }),
    ]);


    const category = getCategoryById(job.categoryId || '');
    const categoryName = category?.name || job.categoryName;
    const translatedWorkType = job.workType ? workTypeTranslations[job.workType] : undefined;
    const sectionColor = '#424242';
    const categoryColor = category?.color || sectionColor;
    const finalIconName = category?.iconName || 'Users';

    const jobTitle = job.title || 'هذا الإعلان';
    
    const contactButtons = [
        job.phone && { type: 'phone', href: `tel:${job.phone}`, label: 'اتصال', icon: Phone, className: 'bg-[#424242] hover:bg-[#424242]/90' },
        job.whatsapp && { type: 'whatsapp', href: `https://wa.me/${job.whatsapp.replace(/\+/g, '')}`, label: 'واتساب', icon: MessageSquare, className: 'bg-green-600 hover:bg-green-700' },
        job.email && { type: 'email', href: `mailto:${job.email}`, label: 'البريد الإلكتروني', icon: Mail, className: 'bg-gray-600 hover:bg-gray-700' },
        job.instagram && { type: 'instagram', href: `https://instagram.com/${job.instagram.replace(/@/g, '')}`, label: 'إنستغرام', icon: Instagram, className: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90' },
    ].filter(Boolean);

    return (
        <AppLayout>
            <MobilePageHeader title="ملف باحث عن عمل">
                <UserIcon className="h-5 w-5 text-primary" />
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
                        style={{ borderColor: sectionColor }}
                    >
                        <CardHeader className="bg-muted/30 p-4 sm:p-6">
                           <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 sm:p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${categoryColor}1A` }}>
                                             <CategoryIcon name={finalIconName} className="h-8 w-8" style={{ color: categoryColor }} />
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                                            {job.title || 'عنوان غير متوفر'}
                                        </h1>
                                    </div>
                                   <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2 text-sm">
                                         <Link href={`/user/${job.userId}`} className="flex items-center gap-1.5 hover:text-primary">
                                            <UserIcon className="h-4 w-4" />
                                            <span className="font-medium">{job.ownerName}</span>
                                        </Link>
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4" />
                                            <span>نُشر: {job.postedAt}</span>
                                        </div>
                                    </div>
                                </div>
                           </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                <SeekerInfoItem icon={MapPin} label="الموقع" value={`${job.country}, ${job.city}`} color={categoryColor} />
                                <SeekerInfoItem icon={LayoutGrid} label="الفئة" value={categoryName} color={categoryColor} />
                                {job.workType && <SeekerInfoItem icon={Clock} label="نوع الدوام" value={translatedWorkType} color={categoryColor} />}
                            </div>

                            <Separator/>
                            
                            {job.description && (
                               <DetailSection icon={FileText} title="وصف المهارات والخبرة" color={sectionColor}>
                                    <FormattedText text={job.description} />
                               </DetailSection>
                            )}

                            {job.description && (job.qualifications || job.experience) && <Separator />}
                            
                            {job.qualifications && (
                               <DetailSection icon={GraduationCap} title="الشهادات والمؤهلات" color={sectionColor}>
                                    <FormattedText text={job.qualifications} />
                               </DetailSection>
                            )}
                            
                            {job.qualifications && job.experience && <Separator />}

                            {job.experience && (
                               <DetailSection icon={Award} title="الخبرة" color={sectionColor}>
                                    <FormattedText text={job.experience} />
                               </DetailSection>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Phone className="h-5 w-5" style={{color: sectionColor}}/>
                                    تواصل مع الباحث عن عمل
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 grid grid-cols-1 gap-3">
                                {contactButtons.map(button => {
                                    if (!button) return null;
                                    return (
                                        <Button
                                            key={button.type}
                                            asChild
                                            size="lg"
                                            className={cn("text-primary-foreground font-semibold text-base py-6", button.className)}
                                        >
                                            <a href={button.href} target={button.type !== 'phone' ? '_blank' : undefined} rel="noopener noreferrer">
                                                <button.icon className="ml-2 h-5 w-5" />
                                                {button.label}
                                            </a>
                                        </Button>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Bookmark className="h-5 w-5" style={{color: sectionColor}}/>
                                    احفظ الإعلان وشارك مع الآخرين
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 pt-0">
                                <SaveAdButton adId={job.id} adType="job" />
                                <ShareButton title={job.title || ''} text={job.description || ''} />
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="text-center pt-4">
                        <ReportAdDialog adId={job.id} />
                    </div>
                    
                    {similarJobs.length > 0 && (
                        <div className="space-y-4 pt-6 mt-6 border-t">
                            <h2 className="text-2xl font-bold">باحثون عن عمل مشابهون</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
