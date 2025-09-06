
'use client';

import Link from 'next/link';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card } from '@/components/ui/card';
import { PlusCircle, Users, Briefcase, LogIn, Landmark, Plane, Newspaper } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';


const ActionCard = ({ icon: Icon, title, description, color, href, onClick }: { icon: React.ElementType, title: string, description: string, color: string, href: string, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
  <Link href={href} onClick={onClick}>
    <Card 
      className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col justify-center items-center"
      style={{
          '--card-color': color,
          backgroundColor: `${color}1A`,
          borderColor: `${color}4D`
      } as React.CSSProperties}
    >
      <Icon className="h-16 w-16 mb-4" style={{ color }}/>
      <h3 className="text-xl font-semibold" style={{ color }}>{title}</h3>
      <p className="text-muted-foreground mt-2">
        {description}
      </p>
    </Card>
  </Link>
);


const DisabledCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <Card className="p-6 text-center h-full flex flex-col justify-center items-center bg-muted/50 dark:bg-muted/20 opacity-70 cursor-not-allowed">
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, type: 'seeking_job' | 'seeking_worker' | 'competition' | 'immigration' | 'article') => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/post-job/select-type`);
      return;
    }

    const isAdminOnly = ['seeking_worker', 'competition', 'immigration', 'article'].includes(type);

    if (isAdminOnly && !userData?.isAdmin) {
       toast({
            variant: "destructive",
            title: "صلاحية غير كافية",
            description: "هذه الميزة متاحة للمشرفين فقط.",
        });
        return;
    }
    
    let path = '';
    switch(type) {
        case 'seeking_job':
            path = '/post-job?type=seeking_job';
            break;
        case 'seeking_worker':
            path = '/post-job?type=seeking_worker';
            break;
        case 'competition':
            path = '/post-competition';
            break;
        case 'immigration':
            path = '/post-immigration';
            break;
        case 'article':
            path = '/admin/post-article';
            break;
    }

    router.push(path);
  };


  if (loading) {
    return (
        <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }


  return (
    <>
      <MobilePageHeader title="نشر إعلان جديد">
        <PlusCircle className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={PlusCircle}
        title="نشر إعلان جديد"
        description="اختر نوع المحتوى الذي تريد نشره لتتمكن من ملء النموذج المناسب."
      />
      <div className="container mx-auto max-w-7xl px-4 pb-8">
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
          <ActionCard 
             icon={Users}
             title="أبحث عن عمل"
             description="أنشئ ملفك الشخصي كباحث عن عمل واعرض مهاراتك وخبراتك لأصحاب العمل."
             color="#424242"
             href="/post-job?type=seeking_job"
             onClick={(e) => handleLinkClick(e, 'seeking_job')}
          />
          
          {userData?.isAdmin ? (
            <>
              <ActionCard 
                 icon={Briefcase}
                 title="أبحث عن موظف/عامل"
                 description="(خاص بالمشرفين) انشر فرصة عمل واعثر على أفضل المرشحين."
                 color="#0D47A1"
                 href="/post-job?type=seeking_worker"
                 onClick={(e) => handleLinkClick(e, 'seeking_worker')}
              />
              <ActionCard 
                 icon={Plane}
                 title="نشر إعلان هجرة"
                 description="(خاص بالمشرفين) انشر فرص الهجرة والعمل بالخارج."
                 color="#0ea5e9"
                 href="/post-immigration"
                 onClick={(e) => handleLinkClick(e, 'immigration')}
              />
              <ActionCard 
                 icon={Landmark}
                 title="نشر مباراة عمومية"
                 description="(خاص بالمشرفين) انشر إعلانات المباريات والوظائف الحكومية."
                 color="#14532d"
                 href="/post-competition"
                 onClick={(e) => handleLinkClick(e, 'competition')}
              />
               <ActionCard 
                 icon={Newspaper}
                 title="نشر مقال"
                 description="(خاص بالمشرفين) أضف مقالاً جديداً لإثراء محتوى الموقع."
                 color="#00897B"
                 href="/admin/post-article"
                 onClick={(e) => handleLinkClick(e, 'article')}
              />
            </>
          ) : (
             <>
              <DisabledCard 
                  icon={Briefcase}
                  title="أبحث عن موظف/عامل"
                  description="هذه الميزة متاحة للمشرفين فقط."
              />
              <DisabledCard 
                  icon={Plane}
                  title="نشر إعلان هجرة"
                  description="هذه الميزة متاحة للمشرفين فقط."
              />
              <DisabledCard 
                  icon={Landmark}
                  title="نشر مباراة عمومية"
                  description="هذه الميزة متاحة للمشرفين فقط."
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
