
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { ContactForm } from './contact-form';

export default function ContactUsPage() {
  return (
    <AppLayout>
      <MobilePageHeader title="اتصل بنا">
        <Mail className="h-5 w-5 text-primary" />
      </MobilePageHeader>
       <DesktopPageHeader
        icon={Mail}
        title="اتصل بنا"
        description="نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو اقتراح."
      />
      <div className="container mx-auto max-w-2xl px-4 pb-8">
        <Card>
          <CardContent className="pt-6">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
