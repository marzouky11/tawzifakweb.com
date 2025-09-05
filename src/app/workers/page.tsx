
import type { Metadata } from 'next';
import { JobCard } from '@/components/job-card';
import { getJobs } from '@/lib/data';
import { JobFilters } from '@/components/job-filters';
import type { WorkType } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Users } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'باحثون عن عمل',
  robots: {
    index: false,
    follow: false,
  },
};


function JobFiltersSkeleton() {
    return <div className="h-14 bg-muted rounded-lg w-full animate-pulse" />;
}

function WorkerListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
         <JobCard key={i} job={null} />
      ))}
    </div>
  );
}

async function WorkerList({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
   const jobs = await getJobs({
      postType: 'seeking_job',
      searchQuery: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
      country: typeof searchParams?.country === 'string' ? searchParams.country : undefined,
      city: typeof searchParams?.city === 'string' ? searchParams.city : undefined,
      categoryId: typeof searchParams?.category === 'string' ? searchParams.category : undefined,
      workType: typeof searchParams?.workType === 'string' ? searchParams.workType as WorkType : undefined,
  });

  if (jobs.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    );
  }
  return <p className="col-span-full text-center text-muted-foreground py-10">لا يوجد باحثون عن عمل يطابقون بحثك.</p>;
}

export default function WorkersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <MobilePageHeader title="باحثون عن عمل">
        <Users className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Users}
        title="باحثون عن عمل"
        description="استعرض ملفات الباحثين عن عمل واعثر على الكفاءات التي تحتاجها."
      />
      <div className="container py-6">
        <div className="mb-6">
           <Suspense fallback={<JobFiltersSkeleton />}>
            <JobFilters />
          </Suspense>
        </div>
        
        <Suspense fallback={<WorkerListSkeleton />}>
          <WorkerList searchParams={searchParams} />
        </Suspense>

      </div>
    </>
  );
}
