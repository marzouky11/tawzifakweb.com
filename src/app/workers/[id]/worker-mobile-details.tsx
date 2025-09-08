
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Phone, MessageSquare, MapPin, CalendarDays, User as UserIcon, Award, Clock,
  Instagram, GraduationCap, Mail, LayoutGrid, FileText, Bookmark, Share2
} from 'lucide-react';
import type { Job, WorkType } from '@/lib/types';
import { ShareButton } from '@/app/jobs/[id]/share-button';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from '@/app/jobs/[id]/report-ad-dialog';
import { JobCard } from '@/components/job-card';
import { SaveAdButton } from '@/app/jobs/[id]/save-ad-button';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';


const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

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

interface WorkerMobileDetailsProps {
    job: Job;
    similarJobs: Job[];
}

export function WorkerMobileDetails({ job, similarJobs }: WorkerMobileDetailsProps) {
    const categoryName = job.categoryName;
    const translatedWorkType = job.workType ? workTypeTranslations[job.workType] : undefined;
    const sectionColor = '#424242';

    const contactButtons = [
        job.phone && { type: 'phone', href: `tel:${job.phone}`, label: 'اتصال', icon: Phone, className: 'bg-[#424242] hover:bg-[#424242]/90' },
        job.whatsapp && { type: 'whatsapp', href: `https://wa.me/${job.whatsapp.replace(/\+/g, '')}`, label: 'واتساب', icon: MessageSquare, className: 'bg-green-600 hover:bg-green-700' },
        job.email && { type: 'email', href: `mailto:${job.email}`, label: 'البريد الإلكتروني', icon: Mail, className: 'bg-gray-600 hover:bg-gray-700' },
        job.instagram && { type: 'instagram', href: `https://instagram.com/${job.instagram.replace(/@/g, '')}`, label: 'إنستغرام', icon: Instagram, className: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90' },
    ].filter(Boolean);

    const descriptionSection = job.description ? { id: 'description', icon: FileText, title: "وصف المهارات والخبرة", content: <FormattedText text={job.description} /> } : null;

    const allOtherSections = [
        job.qualifications && { id: 'qualifications', icon: GraduationCap, title: "الشهادات والمؤهلات", content: <FormattedText text={job.qualifications} /> },
        job.experience && { id: 'experience', icon: Award, title: "الخبرة", content: <FormattedText text={job.experience} /> }
    ].filter(Boolean) as { id: string; icon: React.ElementType; title: string; content: React.ReactNode; }[];
    
    const hasDetails = !!descriptionSection || allOtherSections.length > 0;

    return (
        <div className="container mx-auto max-w-7xl px-4 pb-8">
            <div className="space-y-6">
                <Card className="overflow-hidden shadow-lg">
                    <CardHeader className="bg-muted/30 p-4">
                        <div className="flex items-center gap-4 mb-2">
                            <UserAvatar name={job.ownerName} color={job.ownerAvatarColor} className="h-16 w-16 text-2xl flex-shrink-0"/>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                {job.title || 'عنوان غير متوفر'}
                            </h1>
                        </div>
                         <div className="flex items-center gap-x-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" />
                                <span>نُشر: {job.postedAt}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-6">
                         <div className="grid grid-cols-2 gap-3">
                            <InfoItem icon={UserIcon} label="صاحب الإعلان" value={job.ownerName} color={sectionColor} />
                            {categoryName && <InfoItem icon={LayoutGrid} label="الفئة" value={categoryName} color={sectionColor} />}
                            <InfoItem icon={MapPin} label="الموقع" value={`${job.country}, ${job.city}`} color={sectionColor} />
                            {translatedWorkType && <InfoItem icon={Clock} label="نوع الدوام" value={translatedWorkType} color={sectionColor} />}
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
                            <Phone className="h-5 w-5" style={{ color: sectionColor }}/>
                            <span className="text-foreground">تواصل مع الباحث عن عمل</span>
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
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                            <Bookmark className="h-5 w-5" style={{ color: sectionColor }}/>
                            <span className="text-foreground">احفظ الإعلان وشارك مع الآخرين</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pt-0">
                        <SaveAdButton adId={job.id} adType="job" />
                        <ShareButton title={job.title || ''} text={job.description || ''} />
                    </CardContent>
                </Card>
                
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
    );
}
