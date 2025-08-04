'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { CVForm } from './cv-form';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { FileText, Loader2 } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'أنشئ سيرتك الذاتية مجانًا',
  description: 'أنشئ سيرة ذاتية احترافية باللغة العربية مجانًا عبر منصة توظيفك، واختر من بين عدة قوالب جاهزة تساعدك في الحصول على وظيفة أحلامك.',
};

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

const CVBuilderPageWrapper = () => {
    return (
        <AppLayout>
            <CVBuilderClient />
        </AppLayout>
    )
}

export default CVBuilderPageWrapper;
