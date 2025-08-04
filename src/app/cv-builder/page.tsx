
import { AppLayout } from '@/components/layout/app-layout';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { FileText } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import CVBuilderClient from './cv-builder-client';

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
