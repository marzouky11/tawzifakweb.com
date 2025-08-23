
'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, MapPin, ArrowRight, Wallet, Briefcase } from 'lucide-react';
import type { ImmigrationPost } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryIcon } from './icons';
import { Separator } from './ui/separator';

interface ImmigrationCardProps {
  post: ImmigrationPost | null;
}

const InfoBadge = ({ icon, text, className }: { icon?: React.ElementType; text: string | undefined; className?: string }) => {
  if (!text) return null;
  const Icon = icon;
  return (
    <Badge
      variant="secondary"
      className={cn("flex items-center gap-1.5 font-normal text-xs py-1 max-w-full", className)}
    >
      {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0" />}
      <span className="truncate font-medium">{text}</span>
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
  const iconName = post.iconName || 'Plane';

  const programTypeTranslations: { [key: string]: string } = {
    work: 'عمل',
    study: 'دراسة',
    seasonal: 'موسمي',
    training: 'تدريب',
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-md border-2 bg-card hover:border-sky-500/80 hover:shadow-2xl transition-all duration-300" style={{ borderColor: sectionColor }}>
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 dark:bg-sky-900/50 rounded-lg">
             <CategoryIcon name={iconName} className="h-6 w-6 text-sky-500" />
          </div>
          <div className="flex-grow overflow-hidden">
            <h3 className="font-bold text-lg leading-snug truncate">
              <Link href={detailUrl} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                {post.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{programTypeTranslations[post.programType]}</p>
          </div>
        </div>
      </CardHeader>
      
      <Separator />

      <CardContent className="p-4 pt-3 flex-grow">
        <div className="flex flex-wrap gap-2">
          <InfoBadge icon={MapPin} text={`${post.targetCountry}${post.city ? ', ' + post.city : ''}`} className="bg-sky-100/60 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-800/50"/>
          {post.salary && <InfoBadge icon={Wallet} text={post.salary} className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800" />}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto bg-card">
         <Button asChild size="sm" variant="link" className="text-sky-600 dark:text-sky-400 p-0 h-auto w-full justify-start">
          <Link href={detailUrl}>
            عرض كل التفاصيل
            <ArrowRight className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
