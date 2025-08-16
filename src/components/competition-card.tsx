
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Building } from 'lucide-react';
import type { Competition } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrganizerIcon } from '@/lib/data';
import { CategoryIcon } from './icons';
import { Separator } from './ui/separator';

interface CompetitionCardProps {
  competition: Competition | null;
}

const InfoBadge = ({ icon: Icon, text, className }: { icon: React.ElementType, text: string | number | undefined, className?: string }) => {
  if (!text) return null;
  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate font-medium">{text}</span>
    </div>
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
  const organizerIcon = getOrganizerIcon(competition.organizer);
  const sectionColor = '#B71C1C'; // Dark Red
  
  return (
    <Card 
        className="flex flex-col rounded-lg bg-card shadow-md h-full transition-all hover:shadow-xl w-full overflow-hidden border-t-4"
        style={{ borderColor: sectionColor }}
    >
       <CardHeader className="p-4">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${sectionColor}1A`}}>
                <CategoryIcon name={organizerIcon} className="w-5 h-5" style={{ color: sectionColor }} />
             </div>
             <h3 className="font-bold text-base leading-tight line-clamp-2" style={{color: sectionColor}}>
                <Link href={detailUrl} className="hover:underline">
                    {competition.title}
                </Link>
            </h3>
        </div>
      </CardHeader>
      
       <div className="px-4">
        <Separator />
      </div>
      
      <CardContent className="p-4 flex-grow space-y-3">
        <InfoBadge
            icon={Building}
            text={competition.organizer}
        />
        <div className="flex items-center justify-between gap-2">
             <InfoBadge
                icon={Users}
                text={`${competition.positionsAvailable} منصب`}
            />
            <InfoBadge
                icon={Calendar}
                text={`آخر أجل: ${competition.deadline}`}
                className="text-destructive"
            />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
         <span className="text-xs text-muted-foreground">{competition.postedAt}</span>
        <Button asChild size="sm" className="text-sm rounded-lg" style={{ backgroundColor: sectionColor, color: 'hsl(var(--primary-foreground))' }}>
          <Link href={detailUrl}>عرض التفاصيل</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
