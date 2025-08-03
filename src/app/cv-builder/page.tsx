'use client';
import { AppLayout } from '@/components/layout/app-layout';
import { CVForm } from './cv-form';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { FileText, Loader2 } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CVBuilderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/cv-builder');
    }
  }, [user, loading, router]);

  if (loading || !user) {
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
    </AppLayout>
  );
}
