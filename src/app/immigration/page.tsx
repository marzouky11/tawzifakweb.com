
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { getImmigrationPosts } from '@/lib/data';
import { Plane } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { ImmigrationCard } from '@/components/immigration-card';

export const metadata: Metadata = {
  title: 'فرص الهجرة - آخر إعلانات الهجرة للعمل، الدراسة والتدريب',
  description: 'تصفح أحدث فرص الهجرة والعمل بالخارج في كندا، أوروبا، وأستراليا وغيرها. معلومات محدثة حول برامج الهجرة الموسمية والدائمة للعرب.',
};

export const revalidate = 0; // Force dynamic rendering

function ImmigrationListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ImmigrationCard key={i} post={null} />
      ))}
    </div>
  );
}

export default async function ImmigrationPage() {
  const immigrationPosts = await getImmigrationPosts();

  return (
    <AppLayout>
      <MobilePageHeader title="فرص الهجرة">
        <Plane className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Plane}
        title="فرص الهجرة حول العالم"
        description="استكشف أحدث إعلانات الهجرة للعمل، الدراسة، أو التدريب في مختلف الدول."
      />
      <div className="container py-6 space-y-6">
        {immigrationPosts.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {immigrationPosts.map((post) => <ImmigrationCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-10">لا توجد فرص هجرة متاحة حاليًا.</p>
        )}
      </div>
    </AppLayout>
  );
}
