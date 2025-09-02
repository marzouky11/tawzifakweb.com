

import React from 'react';
import { notFound } from 'next/navigation';
import { getImmigrationPostById, getImmigrationPosts } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Target,
  FileText,
  Link as LinkIcon,
  Plane,
  ClipboardList,
  Info,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Wallet,
  HelpCircle,
  Mail,
  MessageSquare,
  Instagram,
  Phone,
  Bookmark,
  Share2,
  CheckSquare,
  LayoutGrid,
} from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { SaveAdButton } from '@/app/jobs/[id]/save-ad-button';
import { ImmigrationCard } from '@/components/immigration-card';
import { CategoryIcon } from '@/components/icons';
import { getProgramTypeDetails } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ShareButton } from '@/app/jobs/[id]/share-button';

interface ImmigrationDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ImmigrationDetailPageProps): Promise<Metadata> {
  const post = await getImmigrationPostById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';
  
  if (!post) {
    return {
      title: 'فرصة هجرة غير موجودة',
      description: 'لم نتمكن من العثور على فرصة الهجرة التي تبحث عنها.',
      robots: 'index, follow',
      openGraph: { 
        images: [{ url: siteThumbnail }],
        title: 'فرصة هجرة غير موجودة',
        description: 'لم نتمكن من العثور على فرصة الهجرة التي تبحث عنها.',
      },
    };
  }

  const programDetails = getProgramTypeDetails(post.programType);
  const metaTitle = post.title;
  const metaDescription = (post.description || post.requirements || `فرصة هجرة إلى ${post.targetCountry} في مجال ${programDetails.label}`).substring(0, 160);
  const canonicalUrl = `${baseUrl}/immigration/${post.id}`;

  return {
    title: metaTitle,
    description: metaDescription,
    robots: 'index, follow',
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        siteName: 'توظيفك',
        type: 'article',
        publishedTime: post.postedAt,
        images: [ { url: siteThumbnail, width: 1200, height: 630, alt: metaTitle } ],
    },
    twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [siteThumbnail],
    },
  };
}

const InfoItem = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number | undefined; color?: string }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg text-center h-full">
            <Icon className="h-6 w-6 mx-auto mb-1" style={{ color }} />
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-sm">{String(value)}</dd>
        </div>
    );
};

