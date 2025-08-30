

import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { FileText } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import CVBuilderClient from './cv-builder-client';

export default function CVBuilderPage() {
  return (
    <>
        <h1 className="sr-only">أداة إنشاء السيرة الذاتية باللغة العربية</h1>
        <MobilePageHeader title="إنشاء السيرة الذاتية">
            <FileText className="h-5 w-5 text-primary" />
        </MobilePageHeader>
        <DesktopPageHeader
            icon={FileText}
            title="أداة إنشاء السيرة الذاتية"
            description="املأ بياناتك، اختر القالب المناسب، واحصل على سيرة ذاتية احترافية جاهزة للتقديم."
        />
        <CVBuilderClient />
    </>
  );
}
