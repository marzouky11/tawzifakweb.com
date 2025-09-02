

import React from 'react';
import { notFound } from 'next/navigation';
import { getJobById, getJobs } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { User as UserIcon } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { WorkerDesktopDetails } from './worker-desktop-details';
import { WorkerMobileDetails } from './worker-mobile-details';

interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  
  if (!job) {
    return {
      title: 'الإعلان غير موجود',
    };
  }

  // Prevent indexing of job seeker profiles
  return {
    title: job.title,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'none',
        'max-snippet': -1,
      },
    },
  };
}

export default async function WorkerDetailPage({ params }: JobDetailPageProps) {
    const job = await getJobById(params.id);

    if (!job || job.postType !== 'seeking_job') {
        notFound();
    }
    
    const similarJobs = await getJobs({
      categoryId: job.categoryId,
      postType: job.postType,
      count: 2,
      excludeId: job.id,
    });
    
    return (
        <>
            <MobilePageHeader title="ملف باحث عن عمل">
                <UserIcon className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={UserIcon}
                title="ملف باحث عن عمل"
                description="استعرض مهارات وخبرات هذا المرشح وتواصل معه مباشرة."
            />

            {/* Mobile View */}
            <div className="block md:hidden">
                <WorkerMobileDetails job={job} similarJobs={similarJobs} />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <WorkerDesktopDetails job={job} similarJobs={similarJobs} />
            </div>
        </>
    );
}
