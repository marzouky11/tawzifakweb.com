
'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, MapPin, ArrowRight } from 'lucide-react';
import type { ImmigrationPost } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ImmigrationCardProps {
  post: ImmigrationPost | null;
}

const InfoBadge = ({ icon: Icon, text }: { icon: React.ElementType; text: string | undefined }) => {
  if (!text) return null;
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1.5 bg-sky-100/60 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-800/50"
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{text}</span>
    </Badge>
  );
};

export function ImmigrationCard({ post }: ImmigrationCardProps) {
  if (!post) {
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

  const detailUrl = `/immigration/${post.id}`;
  const sectionColor = '#0ea5e9'; // sky-500

  const programTypeTranslations = {
    work: 'عمل',
    study: 'دراسة',
    seasonal: 'موسمي',
    training: 'تدريب',
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-lg border-2 border-transparent hover:border-sky-400/50 transition-all duration-300 bg-gradient-to-br from-sky-50/50 to-white dark:from-sky-950/20 dark:to-background">
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-sky-100 dark:bg-sky-900/50 rounded-lg mt-1">
            <Plane className="h-6 w-6 text-sky-500" />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-lg leading-snug">
              <Link href={detailUrl} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                {post.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{`إلى ${post.targetCountry}`}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex flex-wrap gap-2">
          <InfoBadge icon={MapPin} text={programTypeTranslations[post.programType]} />
          <InfoBadge icon={Calendar} text={`آخر أجل: ${post.deadline}`} />
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-4">
          {post.description || post.requirements}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 mt-auto bg-slate-50/50 dark:bg-slate-900/20">
        <Button asChild size="sm" variant="link" className="text-sky-600 dark:text-sky-400 p-0 h-auto">
          <Link href={detailUrl}>
            عرض كل التفاصيل
            <ArrowRight className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
