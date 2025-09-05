

import React from 'react';
import { notFound } from 'next/navigation';
import { getJobById, getJobs } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Briefcase } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { JobDesktopDetails } from './job-desktop-details';
import { JobMobileDetails } from './job-mobile-details';


interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';
  
  if (!job || job.postType !== 'seeking_worker') {
    return {
      title: 'الإعلان غير موجود',
      description: 'لم نتمكن من العثور على الإعلان الذي تبحث عنه.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }
  
  const employmentTypeMapping: {[key: string]: string} = {
    'full_time': 'FULL_TIME',
    'part_time': 'PART_TIME',
    'freelance': 'CONTRACTOR',
    'remote': 'OTHER',
  };

  const jobTitle = job.title || 'إعلان وظيفة';
  const jobCity = job.city || 'مدينة غير محددة';
  const jobCountry = job.country || 'دولة غير محددة';

  const metaDescription = (job.description || `${jobTitle} في ${jobCity}, ${jobCountry}.`).substring(0, 160);

  const createdAtDate = (job.createdAt && typeof job.createdAt.toDate === 'function') 
    ? job.createdAt.toDate() 
    : new Date();

  // Construct structured data description from specific fields
  let structuredDataDescription = '';
  if (job.description) {
      structuredDataDescription = job.description;
  } else {
      const structuredDataParts = [];
      if (job.city && job.country) structuredDataParts.push(`الموقع: ${job.city}, ${job.country}`);
      if (job.salary) structuredDataParts.push(`الراتب: ${job.salary}`);
      if (job.conditions) structuredDataParts.push(`الشروط: ${job.conditions}`);
      if (job.qualifications) structuredDataParts.push(`المؤهلات: ${job.qualifications}`);
      if (job.experience) structuredDataParts.push(`الخبرة: ${job.experience}`);
      structuredDataDescription = structuredDataParts.length > 0 ? structuredDataParts.join('\n') : `${jobTitle} في ${jobCity}, ${jobCountry}.`;
  }


  const jobPostingJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: jobTitle,
      description: structuredDataDescription,
      datePosted: createdAtDate.toISOString(),
      employmentType: job.workType ? employmentTypeMapping[job.workType] : 'OTHER',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName || 'توظيفك',
        sameAs: baseUrl,
        logo: siteThumbnail,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: jobCity,
          addressCountry: jobCountry,
        },
      },
      ...(job.workType === 'remote' && { jobLocationType: 'TELECOMMUTE' }),
      ...(job.salary && { 
        baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'SAR', // Assuming SAR, can be adapted based on country
            value: {
                '@type': 'QuantitativeValue',
                value: parseFloat(job.salary.replace(/[^0-9.]/g, '')) || 0,
                unitText: 'MONTH' // Assuming monthly salary
            }
        },
      }),
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
        images: [
            {
                url: siteThumbnail,
                width: 1200,
                height: 630,
                alt: jobTitle,
            },
        ],
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
