
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { PostJobForm } from './post-job-form';
import { Loader2, PlusCircle } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import type { Category, PostType } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface PostJobClientPageProps {
    categories: Category[];
}

export default function PostJobClientPage({ categories }: PostJobClientPageProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const postType = searchParams.get('type') as PostType | null;

  useEffect(() => {
    if (!loading) {
        if (!user) {
          router.push(`/login?redirect=/post-job?${searchParams.toString()}`);
          return;
        }

        if (!postType && !window.location.pathname.includes('edit-job')) {
            router.push('/post-job/select-type');
            return;
        }

        if (postType === 'seeking_worker' && !userData?.isAdmin) {
             toast({
                variant: "destructive",
                title: "صلاحية غير كافية",
                description: "نشر عروض العمل متاح للمشرفين فقط.",
            });
            router.push('/');
        }
    }
  }, [user, userData, loading, router, postType, searchParams, toast]);

  const pageTitle = postType === 'seeking_job' ? 'نشر طلب عمل' : 'نشر عرض عمل';
  const pageDescription = postType === 'seeking_job' 
    ? "املأ الحقول التالية لعرض مهاراتك وخبراتك للشركات." 
    : "املأ الحقول التالية لنشر فرصة عمل جديدة في المنصة.";

  return (
    <>
      <MobilePageHeader title={pageTitle}>
        <PlusCircle className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={PlusCircle}
        title={pageTitle}
        description={pageDescription}
      />
      <div className="flex-grow">
        {(loading || !user) ? (
            <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="container mx-auto max-w-3xl px-4 pb-8">
                <Card>
                  <CardContent className="p-0">
                    <AnimatePresence>
                        {postType && <PostJobForm categories={categories} preselectedType={postType} />}
                    </AnimatePresence>
                  </CardContent>
                </Card>
            </div>
        )}
      </div>
    </>
  );
}
