
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { UserPlus } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
  title: 'أنشئ حسابك الآن – وانضم لأكبر منصة وظائف عربية',
  description: 'سجّل كمستخدم أو صاحب عمل وابدأ في نشر الوظائف أو التقديم عليها في كل من السعودية، مصر، المغرب، الإمارات، وباقي الدول.',
};

export default function SignupPage() {
  return (
    <AppLayout>
      <DesktopPageHeader
        icon={UserPlus}
        title="👋 أهلاً بك في توظيفك!"
        description="سجّل مجانًا لاكتشاف فرص العمل أو لعرض خدماتك والتواصل مع أصحاب المشاريع."
      />
      <SignupForm />
    </AppLayout>
  );
}
