'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, LogIn, Settings, Sun, Moon } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';

export function HomeHeaderMobile() {
  const { user, userData, loading } = useAuth();

  const renderAuthButton = () => {
    if (user && userData) {
      return (
        <Button asChild variant="outline" className="h-10 w-auto px-3 rounded-full border-primary/50 text-primary bg-primary/10">
            <Link href="/profile">
                <Settings className="h-4 w-4" />
                <span className="mr-1.5 font-semibold text-sm">حسابي</span>
            </Link>
        </Button>
      );
    }
    return (
      <Button asChild variant="outline" className="h-10 w-auto px-3 rounded-full border-primary/50 text-primary bg-primary/10">
        <Link href="/login">
          <LogIn className="h-4 w-4" />
          <span className="mr-1.5 font-semibold text-sm">دخول</span>
        </Link>
      </Button>
    );
  };

  const renderThemeToggle = () => {
    return <ThemeToggleButton className="text-primary bg-background/50 hover:bg-background/70 h-10 w-10 rounded-full border border-primary/20" />;
  };

  return (
      <div 
        className="md:hidden bg-card text-card-foreground p-4 rounded-b-3xl shadow-md border-b-4 border-primary"
      >
        <div className="container mx-auto px-0">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image src="/LOGO2.png" alt="شعار توظيفك" width={130} height={32} priority />
            </Link>
            <div className="flex items-center gap-2">
                {renderThemeToggle()}
                <Separator orientation="vertical" className="h-6" />
                {loading ? <Skeleton className="h-10 w-24 rounded-full" /> : renderAuthButton()}
            </div>
          </div>
        </div>
      </div>
  );
}
