
import { notFound } from 'next/navigation';
import { getCompetitionById } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  User as UserIcon,
  Briefcase,
  Building,
  Users2,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  ClipboardList,
  Info
} from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import Link from 'next/link';

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


const InfoItem = ({ icon: Icon, label, value, href, isDate }: { icon: React.ElementType; label: string; value: string | number | undefined; href?: string; isDate?: boolean }) => {
    if (!value) return null;

    const content = (
        <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-lg text-center">
            <Icon className="h-6 w-6 text-primary mx-auto mb-1" />
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className={`font-semibold text-sm ${isDate ? 'text-destructive' : ''}`}>{value}</dd>
        </div>
    );
    
    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">{content}</a>;
    }
    return content;
};


const DetailSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-primary">
            <Icon className="h-5 w-5" />
            {title}
        </h3>
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
            {children}
        </div>
    </div>
);


export default async function CompetitionDetailPage({ params }: CompetitionDetailPageProps) {
    const competition = await getCompetitionById(params.id);

    if (!competition) {
        notFound();
    }
    
    return (
        <AppLayout>
            <MobilePageHeader title="تفاصيل المباراة">
                <ShieldCheck className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={ShieldCheck}
                title="تفاصيل المباراة العمومية"
                description="هنا تجد جميع المعلومات المتعلقة بهذه المباراة."
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8">
                <div className="space-y-6">
                    <Card className="overflow-hidden shadow-lg border-t-4 border-blue-500">
                        <CardHeader className="bg-muted/30 p-4 sm:p-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {competition.title || 'عنوان غير متوفر'}
                            </h1>
                             <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Building className="h-4 w-4" />
                                    <span>الجهة المنظمة: {competition.organizer}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>نُشرت: {competition.postedAt}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 space-y-6">
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                <InfoItem icon={Briefcase} label="نوع المباراة" value={competition.competitionType} />
                                <InfoItem icon={Users2} label="عدد المناصب" value={competition.positionsAvailable} />
                                <InfoItem icon={CalendarDays} label="آخر أجل" value={competition.deadline} isDate />
                                <InfoItem icon={LinkIcon} label="الرابط الرسمي" value="اضغط هنا" href={competition.officialLink} />
                            </div>

                            {competition.description && (
                               <DetailSection icon={Info} title="وصف تفصيلي">
                                   <p>{competition.description}</p>
                               </DetailSection>
                            )}

                            {competition.requirements && (
                               <DetailSection icon={ClipboardList} title="الشروط المطلوبة">
                                   <p>{competition.requirements}</p>
                               </DetailSection>
                            )}

                             {competition.documentsNeeded && (
                               <DetailSection icon={FileText} title="الوثائق المطلوبة">
                                    <p>{competition.documentsNeeded}</p>
                               </DetailSection>
                            )}
                            
                            {competition.fileUrl && (
                                <div className="pt-4 text-center">
                                    <Button asChild>
                                        <a href={competition.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <FileText className="ml-2 h-4 w-4" />
                                            تحميل الملف المرفق
                                        </a>
                                    </Button>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
