
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Calendar, Users, Building } from 'lucide-react';
import type { Competition } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  return (
    <Card 
        className="flex flex-col rounded-lg bg-card shadow-md h-full transition-all hover:shadow-xl hover:border-blue-500/50 w-full overflow-hidden border-t-4 border-blue-500"
    >
       <CardHeader className="p-4">
        <div className="flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-blue-500 flex-shrink-0" />
             <h3 className="font-bold text-base leading-tight text-blue-800 dark:text-blue-300 line-clamp-2">
                <Link href={detailUrl} className="hover:underline">
                    {competition.title}
                </Link>
            </h3>
        </div>
      </CardHeader>
      
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

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-end">
        <Button asChild size="sm" className="text-sm rounded-lg bg-blue-500 text-primary-foreground hover:bg-blue-600">
          <Link href={detailUrl}>عرض التفاصيل</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
