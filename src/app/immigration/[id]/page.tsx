

import React from 'react';
import { notFound } from 'next/navigation';
import { getImmigrationPostById, getImmigrationPosts } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Plane } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { getProgramTypeDetails } from '@/lib/utils';
import { ImmigrationDesktopDetails } from './immigration-desktop-details';
import { ImmigrationMobileDetails } from './immigration-mobile-details';

interface ImmigrationDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ImmigrationDetailPageProps): Promise<Metadata> {
  const post = await getImmigrationPostById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';
  
  if (!post) {
    return {
      title: 'فرصة هجرة غير موجودة',
      description: 'لم نتمكن من العثور على فرصة الهجرة التي تبحث عنها.',
      robots: 'index, follow',
      openGraph: { 
        images: [{ url: siteThumbnail }],
        title: 'فرصة هجرة غير موجودة',
        description: 'لم نتمكن من العثور على فرصة الهجرة التي تبحث عنها.',
      },
    };
  }

  const programDetails = getProgramTypeDetails(post.programType);
  const metaTitle = post.title;
  const metaDescription = (post.description || `فرصة هجرة إلى ${post.targetCountry} في مجال ${programDetails.label}`).substring(0, 160);
  const canonicalUrl = `${baseUrl}/immigration/${post.id}`;
  const createdAtDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();

  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: metaTitle,
    description: post.description || `فرصة هجرة إلى ${post.targetCountry} في مجال ${programDetails.label}`,
    datePosted: createdAtDate.toISOString(),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'توظيفك',
      sameAs: baseUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: post.city || post.targetCountry,
        addressCountry: post.targetCountry,
      },
    },
    employmentType: 'OTHER',
    ...(post.salary && { 
        baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'USD', // Assuming USD, can be adapted
            value: {
                '@type': 'QuantitativeValue',
                value: parseFloat(post.salary.replace(/[^0-9.]/g, '')) || 0,
                unitText: 'MONTH'
            }
        },
        description: `الراتب: ${post.salary}`
    }),
    ...(post.deadline && { validThrough: post.deadline }),
  };


  return {
    title: metaTitle,
    description: metaDescription,
    robots: 'index, follow',
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        siteName: 'توظيفك',
        type: 'article',
        publishedTime: createdAtDate.toISOString(),
        images: [ { url: siteThumbnail, width: 1200, height: 630, alt: metaTitle } ],
    },
    twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [siteThumbnail],
    },
    other: {
        'application/ld+json': JSON.stringify(jobPostingJsonLd, null, 2)
    }
  };
}


export default async function ImmigrationDetailPage({ params }: ImmigrationDetailPageProps) {
    const post = await getImmigrationPostById(params.id);

    if (!post) {
        notFound();
    }
    
    const similarPosts = await getImmigrationPosts({ count: 4, excludeId: post.id });
    
    return (
        <>
            <MobilePageHeader title="فرصة هجرة">
                <Plane className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={Plane}
                title="تفاصيل فرصة الهجرة"
                description={`استكشف جميع المعلومات المتعلقة بفرصة الهجرة إلى ${post.targetCountry}.`}
            />

            {/* Mobile View */}
            <div className="block md:hidden">
                <ImmigrationMobileDetails post={post} similarPosts={similarPosts} />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <ImmigrationDesktopDetails post={post} similarPosts={similarPosts} />
            </div>
        </>
    );
}   
