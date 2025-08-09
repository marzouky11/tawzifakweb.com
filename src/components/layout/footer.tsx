
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
Facebook,
Handshake,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { getArticles } from '@/lib/articles';

const importantLinks = [
{ label: 'تسجيل الدخول', href: '/login', icon: LogIn, guestOnly: true },
{ label: 'إنشاء حساب', href: '/signup', icon: UserPlus, guestOnly: true },
{ label: 'الوظائف', href: '/jobs', icon: Briefcase },
{ label: 'العمال', href: '/workers', icon: Users },
{ label: 'نشر إعلان', href: '/post-job/select-type', icon: PlusCircle },
{ label: 'إنشاء سيرة ذاتية', href: '/cv-builder', icon: FileText },
{ label: 'الإعدادات', href: '/profile', icon: Settings },
];

const platformLinks = [
{ label: 'مقالات', href: '/articles', icon: Newspaper },
{ label: 'من نحن', href: '/about', icon: Info },
{ label: 'اتصل بنا', href: '/contact', icon: Mail },
{ label: 'سياسة الخصوصية', href: '/privacy', icon: Shield },
{ label: 'شروط الاستخدام', href: '/terms', icon: FileText },
{ label: 'الأسئلة الشائعة', href: '/faq', icon: HelpCircle },
];

const FooterLinkItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => (

<Link href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">  
<div className="flex items-center gap-3">  
<Icon className="h-5 w-5 text-primary" />  
<span className="font-medium text-sm">{label}</span>  
</div>  
<ArrowLeft className="h-4 w-4 text-muted-foreground" />  
</Link>  
);
  
const MobileFooter = () => {
const { user } = useAuth();
const pathname = usePathname();
const filteredImportantLinks = importantLinks.filter(link => !link.guestOnly || !user);

if (pathname !== '/') {
return null;
}

return (

<footer className="md:hidden bg-card border-t py-6 mt-0">  
<div className="container mx-auto px-4 space-y-6 pb-24">  
<div>  
<h3 className="font-bold text-lg mb-3 px-2">روابط مهمة</h3>  
<div className="space-y-1">  
{filteredImportantLinks.map((link) => <FooterLinkItem key={link.href} {...link} />)}  
</div>  
</div>  <Separator />    <div>    
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
</footer>  );
};

const DesktopFooter = () => {
  return (
    <footer className="hidden md:block bg-card border-t mt-auto py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-center lg:text-right">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex justify-center lg:justify-start items-center gap-2">
              <Handshake className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">توظيفك</span>
            </div>
            <p className="text-muted-foreground text-sm">
              منصتك الأولى للعثور على فرص عمل موثوقة في العالم العربي. نصل بين الباحثين عن عمل وأصحاب العمل.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-lg">روابط مهمة</h4>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary">الوظائف</Link></li>
              <li><Link href="/workers" className="text-sm text-muted-foreground hover:text-primary">العمال</Link></li>
              <li><Link href="/articles" className="text-sm text-muted-foreground hover:text-primary">مقالات</Link></li>
              <li><Link href="/post-job/select-type" className="text-sm text-muted-foreground hover:text-primary">نشر إعلان</Link></li>
              <li><Link href="/cv-builder" className="text-sm text-muted-foreground hover:text-primary">إنشاء سيرة ذاتية</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">الشروط والسياسات</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">شروط الاستخدام</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">من نحن</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">الأسئلة الشائعة</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">اتصل بنا</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
             <h4 className="font-bold text-lg">معلومات المنصة</h4>
            <ul className="space-y-2">
                <li>
                    <a href="https://www.facebook.com/profile.php?id=61578748771269" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center lg:justify-start text-sm text-muted-foreground hover:text-primary">
                        <Facebook className="h-4 w-4" />
                        <span>تابعنا على فيسبوك</span>
                    </a>
                </li>
            </ul>
            <p className="text-xs text-muted-foreground pt-4">
                &copy; {new Date().getFullYear()} توظيفك. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
};

export function Footer() {  
return (  
<>  
<MobileFooter />  
<DesktopFooter />  
</>  
);  
}
