
import type { Metadata } from 'next';
import { getImmigrationPosts } from '@/lib/data';
import { Plane } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { ImmigrationCard } from '@/components/immigration-card';
import { ImmigrationFilters } from '@/components/immigration-filters';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'فرص الهجرة - آخر إعلانات الهجرة للعمل، الدراسة والتدريب',
  description: 'تصفح أحدث فرص الهجرة والعمل بالخارج في كندا، أوروبا، وأستراليا وغيرها. معلومات محدثة حول برامج الهجرة الموسمية والدائمة للعرب.',
  robots: 'index, follow',
};


function ImmigrationFiltersSkeleton() {
    return <div className="h-14 bg-muted rounded-xl w-full animate-pulse" />;
}

export default async function ImmigrationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const immigrationPosts = await getImmigrationPosts({
    searchQuery: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
  });

  return (
    <>
      <MobilePageHeader title="فرص الهجرة">
        <Plane className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Plane}
        title="فرص الهجرة حول العالم"
        description="استكشف أحدث إعلانات الهجرة للعمل، الدراسة، أو التدريب في مختلف الدول."
      />
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm md:top-20">
        <div className="md:hidden pt-6 pb-4">
          <div className="container">
           <Suspense fallback={<ImmigrationFiltersSkeleton />}>
            <ImmigrationFilters />
          </Suspense>
          </div>
        </div>
         <div className="hidden md:block py-2">
           <div className="container">
            <Suspense fallback={<ImmigrationFiltersSkeleton />}>
              <ImmigrationFilters />
            </Suspense>
           </div>
        </div>
      </div>

      <div className="container pt-4 md:pt-8 pb-6">
        {immigrationPosts.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {immigrationPosts.map((post) => <ImmigrationCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-10">لا توجد فرص هجرة تطابق بحثك.</p>
        )}
      </div>
    </>
  );
}
