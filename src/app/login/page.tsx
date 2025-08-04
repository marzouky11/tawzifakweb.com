
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { LogIn } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { LoginForm } from './login-form';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'تسجيل الدخول إلى حسابك – منصة التوظيف العربية',
  description: 'تصفح إعلاناتك أو قدم على وظائف بسهولة بعد تسجيل الدخول. كل ما تحتاجه للتوظيف في منصة واحدة عربية.',
};

function LoginFormFallback() {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AppLayout>
      <DesktopPageHeader
        icon={LogIn}
        title="أهلاً بك مجدداً!"
        description="سجّل دخولك للوصول إلى حسابك وإدارة إعلاناتك."
      />
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AppLayout>
  );
}
