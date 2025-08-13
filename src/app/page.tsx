
import type { Metadata } from 'next';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getJobs, getTestimonials } from '@/lib/data';
import React, { Suspense } from 'react';
import { Newspaper, Briefcase, Users, ArrowLeft, FileText } from 'lucide-react';
import { JobFilters } from '@/components/job-filters';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { HomeCarousel } from './home-carousel';
import { HomeExtraSections } from './home-extra-sections';
import { Separator } from '@/components/ui/separator';
import { getCategories } from '@/lib/data';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

const appName = 'توظيفك';
const appDescription = "توظيفك - منصتك الأولى للعثور على فرص عمل موثوقة في العالم العربي. وظائف يومية في السعودية، المغرب، مصر، الإمارات، الجزائر، تونس وغيرها. سجل مجانًا وابدأ العمل الآن.";

export const metadata: Metadata = {
  title: {
    default: "توظيفك - منصة التوظيف العربية للباحثين عن عمل وأصحاب العمل",
    template: `%s | ${appName}`
  },
  description: appDescription,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};


function JobFiltersSkeleton() {
    return (
        <div className="flex gap-2 items-center">
            <div className="h-14 bg-muted rounded-xl w-full animate-pulse flex-grow" />
            <div className="h-14 w-14 bg-muted rounded-xl animate-pulse flex-shrink-0" />
        </div>
    );
}

function JobSectionSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <JobCard key={i} job={null} />
            ))}
        </div>
    );
}

async function JobOffersSection() {
    const jobOffers = await getJobs({ postType: 'seeking_worker', count: 6 });
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobOffers.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
}

async function JobSeekersSection() {
    const jobSeekers = await getJobs({ postType: 'seeking_job', count: 6 });
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobSeekers.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
}

async function ExtraSections() {
    const testimonials = await getTestimonials();
    const jobOffersCount = (await getJobs({ postType: 'seeking_worker', count: 9999 })).length;
    const jobSeekersCount = (await getJobs({ postType: 'seeking_job', count: 9999 })).length;

    return (
        <HomeExtraSections
            testimonials={testimonials}
            jobOffersCount={jobOffersCount}
            jobSeekersCount={jobSeekersCount}
        />
    );
}


function HomeHeaderMobile() {
  const blueDotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
      <div 
        className="md:hidden sticky top-0 z-50 bg-card text-card-foreground p-4 rounded-b-3xl shadow-md border-b-4 border-primary"
        style={{ backgroundImage: blueDotPattern }}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image src="/LOGO2.png" alt="شعار توظيفك" width={140} height={35} priority />
            </Link>
            <div className="flex items-center gap-1">
              <ThemeToggleButton className="text-primary bg-background/50 hover:bg-background/70" />
            </div>
          </div>
        </div>
      </div>
  );
}

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

function SectionHeader({ icon: Icon, title, description, href }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button asChild variant="outline" className="shrink-0">
        <Link href={href}>
          عرض الكل
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function CVBuilderSection() {
  return (
    <section>
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden border-primary/20">
        <CardContent className="p-8 md:p-12 text-center">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full w-fit">
                    <FileText className="h-8 w-8 text-primary" />
                </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">أنشئ سيرتك الذاتية الآن</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-2xl mx-auto">
                استخدم أداة إنشاء السيرة الذاتية المجانية لدينا للحصول على سيرة ذاتية احترافية في دقائق. اختر من بين عدة قوالب مصممة لجذب انتباه أصحاب العمل.
            </p>
            <Button asChild size="lg">
                <Link href="/cv-builder">
                ابدأ الآن مجانًا
                <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
            </Button>
        </CardContent>
      </Card>
    </section>
  )
}

export default async function HomePage() {
  const categories = getCategories();
  
  return (
    <AppLayout>
      <HomeHeaderMobile />
      
      <div className="md:hidden container mt-4">
        <Suspense fallback={<JobFiltersSkeleton />}>
          <JobFilters categories={categories} showPostTypeSelect={true} />
        </Suspense>
      </div>
      
      <div className="container hidden md:block pt-6">
        <Card className="p-2 rounded-2xl shadow-lg">
          <Suspense fallback={<JobFiltersSkeleton />}>
            <JobFilters categories={categories} showPostTypeSelect={true} />
          </Suspense>
        </Card>
      </div>
      
      <div className="container space-y-12 mt-6 md:mt-8">
          <HomeCarousel />

          <section>
            <SectionHeader 
              icon={Briefcase}
              title="أحدث عروض العمل"
              description="اكتشف آخر فرص الشغل التي أضافها أصحاب العمل في مختلف المجالات."
              href="/jobs"
            />
            <Suspense fallback={<JobSectionSkeleton />}>
              <JobOffersSection />
            </Suspense>
          </section>

          <Separator />

          <section>
            <SectionHeader
              icon={Users}
              title="باحثون عن عمل"
              description="تصفح ملفات المرشحين والمهنيين المستعدين للانضمام إلى فريقك."
              href="/workers"
            />
            <Suspense fallback={<JobSectionSkeleton />}>
              <JobSeekersSection />
            </Suspense>
          </section>

          <Separator />

          <CVBuilderSection />
          
          <Separator />

          <Suspense>
            <ExtraSections />
          </Suspense>
      </div>
    </AppLayout>
  );
}
