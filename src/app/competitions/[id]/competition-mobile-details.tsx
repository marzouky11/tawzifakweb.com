

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CalendarDays, Briefcase, Building, Users2, FileText, Link as LinkIcon, Landmark,
  ClipboardList, Info, MapPin, Target, ListOrdered, FileUp, Award, Bookmark, Share2, Mail, HelpCircle
} from 'lucide-react';
import type { Competition } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { SaveAdButton } from '@/app/jobs/[id]/save-ad-button';
import { CompetitionCard } from '@/components/competition-card';
import { ShareButton } from '@/app/jobs/[id]/share-button';
import { getOrganizerByName } from '@/lib/data';

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

    const paragraphs = text.split(/\n{2,}/);

    return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
            {paragraphs.map((paragraph, pIndex) => {
                const listItems = paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')
                    ? paragraph.split('\n').filter(i => i.trim()).map(item => item.trim().replace(/^[-*]\s*/, ''))
                    : [];

                if (listItems.length > 0) {
                    return (
                        <ul key={pIndex} className="list-disc pr-5 space-y-2 mb-4">
                            {listItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }

                return <p key={pIndex} className="mb-4 last:mb-0">{paragraph}</p>;
            })}
        </div>
    );
};

interface CompetitionMobileDetailsProps {
    competition: Competition;
    similarCompetitions: Competition[];
}

export function CompetitionMobileDetails({ competition, similarCompetitions }: CompetitionMobileDetailsProps) {
    const organizer = getOrganizerByName(competition.organizer);
    const sectionColor = '#14532d';
    const organizerIcon = organizer?.icon || 'Landmark';
    const organizerColor = organizer?.color || sectionColor;

    const descriptionSection = competition.description ? { id: 'description', icon: Info, title: "وصف تفصيلي", content: <FormattedText text={competition.description} /> } : null;

    const allOtherSections = [
        competition.availablePositions && { id: 'availablePositions', icon: Briefcase, title: "الوظائف المتاحة", content: <FormattedText text={competition.availablePositions} /> },
        competition.requirements && { id: 'requirements', icon: ClipboardList, title: "الشروط المطلوبة", content: <FormattedText text={competition.requirements} /> },
        competition.competitionStages && { id: 'competitionStages', icon: ListOrdered, title: "مراحل المباراة", content: <FormattedText text={competition.competitionStages} /> },
        competition.documentsNeeded && { id: 'documentsNeeded', icon: FileText, title: "الوثائق المطلوبة", content: <FormattedText text={competition.documentsNeeded} /> },
        competition.trainingFeatures && { id: 'trainingFeatures', icon: Award, title: "مميزات التكوين والفرص", content: <FormattedText text={competition.trainingFeatures} /> },
        competition.jobProspects && { id: 'jobProspects', icon: Target, title: "أفق العمل بعد المباراة", content: <FormattedText text={competition.jobProspects} /> },
        competition.howToApply && { id: 'howToApply', icon: HelpCircle, title: "طريقة التسجيل", content: <FormattedText text={competition.howToApply} /> }
    ].filter(Boolean) as { id: string; icon: React.ElementType; title: string; content: React.ReactNode; }[];
    
    const hasDetails = !!descriptionSection || allOtherSections.length > 0;

    return (
        <div className="container mx-auto max-w-7xl px-4 pb-8 space-y-6">
            <Card className="overflow-hidden shadow-lg border-2 border-dashed" style={{borderColor: sectionColor}}>
                 <CardHeader className="bg-muted/30 p-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${organizerColor}1A` }}>
                            <CategoryIcon name={organizerIcon} className="w-8 h-8" style={{ color: organizerColor }} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
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
                </CardHeader>
                <CardContent className="p-4 space-y-6">
                     <div className="grid grid-cols-2 gap-3">
                        <InfoItem icon={Building} label="الجهة المنظمة" value={competition.organizer} color={organizerColor} />
                        {competition.competitionType && <InfoItem icon={Briefcase} label="نوع المباراة" value={competition.competitionType} color={organizerColor} />}
                        {competition.location && <InfoItem icon={MapPin} label="الموقع" value={competition.location} color={organizerColor} />}
                        {competition.positionsAvailable && <InfoItem icon={Users2} label="عدد المناصب" value={competition.positionsAvailable} color={organizerColor} />}
                        <InfoItem icon={CalendarDays} label="بداية التسجيل" value={competition.registrationStartDate} color={sectionColor} />
                        <InfoItem icon={CalendarDays} label="آخر أجل للتسجيل" value={competition.deadline} color={sectionColor} isDate />
                        <InfoItem icon={CalendarDays} label="تاريخ المباراة" value={competition.competitionDate} color={sectionColor} />
                    </div>
                    
                    {hasDetails && (
                        <>
                            <Separator />
                            <div className="space-y-8">
                                {descriptionSection && (
                                    <DetailSection icon={descriptionSection.icon} title={descriptionSection.title} color={sectionColor}>
                                        {descriptionSection.content}
                                    </DetailSection>
                                )}

                                {allOtherSections.map((section, index) => (
                                    <React.Fragment key={section.id}>
                                        {(index > 0 || !!descriptionSection) && <Separator />}
                                        <DetailSection icon={section.icon} title={section.title} color={sectionColor}>{section.content}</DetailSection>
                                    </React.Fragment>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-xl font-bold">
                        <LinkIcon className="h-5 w-5" style={{ color: sectionColor }}/>
                        التقديم على المباراة
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 pt-0">
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
                     <CardTitle className="flex items-center gap-2 text-xl font-bold">
                        <Bookmark className="h-5 w-5" style={{ color: sectionColor }}/>
                        احفظ الإعلان وشارك مع الآخرين
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-0">
                    <SaveAdButton adId={competition.id} adType="competition" />
                    <ShareButton title={competition.title || ''} text={competition.description || ''} />
                </CardContent>
            </Card>

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
    );
}
