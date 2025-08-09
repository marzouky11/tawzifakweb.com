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

const desktopFooterLinks = [
{ label: 'من نحن', href: '/about' },
{ label: 'الأسئلة الشائعة', href: '/faq' },
{ label: 'اتصل بنا', href: '/contact' },
{ label: 'سياسة الخصوصية', href: '/privacy' },
{ label: 'شروط الاستخدام', href: '/terms' },
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
<div className="container mx-auto px-4 space-y-6">
<div>
<h3 className="font-bold text-lg mb-3 px-2">روابط مهمة</h3>
<div className="space-y-1">
{filteredImportantLinks.map((link) => <FooterLinkItem key={link.href} {...link} />)}
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

const DesktopFooter = () => (

  <footer className="hidden md:flex bg-card border-t mt-auto py-8">  
    <div className="container mx-auto px-4">  
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-right gap-6">  
            <div className="flex items-center gap-2">  
                <Handshake className="h-6 w-6 text-primary" />  
                <p className="text-sm text-muted-foreground">  
                    &copy; {new Date().getFullYear()} توظيفك. جميع الحقوق محفوظة.  
                </p>  
            </div>  
            <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">  
              {desktopFooterLinks.map((link) => (  
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">  
                  {link.label}  
                </Link>  
              ))}  
            </div>  
            <div>  
                 <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">  
                    <a href="https://www.facebook.com/profile.php?id=61578748771269" target="_blank" rel="noopener noreferrer" aria-label="Facebook">  
                        <Facebook className="h-5 w-5" />  
                    </a>  
                </Button>  
            </div>  
        </div>  
    </div>  
  </footer>  
);  export function Footer() {
return (
<>
<MobileFooter />
<DesktopFooter />
</>
);
}

