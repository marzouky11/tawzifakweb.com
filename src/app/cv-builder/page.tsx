'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { CVForm } from './cv-form';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { FileText, Loader2 } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

// This is a client component, so we can't export metadata directly.
// We can handle this in a parent layout or by using the Head component from next/head if needed,
// but for App Router, moving metadata to a server component parent/layout is preferred.
// For this case, we'll assume the page can be structured to have a server component wrapper if needed.
// Or, we can modify the page to be a server component that wraps a client component.
// As a simple approach, we'll just add it here for reference, but it won't work in a 'use client' file.
// Let's remove 'use client' and wrap the logic in a client component.

function CVBuilderClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/cv-builder');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  return (
    <>
      <MobilePageHeader title="إنشاء السيرة الذاتية">
        <FileText className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={FileText}
        title="أداة إنشاء السيرة الذاتية"
        description="املأ بياناتك، اختر القالب المناسب، واحصل على سيرة ذاتية احترافية جاهزة للتقديم."
      />
      <div className="container mx-auto max-w-7xl px-4 pb-8">
        <CVForm />
      </div>
    </>
  );
}


export const metadata: Metadata = {
  title: 'أنشئ سيرتك الذاتية مجانا',
  description: 'أنشئ سيرة ذاتية احترافية باللغة العربية مجانًا عبر منصة توظيفك، واختر من بين عدة قوالب جاهزة تساعدك في الحصول على وظيفة أحلامك.',
};


export default function CVBuilderPage() {
    return (
        <AppLayout>
            <CVBuilderClient />
        </AppLayout>
    )
}
