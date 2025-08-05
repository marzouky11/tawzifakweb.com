
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
import { Separator } from '@/components/ui/separator';

interface JobCardProps {
  job: Job | null;
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

const InfoBadge = ({ icon: Icon, text, className }: { icon: React.ElementType, text: string | undefined, className?: string }) => {
  if (!text) return null;
  return (
    <Badge variant="secondary" className={cn("flex-shrink-0 font-normal text-xs py-1", className)}>
      <Icon className="h-4 w-4 ml-1" />
      <span className="truncate">{text}</span>
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
  const categoryColor = category?.color || (isSeekingJob ? 'hsl(var(--destructive))' : 'hsl(var(--primary))');
  const categoryIcon = category?.iconName || (isSeekingJob ? 'Users' : 'Briefcase');

  const workTypeText = job.workType ? workTypeTranslations[job.workType] : '';
  const salaryText = !isSeekingJob ? (job.salary || 'عند الطلب') : '';
  
  return (
    <Card 
        className={cn(
            "flex flex-col rounded-lg bg-card shadow-sm h-full transition-shadow hover:shadow-lg w-full overflow-hidden",
            isSeekingJob ? "border border-dashed" : "border-t-4"
        )}
        style={{ borderColor: categoryColor }}
    >
       <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow min-w-0">
             <div className="flex items-center gap-2 mb-2">
                 <CategoryIcon name={categoryIcon} className="w-5 h-5 flex-shrink-0" style={{ color: categoryColor }} />
                 <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2">
                    {job.title}
                </h3>
            </div>
             <p className="text-sm font-medium mr-7 truncate" style={{ color: categoryColor }}>
                {categoryName}
              </p>
          </div>
        </div>
      </CardHeader>
      
      <Separator />

      <CardContent className="p-4 flex-grow space-y-3">
        <div className="flex flex-wrap items-center gap-2">
            {isSeekingJob && (
                <InfoBadge
                    icon={UserIcon}
                    text={job.ownerName}
                    className="bg-purple-100/60 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                />
            )}
            <InfoBadge
                icon={MapPin}
                text={`${job.country}, ${job.city}`}
                className="bg-red-100/60 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            />
        </div>

        <div className="flex flex-wrap items-center gap-2">
            {!isSeekingJob && workTypeText && (
                 <InfoBadge 
                    icon={Clock} 
                    text={workTypeText} 
                    className="bg-blue-100/60 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                />
            )}
            {salaryText && (
                <InfoBadge 
                    icon={Wallet} 
                    text={salaryText} 
                    className="bg-green-100/60 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                />
            )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
        <Button asChild size="sm" className="text-sm rounded-lg" variant="secondary">
          <Link href={detailUrl}>{isSeekingJob ? 'عرض الملف' : 'عرض التفاصيل'}</Link>
        </Button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{job.postedAt}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
