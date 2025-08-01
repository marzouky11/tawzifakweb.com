
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { LogIn } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'تسجيل الدخول إلى حسابك – منصة التوظيف العربية',
  description: 'تصفح إعلاناتك أو قدم على وظائف بسهولة بعد تسجيل الدخول. كل ما تحتاجه للتوظيف في منصة واحدة عربية.',
};

export default function LoginPage() {
  return (
    <AppLayout>
      <DesktopPageHeader
        icon={LogIn}
        title="أهلاً بك مجدداً!"
        description="سجّل دخولك للوصول إلى حسابك وإدارة إعلاناتك."
      />
      <LoginForm />
    </AppLayout>
  );
}
