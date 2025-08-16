
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
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate font-medium">{text}</span>
    </div>
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
    seeking_worker: '#0D47A1', // Dark Blue
    seeking_job: '#424242',    // Dark Gray
  };
  const categoryColor = sectionColors[job.postType];

  const categoryIcon = category?.iconName || (isSeekingJob ? 'Users' : 'Briefcase');

  const salaryText = !isSeekingJob ? (job.salary || 'عند الطلب') : '';
  
  return (
    <Card 
        className="flex flex-col rounded-lg bg-card shadow-md h-full transition-all hover:shadow-xl w-full overflow-hidden border-t-4"
        style={{ borderColor: categoryColor }}
    >
       <CardHeader className="p-4">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${categoryColor}1A` }}>
                <CategoryIcon name={categoryIcon} className="w-5 h-5" style={{ color: categoryColor }} />
            </div>
             <h3 className="font-bold text-base leading-tight line-clamp-2" style={{color: categoryColor}}>
                <Link href={detailUrl} className="hover:underline">
                    {job.title}
                </Link>
            </h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow space-y-3">
        <InfoBadge
            icon={isSeekingJob ? UserIcon : Briefcase}
            text={isSeekingJob ? job.ownerName : categoryName}
        />
        <div className="flex items-center justify-between gap-2">
             <InfoBadge
                icon={MapPin}
                text={`${job.country}, ${job.city}`}
            />
            {salaryText && (
                <InfoBadge 
                    icon={Wallet} 
                    text={salaryText} 
                />
            )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
         <span className="text-xs text-muted-foreground">{job.postedAt}</span>
        <Button asChild size="sm" className="text-sm rounded-lg" style={{ backgroundColor: categoryColor, color: 'hsl(var(--primary-foreground))' }} >
          <Link href={detailUrl}>{isSeekingJob ? 'عرض الملف' : 'عرض التفاصيل'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

