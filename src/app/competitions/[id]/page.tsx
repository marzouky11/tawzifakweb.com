

import React from 'react';
import { notFound } from 'next/navigation';
import { getCompetitionById, getCompetitions } from '@/lib/data';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Landmark } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { CompetitionDesktopDetails } from './competition-desktop-details';
import { CompetitionMobileDetails } from './competition-mobile-details';


interface CompetitionDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CompetitionDetailPageProps): Promise<Metadata> {
  const competition = await getCompetitionById(params.id);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';
  
  if (!competition) {
    return {
      title: 'المباراة غير موجودة',
      description: 'لم نتمكن من العثور على المباراة التي تبحث عنها.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }

  const metaTitle = competition.title || 'مباراة عمومية';
  const metaDescription = (competition.description || `مباراة منظمة من طرف ${competition.organizer}.`).substring(0, 160);
  const canonicalUrl = `${baseUrl}/competitions/${competition.id}`;
  const createdAtDate = competition.createdAt?.toDate ? competition.createdAt.toDate() : new Date();

  // Structured Data
  const jobPostingJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: metaTitle,
      hiringOrganization: {
        '@type': 'Organization',
        name: competition.organizer,
      },
      datePosted: createdAtDate.toISOString(),
  };

  if (competition.competitionType) {
    jobPostingJsonLd.employmentType = competition.competitionType;
  }
  
  if (competition.positionsAvailable) {
    jobPostingJsonLd.totalJobOpenings = competition.positionsAvailable;
  }

  if (competition.location) {
    jobPostingJsonLd.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: competition.location,
        addressCountry: 'MA', // Assuming Morocco for now
      },
    };
  }
  
  if (competition.description) {
    jobPostingJsonLd.description = competition.description;
  }
  
  if (competition.requirements) {
    jobPostingJsonLd.qualifications = competition.requirements;
  }
  
  if (competition.documentsNeeded) {
    jobPostingJsonLd.educationRequirements = competition.documentsNeeded;
  }
  
  if (competition.jobProspects) {
      jobPostingJsonLd.experienceRequirements = competition.jobProspects;
  }

  if(competition.competitionStages) {
      jobPostingJsonLd.responsibilities = competition.competitionStages;
  }

  if (competition.trainingFeatures) {
      jobPostingJsonLd.jobBenefits = competition.trainingFeatures;
  }

  if (competition.howToApply) {
    jobPostingJsonLd.applicationInstructions = competition.howToApply;
  }
  
  if (competition.officialLink) {
    jobPostingJsonLd.directApply = true;
  }

  if (competition.deadline) {
    try {
        const deadlineDate = new Date(competition.deadline.split(' ')[0]);
        if (!isNaN(deadlineDate.getTime())) {
            jobPostingJsonLd.validThrough = deadlineDate.toISOString();
        }
    } catch(e) { /* ignore date parsing errors */ }
  }


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

export default async function CompetitionDetailPage({ params }: CompetitionDetailPageProps) {
    const competition = await getCompetitionById(params.id);

    if (!competition) {
        notFound();
    }
    
    const similarCompetitions = await getCompetitions({ count: 2, excludeId: competition.id });

    return (
        <>
            <MobilePageHeader title="تفاصيل المباراة">
                <Landmark className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={Landmark}
                title="تفاصيل المباراة العمومية"
                description="هنا تجد جميع المعلومات المتعلقة بهذه المباراة."
            />

            {/* Mobile View */}
            <div className="block md:hidden">
                <CompetitionMobileDetails competition={competition} similarCompetitions={similarCompetitions} />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <CompetitionDesktopDetails competition={competition} similarCompetitions={similarCompetitions} />
            </div>
        </>
    );
}
