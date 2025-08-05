'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { PostJobForm } from '@/app/post-job/post-job-form';
import { getCategories, getJobById } from '@/lib/data';
import { Loader2, Edit } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import type { Job } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';

export default function EditJobPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchJob = async () => {
      if (params.id) {
        const jobData = await getJobById(params.id as string);
        
        // Ownership check
        if (!jobData || jobData.userId !== user?.uid) {
          // Instead of notFound(), redirect or show an error
          router.push('/');
          return;
        }

        setJob(jobData);
        setLoading(false);
      }
    };

    if (user) {
        fetchJob();
    }
  }, [params.id, user, router]);

  const categories = getCategories();

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MobilePageHeader title="تعديل الإعلان">
        <Edit className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Edit}
        title="تعديل الإعلان"
        description="قم بتحديث معلومات إعلانك لضمان وصوله للشخص المناسب."
      />
      <div className="flex-grow">
        <div className="container mx-auto max-w-3xl px-4 pb-8">
          <Card>
            <CardContent className="pt-6">
              <AnimatePresence>
                {job && (
                  <PostJobForm
                    categories={categories}
                    job={job}
                  />
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
