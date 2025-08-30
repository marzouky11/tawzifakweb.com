

import type { Metadata } from 'next';
import { UserPlus } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { SignupForm } from './signup-form';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';


export const metadata: Metadata = {
  title: 'أنشئ حسابك الآن – وانضم لأكبر منصة وظائف عربية',
  description: 'سجّل كمستخدم أو صاحب عمل وابدأ في نشر الوظائف أو التقديم عليها في كل من السعودية، مصر، المغرب، الإمارات، وباقي الدول.',
};

function SignupFormFallback() {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <>
      <DesktopPageHeader
        icon={UserPlus}
        title="👋 أهلاً بك في توظيفك!"
        description="سجّل مجانًا لاكتشاف فرص العمل أو لعرض خدماتك والتواصل مع أصحاب المشاريع."
      />
      <Suspense fallback={<SignupFormFallback />}>
        <SignupForm />
      </Suspense>
    </>
  );
}
