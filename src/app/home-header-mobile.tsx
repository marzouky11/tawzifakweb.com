
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, LogIn } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';

export function HomeHeaderMobile() {
  const { user, userData, loading } = useAuth();

  const renderAuthButton = () => {
    if (loading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    if (user && userData) {
      return (
        <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Link href="/profile">
                <UserAvatar name={userData.name} color={userData.avatarColor} className="h-9 w-9" />
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

  return (
      <div 
        className="md:hidden bg-card text-card-foreground p-4 rounded-b-3xl shadow-md border-b-4 border-primary"
      >
        <div className="container mx-auto px-0">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image src="/LOGO2.png" alt="شعار توظيفك" width={130} height={32} priority />
            </Link>
            <div className="flex items-center gap-1">
                <ThemeToggleButton className="text-primary bg-background/50 hover:bg-background/70 h-10 w-10 rounded-full border border-primary/20" />
                <Separator orientation="vertical" className="h-6 mx-1 bg-border" />
                {renderAuthButton()}
            </div>
          </div>
        </div>
      </div>
  );
}
