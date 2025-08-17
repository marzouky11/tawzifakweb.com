

import { notFound } from 'next/navigation';
import { getCompetitionById, getOrganizerByName, getCompetitions } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
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
  LogIn,
  Eye,
} from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { CategoryIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { SaveAdButton } from '@/app/jobs/[id]/save-ad-button';
import { ViewCounter } from '@/app/jobs/[id]/view-counter';
import { CompetitionCard } from '@/components/competition-card';

interface CompetitionDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CompetitionDetailPageProps): Promise<Metadata> {
  const competition = await getCompetitionById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://www.tawzifak.com/og-image.jpg';
  
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
  const canonicalUrl = `${baseUrl}/competitions/${competition.id}`;

  return {
    title: metaTitle,
    description: metaDescription,
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
  };
}


const InfoItem = ({ icon: Icon, label, value, color, href, isDate }: { icon: React.ElementType; label: string; value: string | number | undefined; color?: string; href?: string; isDate?: boolean }) => {
    if (!value) return null;

    const content = (
        <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg text-center h-full">
            <Icon className="h-6 w-6 mx-auto mb-1" style={{ color }} />
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className={`font-semibold text-sm ${isDate ? 'text-destructive' : ''}`}>{value}</dd>
        </div>
    );
    
    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">{content}</a>;
    }
    return content;
};


const DetailSection = ({ icon: Icon, title, color, children, hasSeparator }: { icon: React.ElementType, title: string, color?: string, children: React.ReactNode, hasSeparator?: boolean }) => {
    if (!children) return null;
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2" style={{color}}>
                <Icon className="h-5 w-5" />
                {title}
            </h3>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground bg-muted/30 p-4 rounded-lg">
                {children}
            </div>
            {hasSeparator && <Separator className="my-6" />}
        </div>
    );
};

const FormattedText = ({ text }: { text?: string }) => {
    if (!text || text.trim() === '') return <p className="italic text-muted-foreground">غير محدد</p>;

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
                return <p key={index} className="mb-4 last:mb-0">{block}</p>;
            })}
        </div>
    );
}

export default async function CompetitionDetailPage({ params }: CompetitionDetailPageProps) {
    const competition = await getCompetitionById(params.id);

    if (!competition) {
        notFound();
    }
    
    const [similarCompetitions, viewsCount] = await Promise.all([
      getCompetitions({ count: 2, excludeId: competition.id }),
      getViewsCount(params.id)
    ]);
    
    const organizer = getOrganizerByName(competition.organizer);
    const sectionColor = '#14532d';
    const organizerIcon = organizer?.icon || 'Landmark';
    const organizerColor = organizer?.color || sectionColor;

    return (
        <AppLayout>
            <ViewCounter adId={params.id} />
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
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-start gap-4 flex-grow">
                                <div className="w-12 h-12 flex-shrink-0 mt-1 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${organizerColor}1A` }}>
                                    <CategoryIcon name={organizerIcon} className="w-8 h-8" style={{color: organizerColor}} />
                                </div>
                                <div className='flex-grow'>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                        {competition.title || 'عنوان غير متوفر'}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mt-2 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Building className="h-4 w-4" style={{color: sectionColor}} />
                                            <span>الجهة المنظمة: {competition.organizer}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4" style={{color: sectionColor}} />
                                            <span>نُشرت: {competition.postedAt}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Eye className="h-4 w-4" style={{color: sectionColor}} />
                                            <span>{viewsCount} مشاهدات</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="flex-shrink-0">
                                <SaveAdButton adId={competition.id} adType="competition" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            <InfoItem icon={Briefcase} label="نوع المباراة" value={competition.competitionType} color={sectionColor} />
                            <InfoItem icon={Users2} label="عدد المناصب" value={competition.positionsAvailable} color={sectionColor} />
                            <InfoItem icon={MapPin} label="الموقع" value={competition.location} color={sectionColor} />
                        </div>
                        <Separator />
                        <div className="space-y-6">
                           <DetailSection icon={Info} title="وصف تفصيلي" color={sectionColor} hasSeparator={!!competition.jobProspects}>
                                <FormattedText text={competition.description} />
                           </DetailSection>
                           <DetailSection icon={Target} title="أفق العمل بعد المباراة" color={sectionColor} hasSeparator={!!competition.requirements}>
                                <FormattedText text={competition.jobProspects} />
                           </DetailSection>
                           <DetailSection icon={ClipboardList} title="الشروط المطلوبة" color={sectionColor} hasSeparator={!!competition.competitionStages}>
                                <FormattedText text={competition.requirements} />
                           </DetailSection>
                           <DetailSection icon={ListOrdered} title="مراحل المباراة" color={sectionColor} hasSeparator={!!competition.documentsNeeded}>
                                <FormattedText text={competition.competitionStages} />
                           </DetailSection>
                           <DetailSection icon={FileText} title="الوثائق المطلوبة" color={sectionColor} hasSeparator>
                                <FormattedText text={competition.documentsNeeded} />
                           </DetailSection>

                            <DetailSection icon={CalendarDays} title="التواريخ المهمة" color={sectionColor}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
                                    <InfoItem icon={CalendarDays} label="بداية التسجيل" value={competition.registrationStartDate} color={sectionColor} />
                                    <InfoItem icon={CalendarDays} label="آخر أجل للتسجيل" value={competition.deadline} color={sectionColor} isDate />
                                    <InfoItem icon={CalendarDays} label="تاريخ المباراة" value={competition.competitionDate} color={sectionColor} />
                                </div>
                            </DetailSection>
                        </div>
                    </CardContent>
                </Card>
                         
                {(competition.fileUrl || competition.officialLink) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2" style={{color: sectionColor}}>
                                <LogIn className="h-5 w-5" />
                                التقديم على المباراة
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row justify-center gap-4 p-6">
                                {competition.fileUrl && (
                                <Button asChild size="lg" variant="outline" className="flex-1 text-base py-6">
                                    <a href={competition.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <FileUp className="ml-2 h-4 w-4" />
                                        تحميل إعلان المباراة (PDF)
                                    </a>
                                </Button>
                            )}
                            {competition.officialLink && (
                                <Button asChild size="lg" className="flex-1 text-primary-foreground text-base py-6" style={{backgroundColor: sectionColor}}>
                                    <a href={competition.officialLink} target="_blank" rel="noopener noreferrer">
                                        <LinkIcon className="ml-2 h-4 w-4" />
                                        الذهاب إلى رابط التسجيل
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
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
        </AppLayout>
    );
}

