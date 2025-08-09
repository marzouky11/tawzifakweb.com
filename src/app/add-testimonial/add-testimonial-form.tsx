'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { AddTestimonialForm } from './add-testimonial-form';
import { Loader2, MessageSquare } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export default function AddTestimonialPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/add-testimonial');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        <MobilePageHeader title="إضافة رأي">
          <MessageSquare className="h-5 w-5 text-primary" />
        </MobilePageHeader>

        <DesktopPageHeader
          icon={MessageSquare}
          title="شاركنا رأيك"
          description="نحن نقدر رأيك كثيرًا. ملاحظاتك تساعدنا على تحسين المنصة وتطويرها."
        />

        <main className="container mx-auto max-w-2xl px-4 pb-8 flex-grow">
          <Card>
            <CardContent className="pt-6">
              <AddTestimonialForm />
            </CardContent>
          </Card>
        </main>
      </div>
    </AppLayout>
  );
}
