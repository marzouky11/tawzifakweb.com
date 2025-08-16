
'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Users, Briefcase, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function SelectPostTypePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, type: string) => {
    if (!user) {
      e.preventDefault();
      router.push(`/login?redirect=/post-job?type=${type}`);
    }
  };

  const handleCompetitionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?redirect=/post-competition');
      return;
    }
    if (userData?.isAdmin) {
      router.push('/post-competition');
    } else {
        // Optionally, show a toast or message that this is for admins only
        alert("هذه الميزة متاحة للمشرفين فقط.");
    }
  }


  if (loading) {
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
      <MobilePageHeader title="نشر إعلان جديد">
        <PlusCircle className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={PlusCircle}
        title="نشر إعلان جديد"
        description="اختر نوع الإعلان الذي تريد نشره لتتمكن من ملء النموذج المناسب."
      />
      <div className="container mx-auto max-w-4xl px-4 pb-8">
        {!user && (
          <Alert className="mb-6 border-primary/50 text-primary">
            <LogIn className="h-4 w-4" />
            <AlertTitle className="font-bold">مطلوب تسجيل الدخول</AlertTitle>
            <AlertDescription>
              يجب عليك <Link href="/login?redirect=/post-job/select-type" className="font-bold underline">تسجيل الدخول</Link> أو <Link href="/signup?redirect=/post-job/select-type" className="font-bold underline">إنشاء حساب جديد</Link> أولاً لتتمكن من نشر إعلان.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/post-job?type=seeking_worker" onClick={(e) => handleLinkClick(e, 'seeking_worker')} className="lg:col-span-1">
            <Card className="p-6 text-center hover:shadow-xl hover:border-accent transition-all duration-300 cursor-pointer h-full flex flex-col justify-center items-center">
              <Briefcase className="h-16 w-16 text-accent mb-4" />
              <h3 className="text-xl font-semibold">أبحث عن موظف/عامل</h3>
              <p className="text-muted-foreground mt-2">
                انشر فرصة عمل لديك واعثر على أفضل المرشحين لمشروعك أو شركتك.
              </p>
            </Card>
          </Link>

          <Link href="/post-job?type=seeking_job" onClick={(e) => handleLinkClick(e, 'seeking_job')} className="lg:col-span-1">
            <Card className="p-6 text-center hover:shadow-xl hover:border-destructive transition-all duration-300 cursor-pointer h-full flex flex-col justify-center items-center">
              <Users className="h-16 w-16 text-destructive mb-4" />
              <h3 className="text-xl font-semibold">أبحث عن عمل</h3>
              <p className="text-muted-foreground mt-2">
                أنشئ ملفك الشخصي كباحث عن عمل واعرض مهاراتك وخبراتك لأصحاب العمل.
              </p>
            </Card>
          </Link>
          
          {userData?.isAdmin && (
            <Link href="/post-competition" onClick={handleCompetitionClick} className="lg:col-span-1">
                <Card className="p-6 text-center hover:shadow-xl hover:border-blue-500 transition-all duration-300 cursor-pointer h-full flex flex-col justify-center items-center bg-blue-50 dark:bg-blue-900/20">
                  <ShieldCheck className="h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">نشر مباراة عمومية</h3>
                  <p className="text-muted-foreground mt-2">
                    (خاص بالمشرفين) انشر إعلانات المباريات والوظائف الحكومية.
                  </p>
                </Card>
            </Link>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
