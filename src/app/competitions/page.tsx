
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { getCompetitions } from '@/lib/data';
import { ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { CompetitionCard } from '@/components/competition-card';

export const metadata: Metadata = {
  title: 'المباريات العمومية - آخر إعلانات التوظيف الحكومي',
  description: 'تصفح آخر مباريات التوظيف في القطاع العام في المغرب والدول العربية. فرص عمل حكومية محدثة يوميًا.',
};

function CompetitionsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CompetitionCard key={i} competition={null} />
      ))}
    </div>
  );
}

async function CompetitionsList() {
  const competitions = await getCompetitions();

  if (competitions.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitions.map((comp) => <CompetitionCard key={comp.id} competition={comp} />)}
      </div>
    );
  }
  return <p className="col-span-full text-center text-muted-foreground py-10">لا توجد مباريات عمومية متاحة حاليًا.</p>;
}

export default async function CompetitionsPage() {

  return (
    <AppLayout>
      <MobilePageHeader title="المباريات العمومية">
        <ShieldCheck className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={ShieldCheck}
        title="المباريات العمومية"
        description="تصفح أحدث إعلانات التوظيف والمباريات في القطاع العام."
      />
      <div className="container py-6">
        <Suspense fallback={<CompetitionsListSkeleton />}>
          <CompetitionsList />
        </Suspense>
      </div>
    </AppLayout>
  );
}
