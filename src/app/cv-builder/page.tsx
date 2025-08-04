
import { AppLayout } from '@/components/layout/app-layout';
import { CVForm } from './cv-form';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { FileText } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import type { Metadata } from 'next';
import CVBuilderClient from './cv-builder-client';


export const metadata: Metadata = {
  title: 'أنشئ سيرتك الذاتية مجانًا',
  description: 'أنشئ سيرة ذاتية احترافية باللغة العربية مجانًا عبر منصة توظيفك، واختر من بين عدة قوالب جاهزة تساعدك في الحصول على وظيفة أحلامك.',
};

export default function CVBuilderPage() {
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
        <CVBuilderClient />
    </AppLayout>
  );
}
