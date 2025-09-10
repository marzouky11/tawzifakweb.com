
import type { Metadata } from 'next';
import { getCompetitions } from '@/lib/data';
import { Landmark } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { CompetitionCard } from '@/components/competition-card';
import { CompetitionFilters } from '@/components/competition-filters';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'المباريات العمومية - آخر إعلانات التوظيف الحكومي',
  description: 'تصفح آخر مباريات التوظيف في القطاع العام في المغرب والدول العربية. فرص عمل حكومية محدثة يوميًا.',
  robots: 'index, follow',
  alternates: {
    canonical: '/competitions',
  },
};


function CompetitionFiltersSkeleton() {
    return <div className="h-14 bg-muted rounded-xl w-full animate-pulse" />;
}

export default async function CompetitionsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const competitions = await getCompetitions({
      searchQuery: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
  });

  return (
    <>
      <MobilePageHeader title="المباريات العمومية">
        <Landmark className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Landmark}
        title="المباريات العمومية"
        description="تصفح أحدث إعلانات التوظيف والمباريات في القطاع العام."
      />
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm md:top-20 md:mt-6">
        <div className="container py-2">
          <Suspense fallback={<CompetitionFiltersSkeleton />}>
            <CompetitionFilters />
          </Suspense>
        </div>
      </div>
      
      <div className="container pt-6 pb-6">
        {competitions.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {competitions.map((comp) => <CompetitionCard key={comp.id} competition={comp} />)}
          </div>
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-10">لا توجد مباريات تطابق بحثك.</p>
        )}
      </div>
    </>
  );
}
