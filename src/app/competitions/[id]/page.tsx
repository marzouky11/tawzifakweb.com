

import React from 'react';
import { notFound } from 'next/navigation';
import { getCompetitionById, getOrganizerByName, getCompetitions } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Briefcase,
  Building,
  Users2,
  FileText,
  Link as LinkIcon,
  Landmark,
  ClipboardList,
  Info,
  MapPin,
  Target,
  ListOrdered,
  FileUp,
  Award,
  Bookmark,
  Share2,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { CategoryIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { SaveAdButton } from '@/app/jobs/[id]/save-ad-button';
import { CompetitionCard } from '@/components/competition-card';
import { cn } from '@/lib/utils';
import { ShareButton } from '@/app/jobs/[id]/share-button';


interface CompetitionDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CompetitionDetailPageProps): Promise<Metadata> {
  const competition = await getCompetitionById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';
  
  if (!competition) {
    return {
      title: 'المباراة غير موجودة',
      description: 'لم نتمكن من العثور على المباراة التي تبحث عنها.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }

  const metaTitle = competition.title || 'مباراة عمومية';
  const metaDescription = (competition.description || `مباراة منظمة من طرف ${competition.organizer} لـ ${competition.positionsAvailable} منصب.`).substring(0, 160);
  const jsonLdDescription = competition.description || `مباراة منظمة من طرف ${competition.organizer} لـ ${competition.positionsAvailable} منصب.`;
  const canonicalUrl = `${baseUrl}/competitions/${competition.id}`;

  const createdAtDate = competition.createdAt && typeof competition.createdAt.toDate === 'function' 
    ? competition.createdAt.toDate() 
    : new Date();

  const deadlineDate = competition.deadline ? new Date(competition.deadline) : null;
  const validDeadline = deadlineDate && !isNaN(deadlineDate.getTime());

  const jobPostingJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: metaTitle,
      description: jsonLdDescription,
      datePosted: createdAtDate.toISOString(),
      hiringOrganization: {
        '@type': 'Organization',
        name: competition.organizer,
        sameAs: baseUrl,
        logo: siteThumbnail,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: competition.location || 'غير محدد',
          addressCountry: 'MA',
        },
      },
  };

  if (competition.positionsAvailable) {
      jobPostingJsonLd.totalJobOpenings = String(competition.positionsAvailable);
  }
  if (validDeadline) {
      jobPostingJsonLd.validThrough = deadlineDate.toISOString();
  }


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
        images: [ { url: siteThumbnail, width: 1200, height: 630, alt: metaTitle } ],
    },
    twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [siteThumbnail],
    },
    other: {
        'application/ld+json': JSON.stringify(jobPostingJsonLd, null, 2)
    }
  };
}


const InfoItem = ({ icon: Icon, label, value, color, href, isDate }: { icon: React.ElementType; label: string; value: string | number | undefined | null; color?: string; href?: string; isDate?: boolean }) => {
    if (!value) return null;

    const content = (
        <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg text-center h-full">
            <Icon className="h-6 w-6 mx-auto mb-1" style={{ color }} />
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className={`font-semibold text-sm ${isDate ? 'text-destructive' : ''}`}>{String(value)}</dd>
        </div>
    );
    
    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform text-foreground hover:text-primary">{content}</a>;
    }
    return content;
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
}

