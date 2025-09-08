

import React from 'react';
import { notFound } from 'next/navigation';
import { getJobById, getJobs } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Briefcase } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { JobDesktopDetails } from './job-desktop-details';
import { JobMobileDetails } from './job-mobile-details';
import type { WorkType } from '@/lib/types';


interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';
  
  if (!job) {
    return {
      title: 'الإعلان غير موجود',
      description: 'لم نتمكن من العثور على الإعلان الذي تبحث عنه.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }
  
  const jobTitle = job.title || 'إعلان وظيفة';
  const jobCity = job.city || 'مدينة غير محددة';
  const jobCountry = job.country || 'دولة غير محددة';
  const metaDescription = (job.description || `${jobTitle} في ${jobCity}, ${jobCountry}.`).substring(0, 160);
  const createdAtDate = (job.createdAt && typeof job.createdAt.toDate === 'function') 
    ? job.createdAt.toDate() 
    : new Date();

  // Construct simplified and valid structured data
  const jobPostingJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: jobTitle,
      description: metaDescription,
      datePosted: createdAtDate.toISOString(),
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName || 'شركة غير محددة',
        sameAs: baseUrl,
      },
      jobLocation: {
          '@type': 'Place',
          address: {
              '@type': 'PostalAddress',
              addressLocality: job.city,
              addressCountry: job.country,
          },
      },
      employmentType: "FULL_TIME", // Using a general valid value
  };

  const canonicalUrl = `${baseUrl}/jobs/${job.id}`;

  return {
    title: jobTitle,
    description: metaDescription,
    robots: 'index, follow',
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: jobTitle,
        description: metaDescription,
        url: canonicalUrl,
        siteName: 'توظيفك',
        type: 'article',
        images: [{ url: siteThumbnail, width: 1200, height: 630, alt: jobTitle }],
    },
    twitter: {
        card: 'summary_large_image',
        title: jobTitle,
        description: metaDescription,
        images: [siteThumbnail],
    },
    other: {
        'application/ld+json': JSON.stringify(jobPostingJsonLd, null, 2)
    }
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const job = await getJobById(params.id);

    if (!job || job.postType !== 'seeking_worker') {
        notFound();
    }

    const similarJobs = await getJobs({
        categoryId: job.categoryId,
        postType: 'seeking_worker',
        count: 2,
        excludeId: job.id,
    });
    
    return (
        <>
            {/* Common Headers for both mobile and desktop */}
            <MobilePageHeader title="تفاصيل عرض العمل">
                <Briefcase className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={Briefcase}
                title="تفاصيل عرض العمل"
                description="هنا تجد جميع المعلومات المتعلقة بفرصة العمل هذه."
            />

            {/* Mobile View */}
            <div className="block md:hidden">
                <JobMobileDetails job={job} similarJobs={similarJobs} />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <JobDesktopDetails job={job} similarJobs={similarJobs} />
            </div>
        </>
    );
}
