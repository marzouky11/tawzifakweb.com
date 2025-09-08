
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
Facebook,
LogIn,
UserPlus,
Briefcase,
Users,
PlusCircle,
Settings,
Newspaper,
Info,
Mail,
Shield,
FileText,
HelpCircle,
ArrowLeft,
Landmark,
Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { getArticles } from '@/lib/articles';

const importantLinks = [
{ label: 'الوظائف', href: '/jobs', icon: Briefcase },
{ label: 'فرص الهجرة', href: '/immigration', icon: Plane },
{ label: 'المباريات العمومية', href: '/competitions', icon: Landmark },
{ label: 'العمال', href: '/workers', icon: Users },
{ label: 'نشر إعلان', href: '/post-job/select-type', icon: PlusCircle },
{ label: 'إنشاء سيرة ذاتية', href: '/cv-builder', icon: FileText },
];

const guestLinks = [
  { label: 'تسجيل الدخول', href: '/login', icon: LogIn },
  { label: 'إنشاء حساب', href: '/signup', icon: UserPlus },
];

const platformLinks = [
{ label: 'مقالات', href: '/articles', icon: Newspaper },
{ label: 'من نحن', href: '/about', icon: Info },
{ label: 'اتصل بنا', href: '/contact', icon: Mail },
{ label: 'سياسة الخصوصية', href: '/privacy', icon: Shield },
{ label: 'شروط الاستخدام', href: '/terms', icon: FileText },
{ label: 'الأسئلة الشائعة', href: '/faq', icon: HelpCircle },
];

const FooterLinkItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {

return (
<Link href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">  
<div className="flex items-center gap-3">  
<Icon className="h-5 w-5 text-primary" />  
<span className="font-medium text-sm">{label}</span>  
</div>  
<ArrowLeft className="h-4 w-4 text-muted-foreground" />  
</Link>  
);
}
  
const MobileFooter = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname !== '/') {
    return null;
  }

  return (
    <footer className="md:hidden bg-card border-t py-6 mt-0">  
      <div className="container mx-auto px-4 space-y-6 pb-24">  
        <div>  
          <h3 className="font-bold text-lg mb-3 px-2">روابط مهمة</h3>  
          <div className="space-y-1">  
            {!user && guestLinks.map((link) => <FooterLinkItem key={link.href} {...link} />)}
            {importantLinks.map((link) => <FooterLinkItem key={link.href} {...link} />)}  
            {user && <FooterLinkItem href="/profile" icon={Settings} label="الإعدادات" />}
          </div>  
        </div>
        <Separator />
        <div>    
          <h3 className="font-bold text-lg mb-3 px-2">معلومات المنصة</h3>    
          <div className="space-y-1">    
            {platformLinks.map((link) => <FooterLinkItem key={link.href} {...link} />)}    
            <a href="https://www.facebook.com/profile.php?id=61578748771269" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">    
              <div className="flex items-center gap-3">    
                <Facebook className="h-5 w-5 text-primary" />    
                <span className="font-medium text-sm">صفحتنا على فيسبوك</span>    
              </div>    
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />    
            </a>    
          </div>    
        </div>    
        <Separator />    
        <div className="text-center text-muted-foreground text-xs pt-4">    
          &copy; {new Date().getFullYear()} توظيفك. جميع الحقوق محفوظة.    
        </div>
      </div>    
    </footer>
  );
};

const DesktopFooter = () => {
    const { user } = useAuth();
  return (
    <footer className="hidden md:block bg-card border-t mt-auto pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-center lg:text-right">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex justify-center lg:justify-start items-center">
              <Image src="/LOGO2.png" alt="شعار توظيفك" width={150} height={40} />
            </div>
            <p className="text-muted-foreground text-sm"> منصة توظيفك هي وجهتك الأولى للبحث عن فرص العمل في المغرب والدول العربية. توفر المنصة وظائف متنوعة، إمكانية إنشاء سيرة ذاتية احترافية، ونشر الإعلانات الوظيفية بسهولة. تهدف إلى ربط الشركات بالمواهب بكفاءة، وتقديم تجربة توظيف مهنية وآمنة لجميع المستخدمين.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-lg">روابط مهمة</h4>
            <ul className="space-y-2">
              {importantLinks.map(link => (
                 <li key={link.href}><Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">{link.label}</Link></li>
              ))}
              {user && (
                 <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-primary">الإعدادات</Link></li>
              )}
            </ul>
          </div>

          <div className="space-y-4">
             <h4 className="font-bold text-lg">معلومات المنصة</h4>
            <ul className="space-y-2">
                <li><Link href="/articles" className="text-sm text-muted-foreground hover:text-primary">مقالات</Link></li>
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">من نحن</Link></li>
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">الأسئلة الشائعة</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">اتصل بنا</Link></li>
                <li>
                    <a href="https://www.facebook.com/profile.php?id=61578748771269" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center lg:justify-start text-sm text-muted-foreground hover:text-primary">
                        <Facebook className="h-4 w-4" />
                        <span>تابعنا على فيسبوك</span>
                    </a>
                </li>
            </ul>
          </div>
          
           <div className="space-y-4">
            <h4 className="font-bold text-lg">الشروط والسياسات</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">شروط الاستخدام</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} توظيفك. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
};

export function Footer() {  
  const pathname = usePathname();
  const showMobileFooter = pathname === '/';

  return (
    <>  
      {showMobileFooter && <MobileFooter />}
      <DesktopFooter />  
    </>  
  );  
}