export default async function CompetitionDetailPage({ params }: CompetitionDetailPageProps) {
    const competition = await getCompetitionById(params.id);

    if (!competition) {
        notFound();
    }
    
    const [similarCompetitions] = await Promise.all([
      getCompetitions({ count: 2, excludeId: competition.id }),
    ]);
    
    const organizer = getOrganizerByName(competition.organizer);
    const sectionColor = '#14532d';
    const organizerIcon = organizer?.icon || 'Landmark';
    const organizerColor = organizer?.color || sectionColor;

    return (
        <>
            <MobilePageHeader title="تفاصيل المباراة">
                <Landmark className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={Landmark}
                title="تفاصيل المباراة العمومية"
                description="هنا تجد جميع المعلومات المتعلقة بهذه المباراة."
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8 space-y-6">
                <Card className="overflow-hidden shadow-lg border-t-4" style={{borderColor: sectionColor}}>
                     <CardHeader className="bg-muted/30 p-4 sm:p-6">
                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${organizerColor}1A` }}>
                                        <CategoryIcon name={organizerIcon} className="w-8 h-8" style={{ color: organizerColor }} />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                                        {competition.title || 'عنوان غير متوفر'}
                                    </h1>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4" />
                                            <span>نُشرت: {competition.postedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-8">
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            <InfoItem icon={Building} label="الجهة المنظمة" value={competition.organizer} color={organizerColor} />
                            {competition.competitionType && <InfoItem icon={Briefcase} label="نوع المباراة" value={competition.competitionType} color={organizerColor} />}
                            {competition.location && <InfoItem icon={MapPin} label="الموقع" value={competition.location} color={organizerColor} />}
                            {competition.positionsAvailable && <InfoItem icon={Users2} label="عدد المناصب" value={competition.positionsAvailable} color={organizerColor} />}
                            <InfoItem icon={CalendarDays} label="بداية التسجيل" value={competition.registrationStartDate} color={sectionColor} />
                            <InfoItem icon={CalendarDays} label="آخر أجل للتسجيل" value={competition.deadline} color={sectionColor} isDate />
                            <InfoItem icon={CalendarDays} label="تاريخ المباراة" value={competition.competitionDate} color={sectionColor} />
                        </div>
                        <Separator />
                        
                        {/* Mobile view */}
                        <div className="md:hidden space-y-6">
                           {competition.description && (<> <DetailSection icon={Info} title="وصف تفصيلي" color={sectionColor}><FormattedText text={competition.description} /></DetailSection> <Separator /> </>)}
                           {competition.requirements && (<> <DetailSection icon={ClipboardList} title="الشروط المطلوبة" color={sectionColor}><FormattedText text={competition.requirements} /></DetailSection> <Separator /> </>)}
                           {competition.competitionStages && (<> <DetailSection icon={ListOrdered} title="مراحل المباراة" color={sectionColor}><FormattedText text={competition.competitionStages} /></DetailSection> <Separator /> </>)}
                           {competition.documentsNeeded && (<> <DetailSection icon={FileText} title="الوثائق المطلوبة" color={sectionColor}><FormattedText text={competition.documentsNeeded} /></DetailSection> <Separator /> </>)}
                           {competition.trainingFeatures && (<> <DetailSection icon={Award} title="مميزات التكوين والفرص" color={sectionColor}><FormattedText text={competition.trainingFeatures} /></DetailSection> <Separator /> </>)}
                           {competition.jobProspects && (<> <DetailSection icon={Target} title="أفق العمل بعد المباراة" color={sectionColor}><FormattedText text={competition.jobProspects} /></DetailSection> <Separator /> </>)}
                           {competition.howToApply && (<> <DetailSection icon={HelpCircle} title="طريقة التسجيل" color={sectionColor}><FormattedText text={competition.howToApply} /></DetailSection> <Separator /> </>)}
                        </div>
                        
                        {/* Desktop view */}
                        <div className="hidden md:block space-y-6">
                           {competition.description && (
                            <>
                               <DetailSection icon={Info} title="وصف تفصيلي" color={sectionColor}><FormattedText text={competition.description} /></DetailSection>
                               <Separator className="my-6" />
                            </>
                           )}
                           
                           {(competition.requirements || competition.competitionStages) && (
                                <>
                                <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-6">
                                    {competition.requirements ? <DetailSection icon={ClipboardList} title="الشروط المطلوبة" color={sectionColor}><FormattedText text={competition.requirements} /></DetailSection> : <div />}
                                    {competition.requirements && competition.competitionStages && <Separator orientation="vertical" className="h-auto" />}
                                    {competition.competitionStages ? <DetailSection icon={ListOrdered} title="مراحل المباراة" color={sectionColor}><FormattedText text={competition.competitionStages} /></DetailSection> : <div />}
                                </div>
                                <Separator className="my-6" />
                                </>
                           )}
                           
                           {(competition.documentsNeeded || competition.trainingFeatures) && (
                            <>
                                <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-6">
                                    {competition.documentsNeeded ? <DetailSection icon={FileText} title="الوثائق المطلوبة" color={sectionColor}><FormattedText text={competition.documentsNeeded} /></DetailSection> : <div />}
                                    {competition.documentsNeeded && competition.trainingFeatures && <Separator orientation="vertical" className="h-auto" />}
                                    {competition.trainingFeatures ? <DetailSection icon={Award} title="مميزات التكوين والفرص" color={sectionColor}><FormattedText text={competition.trainingFeatures} /></DetailSection> : <div />}
                                </div>
                                <Separator className="my-6" />
                            </>
                           )}

                           {(competition.jobProspects || competition.howToApply) && (
                                <>
                                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-6">
                                        {competition.jobProspects ? <DetailSection icon={Target} title="أفق العمل بعد المباراة" color={sectionColor}><FormattedText text={competition.jobProspects} /></DetailSection> : <div />}
                                        {competition.jobProspects && competition.howToApply && <Separator orientation="vertical" className="h-auto" />}
                                        {competition.howToApply ? <DetailSection icon={HelpCircle} title="طريقة التسجيل" color={sectionColor}><FormattedText text={competition.howToApply} /></DetailSection> : <div />}
                                    </div>
                                </>
                           )}
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2" style={{color: sectionColor}}>
                                <LinkIcon className="h-5 w-5" />
                                التقديم على المباراة
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-3 p-6 pt-0">
                             {competition.officialLink && (
                                <Button asChild size="lg" className="text-primary-foreground font-semibold text-base py-6" style={{backgroundColor: sectionColor}}>
                                    <a href={competition.officialLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-90">
                                        <LinkIcon className="ml-2 h-5 w-5" />
                                        الذهاب إلى رابط التسجيل
                                    </a>
                                </Button>
                            )}
                            {competition.fileUrl && (
                                <Button asChild size="lg" variant="outline" className="text-base py-6 hover:bg-green-500/10 hover:border-green-500 hover:text-green-600 font-semibold">
                                    <a href={competition.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <FileUp className="ml-2 h-5 w-5" />
                                        تحميل إعلان المباراة (PDF)
                                    </a>
                                </Button>
                            )}
                             {competition.email && (
                                <Button asChild size="lg" variant="outline" className="text-base py-6">
                                    <a href={`mailto:${competition.email}`}>
                                        <Mail className="ml-2 h-5 w-5" />
                                        التواصل عبر البريد الإلكتروني
                                    </a>
                                </Button>
                            )}
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
                            <SaveAdButton adId={competition.id} adType="competition" />
                            <ShareButton title={competition.title || ''} text={competition.description || ''} />
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <ReportAdDialog adId={competition.id} />
                </div>
                 {similarCompetitions.length > 0 && (
                    <div className="space-y-4 pt-6 mt-6 border-t">
                        <h2 className="text-2xl font-bold">مباريات مشابهة</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {similarCompetitions.map((similarComp) => (
                            <CompetitionCard key={similarComp.id} competition={similarComp} />
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
