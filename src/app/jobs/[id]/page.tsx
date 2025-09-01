

import React from 'react';
import { notFound } from 'next/navigation';
import { getJobById, getCategoryById, getJobs } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Phone,
  MessageSquare,
  MapPin,
  Wallet,
  CalendarDays,
  User as UserIcon,
  Briefcase,
  Building2,
  Award,
  Users2,
  Clock,
  Instagram,
  Link as LinkIcon,
  GraduationCap,
  Mail,
  Flag,
  LayoutGrid,
  ClipboardList,
  FileText,
  Search,
  CheckSquare,
  HelpCircle,
  Bookmark,
  Share2,
  Target,
} from 'lucide-react';
import type { WorkType } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { ShareButton } from './share-button';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from './report-ad-dialog';
import { JobCard } from '@/components/job-card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SaveAdButton } from './save-ad-button';

interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';
  
  if (!job || job.postType !== 'seeking_worker') {
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

  const jobTitle = job.title || 'إعلان وظيفة';
  const jobCity = job.city || 'مدينة غير محددة';
  const jobCountry = job.country || 'دولة غير محددة';

  const metaDescription = (job.description || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`).substring(0, 160);
  const jsonLdDescription = job.description || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`;

  const createdAtDate = (job.createdAt && typeof job.createdAt.toDate === 'function') 
    ? job.createdAt.toDate() 
    : new Date();

  const jobPostingJsonLd: any = {
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

  const canonicalUrl = `${baseUrl}/jobs/${job.id}`;

  return {
    title: jobTitle,
    description: metaDescription,
    robots: 'index, follow',
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

const InfoItem = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number | undefined; color?: string }) => {
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
    if (!text || text.trim() === '') return <p className="italic text-muted-foreground">غير محدد</p>;

    const paragraphs = text.split(/\n{2,}/);

    return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
            {paragraphs.map((paragraph, pIndex) => {
                const lines = paragraph.split('\n').map((line, lIndex) => (
                    <React.Fragment key={lIndex}>
                        {line}
                        {lIndex < paragraph.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ));

                if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    const listItems = paragraph.split('\n').filter(i => i.trim()).map(item => item.trim().replace(/^[-*]\s*/, ''));
                    return (
                        <ul key={pIndex} className="list-disc pr-5 space-y-2 mb-4">
                            {listItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }

                return <p key={pIndex} className="mb-4 last:mb-0">{lines}</p>;
            })}
        </div>
    );
}

const DetailSection = ({ icon: Icon, title, color, children, className }: { icon: React.ElementType, title: string, color?: string, children: React.ReactNode, className?: string }) => (
    <div className={className}>
        <h3 className="text-xl font-bold flex items-center gap-2 mb-3" style={{color}}>
            <Icon className="h-5 w-5" />
            {title}
        </h3>
        {children}
    </div>
);


export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const job = await getJobById(params.id);

    if (!job || job.postType !== 'seeking_worker') {
        notFound();
    }

    const [similarJobs] = await Promise.all([
        getJobs({
            categoryId: job.categoryId,
            postType: 'seeking_worker',
            count: 2,
            excludeId: job.id,
        }),
    ]);

    const category = getCategoryById(job.categoryId || '');
    const categoryName = category?.name || job.categoryName;
    
    const translatedWorkType = job.workType ? workTypeTranslations[job.workType] : undefined;
    const sectionColor = '#0D47A1';
    const categoryColor = category?.color || sectionColor;
    const finalIconName = category?.iconName || 'Briefcase';
    
    const jobTitle = job.title || 'هذا الإعلان';
    
    const contactButtons = [
        job.phone && { type: 'phone', href: `tel:${job.phone}`, label: 'اتصال', icon: Phone, color: '#FFFFFF', className: 'bg-[#0D47A1] hover:bg-[#0D47A1]/90' },
        job.whatsapp && { type: 'whatsapp', href: `https://wa.me/${job.whatsapp.replace(/\+/g, '')}`, label: 'واتساب', icon: MessageSquare, color: '#FFFFFF', className: 'bg-green-600 hover:bg-green-700' },
        job.email && { type: 'email', href: `mailto:${job.email}`, label: 'البريد الإلكتروني', icon: Mail, color: '#FFFFFF', className: 'bg-gray-600 hover:bg-gray-700' },
        job.instagram && { type: 'instagram', href: `https://instagram.com/${job.instagram.replace(/@/g, '')}`, label: 'إنستغرام', icon: Instagram, color: '#FFFFFF', className: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90' },
        job.applyUrl && { type: 'applyUrl', href: job.applyUrl, label: 'تسجيل عبر الموقع', icon: LinkIcon, color: '#FFFFFF', className: 'bg-blue-600 hover:bg-blue-700' },
    ].filter(Boolean);

    
    return (
        <>
            <MobilePageHeader title="تفاصيل عرض العمل">
                <Briefcase className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={Briefcase}
                title="تفاصيل عرض العمل"
                description="هنا تجد جميع المعلومات المتعلقة بفرصة العمل هذه."
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8">
                <div className="space-y-6">
                    <Card className="overflow-hidden shadow-lg border-t-4" style={{ borderColor: sectionColor }}>
                        <CardHeader className="bg-muted/30 p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 sm:p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${categoryColor}1A` }}>
                                    <CategoryIcon name={finalIconName} className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: categoryColor }} />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {job.title || 'عنوان غير متوفر'}
                                </h1>
                            </div>
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>نُشر: {job.postedAt}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                <InfoItem icon={MapPin} label="الموقع" value={`${job.country}, ${job.city}`} color={categoryColor} />
                                <InfoItem icon={Wallet} label="الأجر" value={job.salary ? job.salary : 'عند الطلب'} color={categoryColor} />
                                {categoryName && <InfoItem icon={LayoutGrid} label="الفئة" value={categoryName} color={categoryColor} />}
                                {translatedWorkType && <InfoItem icon={Clock} label="نوع الدوام" value={translatedWorkType} color={categoryColor} />}
                                {job.companyName && <InfoItem icon={Building2} label="الشركة" value={job.companyName} color={categoryColor} />}
                                {job.openPositions && <InfoItem icon={Users2} label="شواغر" value={job.openPositions} color={categoryColor} />}
                            </div>
                            
                            <Separator />
                            
                             <div className="space-y-6">
                                {job.description && (
                                    <>
                                        <DetailSection icon={FileText} title="وصف الوظيفة" color={sectionColor}><FormattedText text={job.description} /></DetailSection>
                                        <Separator/>
                                    </>
                                )}
                                
                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                  {job.conditions && <DetailSection icon={ClipboardList} title="الشروط المطلوبة" color={sectionColor}><FormattedText text={job.conditions} /></DetailSection>}
                                  {job.qualifications && <DetailSection icon={GraduationCap} title="المؤهلات المطلوبة" color={sectionColor}><FormattedText text={job.qualifications} /></DetailSection>}
                                </div>
                                
                                {(job.conditions || job.qualifications) && <Separator />}

                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                    {job.experience && <DetailSection icon={Award} title="الخبرة المطلوبة" color={sectionColor}><FormattedText text={job.experience} /></DetailSection>}
                                    {job.tasks && <DetailSection icon={CheckSquare} title="المهام المطلوبة" color={sectionColor}><FormattedText text={job.tasks} /></DetailSection>}
                                </div>
                                
                                {(job.experience || job.tasks) && <Separator />}

                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                    {job.featuresAndOpportunities && <DetailSection icon={Target} title="المميزات والفرص" color={sectionColor}><FormattedText text={job.featuresAndOpportunities} /></DetailSection>}
                                    {job.howToApply && <DetailSection icon={HelpCircle} title="كيفية التقديم" color={sectionColor}><FormattedText text={job.howToApply} /></DetailSection>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Phone className="h-5 w-5" style={{color: sectionColor}} />
                                    التقديم على الوظيفة
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
                            <h2 className="text-2xl font-bold">إعلانات مشابهة</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {similarJobs.map((similarJob) => (
                                <JobCard key={similarJob.id} job={similarJob} />
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
