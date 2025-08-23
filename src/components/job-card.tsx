

import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Wallet, User as UserIcon, Briefcase, CalendarDays } from 'lucide-react';
import type { Job, WorkType } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { CategoryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from './ui/separator';

interface JobCardProps {
  job: Job | null;
}

const InfoBadge = ({ icon, text, variant, className }: { icon?: React.ElementType, text: string | number | undefined, variant: "secondary" | "destructive" | "accent" | "default", className?: string }) => {
  if (!text) return null;
  const Icon = icon;
  return (
    <Badge variant={variant} className={cn("flex items-center gap-1.5 font-normal text-xs py-1 max-w-full", className)}>
      {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0" />}
      <span className="truncate font-medium">{text}</span>
    </Badge>
  );
};


export function JobCard({ job }: JobCardProps) {
  if (!job) {
    return (
      <Card className="p-4 space-y-3 h-full">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="pt-2">
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
      </Card>
    );
  }

  const category = getCategoryById(job.categoryId || '');
  const isSeekingJob = job.postType === 'seeking_job';
  const detailUrl = isSeekingJob ? `/workers/${job.id}` : `/jobs/${job.id}`;
  
  const categoryName = category?.name || job.categoryName;
  
  // Section-specific colors
  const sectionColors = {
    seeking_worker: '#0D47A1', // Dark Blue for Job Offers
    seeking_job: '#424242',    // Dark Gray for Job Seekers
  };
  const sectionColor = sectionColors[job.postType];
  const categoryColor = category?.color || sectionColor;

  const categoryIcon = category?.iconName || (isSeekingJob ? 'Users' : 'Briefcase');

  const salaryText = !isSeekingJob ? (job.salary || 'عند الطلب') : undefined;
  
  return (
    <Card 
        className={cn(
            "flex flex-col rounded-lg bg-card shadow-md h-full transition-all hover:shadow-xl w-full overflow-hidden",
            isSeekingJob ? "border-2 border-dashed" : "border-t-4"
        )}
        style={{ borderColor: sectionColor }}
    >
       <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 w-full overflow-hidden">
             <div className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${categoryColor}1A` }}>
                <CategoryIcon name={categoryIcon} className="w-6 h-6" style={{ color: categoryColor }} />
            </div>
             <div className="w-full overflow-hidden">
                <h3 className="font-bold text-base leading-tight text-foreground">
                    <Link href={detailUrl} className="hover:underline">
                        {job.title}
                    </Link>
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                    {categoryName}
                </p>
             </div>
          </div>
        </div>
      </CardHeader>
      
      <Separator />

      <CardContent className="p-4 flex-grow flex flex-wrap items-start gap-2">
        {isSeekingJob ? (
          <>
            <InfoBadge
                icon={MapPin}
                text={`${job.country}, ${job.city}`}
                variant="destructive"
                className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800"
            />
            <InfoBadge
                icon={UserIcon}
                text={job.ownerName}
                variant="secondary"
                className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-200 dark:border-gray-800"
            />
          </>
        ) : (
          <>
            <InfoBadge
                icon={MapPin}
                text={`${job.country}, ${job.city}`}
                variant="destructive"
                className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800"
            />
            {salaryText && (
                <InfoBadge 
                    icon={Wallet} 
                    text={salaryText} 
                    variant="accent"
                    className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800"
                />
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
         <span className="text-xs text-muted-foreground">{job.postedAt}</span>
        <Button asChild size="sm" className="text-sm rounded-lg active:scale-95 transition-transform" style={{ backgroundColor: `${sectionColor}1A`, color: sectionColor }}>
          <Link href={detailUrl}>{isSeekingJob ? 'عرض الملف' : 'عرض التفاصيل'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
