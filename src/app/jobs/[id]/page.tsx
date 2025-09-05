

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
  
  const employmentTypeMapping: { [key in WorkType]: string } = {
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

  const expiryDate = new Date(createdAtDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  // Construct structured data
  const jobPostingJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: jobTitle,
      datePosted: createdAtDate.toISOString(),
      validThrough: expiryDate.toISOString(),
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName || 'شركة غير محددة',
        sameAs: baseUrl,
      },
  };

  if(job.workType) {
    jobPostingJsonLd.employmentType = employmentTypeMapping[job.workType];
  }

  if (job.salary) {
    const salaryValue = parseFloat(job.salary.replace(/[^0-9.]/g, '')) || 0;
    jobPostingJsonLd.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'SAR', // Default currency
      value: {
        '@type': 'QuantitativeValue',
        value: salaryValue,
        unitText: 'MONTH', // Default unit
      },
    };
  }

  if (job.country || job.city) {
    jobPostingJsonLd.jobLocation = {
        '@type': 'Place',
        address: {
            '@type': 'PostalAddress',
            ...(job.country && { addressCountry: job.country }),
            ...(job.city && { addressLocality: job.city }),
        },
    };
  }
  
  if (job.workType === 'remote') {
      jobPostingJsonLd.jobLocationType = 'TELECOMMUTE';
  }

  if (job.description) {
      jobPostingJsonLd.description = job.description;
  }
  
  if (job.conditions) {
      jobPostingJsonLd.qualifications = job.conditions;
  }
  
  if (job.qualifications) {
      jobPostingJsonLd.educationRequirements = job.qualifications;
  }
  
  if (job.experience) {
      jobPostingJsonLd.experienceRequirements = job.experience;
  }
  
  if (job.tasks) {
      jobPostingJsonLd.responsibilities = job.tasks;
  }

  if (job.featuresAndOpportunities) {
      jobPostingJsonLd.jobBenefits = job.featuresAndOpportunities;
  }

  if (job.howToApply) {
      jobPostingJsonLd.applicationInstructions = job.howToApply;
  }

  if (job.applyUrl) {
    jobPostingJsonLd.directApply = true;
  }


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