const DetailSection = ({ icon: Icon, title, color, children, className }: { icon: React.ElementType, title: string, color?: string, children: React.ReactNode, className?: string }) => {
    if (!children) return null;
    return (
        <div className={className}>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-3" style={{color}}>
                <Icon className="h-5 w-5" />
                {title}
            </h3>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
                {children}
            </div>
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
};

export default async function ImmigrationDetailPage({ params }: ImmigrationDetailPageProps) {
    const post = await getImmigrationPostById(params.id);

    if (!post) {
        notFound();
    }
    
    const similarPosts = await getImmigrationPosts({ count: 2, excludeId: post.id });
    
    const programDetails = getProgramTypeDetails(post.programType);
    const sectionColor = '#0ea5e9';
    const iconName = programDetails.icon;
    const iconColor = programDetails.color;
    
    const contactButtons = [
        post.phone && { type: 'phone', href: `tel:${post.phone}`, label: 'اتصال', icon: Phone, className: 'bg-[#0D47A1] hover:bg-[#0D47A1]/90' },
        post.whatsapp && { type: 'whatsapp', href: `https://wa.me/${post.whatsapp.replace(/\+/g, '')}`, label: 'واتساب', icon: MessageSquare, className: 'bg-green-600 hover:bg-green-700' },
        post.email && { type: 'email', href: `mailto:${post.email}`, label: 'البريد الإلكتروني', icon: Mail, className: 'bg-gray-600 hover:bg-gray-700' },
        post.instagram && { type: 'instagram', href: `https://instagram.com/${post.instagram.replace(/@/g, '')}`, label: 'إنستغرام', icon: Instagram, className: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90' },
    ].filter(Boolean);

    const descriptionSection = post.description ? { id: 'description', icon: Info, title: "وصف تفصيلي", content: <FormattedText text={post.description} /> } : null;

    const allOtherSections = [
        post.availablePositions && { id: 'availablePositions', icon: Briefcase, title: "الوظائف المتاحة", content: <FormattedText text={post.availablePositions} /> },
        post.requirements && { id: 'requirements', icon: ClipboardList, title: "الشروط العامة", content: <FormattedText text={post.requirements} /> },
        post.qualifications && { id: 'qualifications', icon: GraduationCap, title: "المؤهلات المطلوبة", content: <FormattedText text={post.qualifications} /> },
        post.experience && { id: 'experience', icon: Award, title: "الخبرة المطلوبة", content: <FormattedText text={post.experience} /> },
        post.tasks && { id: 'tasks', icon: CheckSquare, title: "المهام المطلوبة", content: <FormattedText text={post.tasks} /> },
        post.featuresAndOpportunities && { id: 'featuresAndOpportunities', icon: Target, title: "المميزات والفرص", content: <FormattedText text={post.featuresAndOpportunities} /> },
        post.howToApply && { id: 'howToApply', icon: HelpCircle, title: "كيفية التقديم", content: <FormattedText text={post.howToApply} /> }
    ].filter(Boolean) as { id: string; icon: React.ElementType; title: string; content: React.ReactNode; }[];
    
    const remainingSections = allOtherSections.filter(section => !!section.content);

    return (
        <>
            <MobilePageHeader title="فرصة هجرة">
                <Plane className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={Plane}
                title="تفاصيل فرصة الهجرة"
                description={`استكشف جميع المعلومات المتعلقة بفرصة الهجرة إلى ${post.targetCountry}.`}
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8 space-y-6">
                <Card className="overflow-hidden shadow-lg border-2" style={{borderColor: sectionColor}}>
                     <CardHeader className="p-4 sm:p-6" style={{ backgroundColor: `${sectionColor}1A`}}>
                        <div className="flex items-center gap-4 mb-2">
                           <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${iconColor}2A` }}>
                                <CategoryIcon name={iconName} className="h-6 w-6" style={{ color: iconColor }} />
                           </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {post.title}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm pt-2">
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" />
                                <span>نُشرت: {post.postedAt}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-8">
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            <InfoItem icon={LayoutGrid} label="نوع البرنامج" value={programDetails.label} color={iconColor} />
                            <InfoItem icon={MapPin} label="الموقع" value={`${post.targetCountry}${post.city ? ', ' + post.city : ''}`} color={iconColor} />
                            {post.positionsAvailable && <InfoItem icon={Users} label="عدد المناصب" value={post.positionsAvailable} color={iconColor} />}
                            <InfoItem icon={Users} label="الفئة المستهدفة" value={post.targetAudience} color={iconColor} />
                             {post.salary && <InfoItem icon={Wallet} label="الأجر" value={post.salary} color={iconColor} />}
                            {post.deadline && <InfoItem icon={CalendarDays} label="آخر أجل" value={post.deadline} color={iconColor} />}
                        </div>
                        <Separator />
                        
                        {descriptionSection && (
                            <DetailSection icon={descriptionSection.icon} title={descriptionSection.title} color={sectionColor}>
                                {descriptionSection.content}
                            </DetailSection>
                        )}
                        
                        {/* Mobile View */}
                        <div className="md:hidden space-y-4">
                            {remainingSections.map((section, index) => (
                                <React.Fragment key={section.id}>
                                    <Separator />
                                    <DetailSection icon={section.icon} title={section.title} color={sectionColor}>
                                        {section.content}
                                    </DetailSection>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Desktop View */}
                        {remainingSections.length > 0 && <Separator className='hidden md:block'/>}
                        <div className="hidden md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6">
                            {remainingSections.map((section, index) => (
                                <div
                                    key={section.id}
                                    className={cn(
                                        'space-y-4',
                                        remainingSections.length % 2 !== 0 && index === remainingSections.length - 1 && 'md:col-span-2'
                                    )}
                                >
                                    <DetailSection icon={section.icon} title={section.title} color={sectionColor}>
                                        {section.content}
                                    </DetailSection>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LinkIcon className="h-5 w-5" />
                                التقديم على الفرصة
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-3 p-6 pt-0">
                            {post.applyUrl && (
                                <Button asChild size="lg" className="text-primary-foreground font-semibold text-base py-6" style={{backgroundColor: sectionColor}}>
                                    <a href={post.applyUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-90">
                                        <LinkIcon className="ml-2 h-5 w-5" />
                                        الذهاب إلى رابط التسجيل
                                    </a>
                                </Button>
                            )}
                            {contactButtons.map(button => {
                                if (!button) return null;
                                return (
                                <Button key={button.type} asChild size="lg" className={cn("text-primary-foreground font-semibold text-base py-6", button.className)}>
                                    <a href={button.href} target={button.type !== 'phone' ? '_blank' : undefined} rel="noopener noreferrer">
                                        <button.icon className="ml-2 h-5 w-5" />
                                        {button.label}
                                    </a>
                                </Button>
                            )})}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Bookmark className="h-5 w-5" style={{color: sectionColor}}/>
                                احفظ الإعلان وشارك مع الآخرين
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 p-6 pt-0">
                            <SaveAdButton adId={post.id} adType="immigration" />
                            <ShareButton title={post.title || ''} text={post.description || ''} />
                        </CardContent>
                    </Card>
                </div>
                
                <div className="text-center">
                    <ReportAdDialog adId={post.id} />
                </div>

                 {similarPosts.length > 0 && (
                    <div className="space-y-4 pt-6 mt-6 border-t">
                        <h2 className="text-2xl font-bold">فرص هجرة مشابهة</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {similarPosts.map((similarPost) => (
                            <ImmigrationCard key={similarPost.id} post={similarPost} />
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
                          }   
