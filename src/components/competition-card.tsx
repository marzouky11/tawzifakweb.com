
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Building } from 'lucide-react';
import type { Competition } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrganizerByName } from '@/lib/data';
import { CategoryIcon } from './icons';
import { Separator } from './ui/separator';

interface CompetitionCardProps {
  competition: Competition | null;
}

const InfoBadge = ({ icon, text, variant, className }: { icon?: React.ElementType, text: string | number | undefined, variant: "secondary" | "destructive" | "accent" | "default", className?: string }) => {
  if (!text) return null;
  const Icon = icon;
  return (
    <Badge variant={variant} className={cn("flex items-center gap-1.5 font-normal text-xs py-1", className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span className="truncate font-medium">{text}</span>
    </Badge>
  );
};


export function CompetitionCard({ competition }: CompetitionCardProps) {
  if (!competition) {
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

  const detailUrl = `/competitions/${competition.id}`;
  const organizer = getOrganizerByName(competition.organizer);
  const sectionColor = '#14532d';
  const organizerIcon = organizer?.icon || 'Landmark';
  const organizerColor = organizer?.color || sectionColor;
  
  return (
    <Card 
        className="flex flex-col rounded-lg bg-card shadow-md h-full transition-all hover:shadow-xl w-full overflow-hidden border-t-4"
        style={{ borderColor: sectionColor }}
    >
       <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 w-full overflow-hidden">
             <div className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${organizerColor}1A`}}>
                <CategoryIcon name={organizerIcon} className="w-6 h-6" style={{ color: organizerColor }} />
             </div>
             <div className="w-full overflow-hidden">
                <h3 className="font-bold text-base leading-tight line-clamp-2">
                    <Link href={detailUrl} className="hover:underline" style={{ color: sectionColor }}>
                        {competition.title}
                    </Link>
                </h3>
             </div>
          </div>
          {competition.isNew && <Badge variant="default" className="text-xs shrink-0">جديد</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow flex flex-wrap items-start gap-2">
         <InfoBadge
            icon={Building}
            text={competition.organizer}
            variant="secondary"
            className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-200 dark:border-gray-800"
        />
        <InfoBadge
            icon={Users}
            text={`${competition.positionsAvailable} منصب`}
            variant="accent"
            className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800"
        />
        <InfoBadge
            icon={Calendar}
            text={`آخر أجل: ${competition.deadline}`}
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800"
        />
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
         <span className="text-xs text-muted-foreground">{competition.postedAt}</span>
        <Button asChild size="sm" className="text-sm rounded-lg" variant="ghost">
          <Link href={detailUrl}>عرض التفاصيل</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
