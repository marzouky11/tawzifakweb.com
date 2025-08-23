

import { notFound } from 'next/navigation';
import { getImmigrationPostById, getImmigrationPosts } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
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
} from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { SaveAdButton } from '@/app/jobs/[id]/save-ad-button';
import { ImmigrationCard } from '@/components/immigration-card';
import { CategoryIcon } from '@/components/icons';

interface ImmigrationDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ImmigrationDetailPageProps): Promise<Metadata> {
  const post = await getImmigrationPostById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/QtH6DP8p/man-diligently-working-his-desk.jpg'; // Generic immigration image
  
  if (!post) {
    return {
      title: 'فرصة هجرة غير موجودة',
      description: 'لم نتمكن من العثور على فرصة الهجرة التي تبحث عنها.',
      openGraph: { images: [{ url: siteThumbnail }] },
    };
  }

  const metaTitle = post.title;
  const metaDescription = (post.description || post.requirements || `فرصة هجرة إلى ${post.targetCountry} في مجال ${post.programType}`).substring(0, 160);
  const canonicalUrl = `${baseUrl}/immigration/${post.id}`;

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

const InfoItem = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number | undefined; color?: string }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1 p-3 bg-sky-500/10 rounded-lg text-center h-full">
            <Icon className="h-6 w-6 mx-auto mb-1" style={{ color }} />
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-sm text-sky-800 dark:text-sky-200">{String(value)}</dd>
        </div>
    );
};

const DetailSection = ({ icon: Icon, title, color, children }: { icon: React.ElementType, title: string, color?: string, children: React.ReactNode }) => {
    if (!children) return null;
    return (
        <div>
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
    const contentBlocks = text.split('\n').map(paragraph => paragraph.trim()).filter(p => p.length > 0);
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
            {contentBlocks.map((block, index) => {
                if (block.startsWith('- ') || block.startsWith('* ')) {
                    const listItems = block.split('\n').filter(i => i.trim()).map(item => item.trim().replace(/^[-*]\s*/, ''));
                    return <ul key={index} className="list-disc pr-5 space-y-2 mb-4">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>;
                }
                return <p key={index} className="mb-4 last:mb-0">{block}</p>;
            })}
        </div>
    );
}

export default async function ImmigrationDetailPage({ params }: ImmigrationDetailPageProps) {
    const post = await getImmigrationPostById(params.id);

    if (!post) {
        notFound();
    }
    
    const similarPosts = await getImmigrationPosts({ count: 2, excludeId: post.id });
    
    const sectionColor = '#0ea5e9'; // sky-500

    const programTypeTranslations: { [key: string]: string } = {
        work: 'عمل',
        study: 'دراسة',
        seasonal: 'موسمي',
        training: 'تدريب',
    };
    
    const iconName = post.iconName || 'Plane';

    return (
        <AppLayout>
            <MobilePageHeader title="فرصة هجرة">
                <Plane className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={Plane}
                title={post.title}
                description={`فرصة هجرة إلى ${post.targetCountry} ضمن برنامج ${programTypeTranslations[post.programType]}`}
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8 space-y-6">
                <Card className="overflow-hidden shadow-lg border-t-4" style={{borderColor: sectionColor}}>
                     <CardHeader className="bg-sky-500/10 p-4 sm:p-6">
                        <div className="flex items-center gap-4 mb-2">
                           <div className="p-3 rounded-xl flex-shrink-0 bg-sky-500/20">
                                <CategoryIcon name={iconName} className="w-8 h-8 text-sky-500" />
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
                            <SaveAdButton adId={post.id} adType="immigration" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-8">
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            <InfoItem icon={MapPin} label="الدولة" value={post.targetCountry} color={sectionColor} />
                            {post.city && <InfoItem icon={MapPin} label="المدينة" value={post.city} color={sectionColor} />}
                            <InfoItem icon={Briefcase} label="نوع البرنامج" value={programTypeTranslations[post.programType]} color={sectionColor} />
                            <InfoItem icon={Users} label="الفئة المستهدفة" value={post.targetAudience} color={sectionColor} />
                            <InfoItem icon={CalendarDays} label="آخر أجل" value={post.deadline} color={sectionColor} />
                            {post.salary && <InfoItem icon={Wallet} label="الأجر" value={post.salary} color={sectionColor} />}
                        </div>
                        <Separator />
                        <div className="space-y-6">
                           {post.description && <DetailSection icon={Info} title="وصف البرنامج" color={sectionColor}><FormattedText text={post.description} /></DetailSection>}
                           {post.description && <Separator />}

                           {post.requirements && <DetailSection icon={ClipboardList} title="الشروط العامة" color={sectionColor}><FormattedText text={post.requirements} /></DetailSection>}
                           {post.requirements && <Separator />}
                           
                           {post.qualifications && <DetailSection icon={GraduationCap} title="المؤهلات المطلوبة" color={sectionColor}><FormattedText text={post.qualifications} /></DetailSection>}
                           {post.qualifications && <Separator />}

                           {post.experience && <DetailSection icon={Award} title="الخبرة المطلوبة" color={sectionColor}><FormattedText text={post.experience} /></DetailSection>}
                           {post.experience && <Separator />}
                           
                           {post.featuresAndOpportunities && <DetailSection icon={Target} title="المميزات والفرص" color={sectionColor}><FormattedText text={post.featuresAndOpportunities} /></DetailSection>}
                           {post.featuresAndOpportunities && <Separator />}
                           
                           {post.howToApply && <DetailSection icon={HelpCircle} title="كيفية التقديم" color={sectionColor}><FormattedText text={post.howToApply} /></DetailSection>}
                        </div>
                    </CardContent>
                </Card>
                         
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={{color: sectionColor}}>
                            <LinkIcon className="h-5 w-5" />
                            التقديم على الفرصة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row justify-center gap-4 p-6">
                        <Button asChild size="lg" className="flex-1 text-primary-foreground text-base py-6" style={{backgroundColor: sectionColor}}>
                            <a href={post.applyUrl} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="ml-2 h-4 w-4" />
                                الذهاب إلى رابط التسجيل
                            </a>
                        </Button>
                    </CardContent>
                </Card>
                
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
        </AppLayout>
    );
}
