'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Users, Briefcase, LogIn, Landmark, MessageCircleWarning, Newspaper } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';


const DisabledCard = ({ icon: Icon, title, description, color }: { icon: React.ElementType, title: string, description: string, color: string }) => (
    <Card className="p-6 text-center h-full flex flex-col justify-center items-center bg-muted/50 dark:bg-muted/20 opacity-70">
        <Icon className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground">{title}</h3>
        <p className="text-muted-foreground/80 mt-2">
            {description}
        </p>
    </Card>
);

export default function SelectPostTypePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, type: 'seeking_job' | 'seeking_worker' | 'competition') => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/post-job/select-type`);
      return;
    }

    if (type === 'seeking_worker' && !userData?.isAdmin) {
      toast({
        variant: "destructive",
        title: "صلاحية غير كافية",
        description: "نشر عروض العمل متاح للمشرفين فقط.",
      });
      return;
    }
    
    if (type === 'competition' && !userData?.isAdmin) {
       toast({
            variant: "destructive",
            title: "صلاحية غير كافية",
            description: "هذه الميزة متاحة للمشرفين فقط.",
        });
        return;
    }
    
    const path = type === 'competition' ? '/post-competition' : `/post-job?type=${type}`;
    router.push(path);
  };


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
          {/* Card 1: Seeking Job (for everyone) */}
          <Link href="/post-job?type=seeking_job" onClick={(e) => handleLinkClick(e, 'seeking_job')} className="lg:col-span-1">
            <Card className="p-6 text-center hover:shadow-xl hover:border-[#424242] transition-all duration-300 cursor-pointer h-full flex flex-col justify-center items-center bg-[#424242]/5 dark:bg-[#424242]/20">
              <Users className="h-16 w-16 text-[#424242] mb-4" />
              <h3 className="text-xl font-semibold text-[#424242]">أبحث عن عمل</h3>
              <p className="text-muted-foreground mt-2">
                أنشئ ملفك الشخصي كباحث عن عمل واعرض مهاراتك وخبراتك لأصحاب العمل.
              </p>
            </Card>
          </Link>
          
          {/* Card 2: Seeking Worker (admin only) */}
          {userData?.isAdmin ? (
            <Link href="/post-job?type=seeking_worker" onClick={(e) => handleLinkClick(e, 'seeking_worker')} className="lg:col-span-1">
              <Card className="p-6 text-center hover:shadow-xl hover:border-[#0D47A1] transition-all duration-300 cursor-pointer h-full flex flex-col justify-center items-center bg-[#0D47A1]/5 dark:bg-[#0D47A1]/20">
                <Briefcase className="h-16 w-16 text-[#0D47A1] mb-4" />
                <h3 className="text-xl font-semibold text-[#0D47A1]">أبحث عن موظف/عامل</h3>
                <p className="text-muted-foreground mt-2">
                  (خاص بالمشرفين) انشر فرصة عمل واعثر على أفضل المرشحين.
                </p>
              </Card>
            </Link>
          ) : (
             <DisabledCard 
                icon={Briefcase}
                title="أبحث عن موظف/عامل"
                description="إذا أردت نشر عرض عمل، يجب الاتصال بالدعم."
                color="#0D47A1"
             />
          )}

          {/* Card 3: Post Competition (admin only) */}
           {userData?.isAdmin ? (
            <Link href="/post-competition" onClick={(e) => handleLinkClick(e, 'competition')} className="lg:col-span-1">
              <Card className="p-6 text-center hover:shadow-xl hover:border-[#14532d] transition-all duration-300 cursor-pointer h-full flex flex-col justify-center items-center bg-[#14532d]/5 dark:bg-[#14532d]/20">
                <Landmark className="h-16 w-16 text-[#14532d] mb-4" />
                <h3 className="text-xl font-semibold text-[#14532d]">نشر مباراة عمومية</h3>
                <p className="text-muted-foreground mt-2">
                  (خاص بالمشرفين) انشر إعلانات المباريات والوظائف الحكومية.
                </p>
              </Card>
            </Link>
           ) : (
             <DisabledCard 
                icon={Landmark}
                title="نشر مباراة عمومية"
                description="إذا أردت نشر مباراة عمومية، يجب الاتصال بالدعم."
                color="#14532d"
             />
           )}
        </div>
      </div>
    </AppLayout>
  );
}