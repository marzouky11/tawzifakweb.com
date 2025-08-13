
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle';

export function HomeHeaderMobile() {
  const { user, userData, loading } = useAuth();
  const blueDotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`;

  const renderAuthButton = () => {
    if (loading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    if (user && userData) {
      return (
        <Link href="/profile">
          <UserAvatar name={userData.name} color={userData.avatarColor} className="h-10 w-10" />
        </Link>
      );
    }
    return (
      <Button asChild variant="ghost" size="icon" className="h-10 w-10">
        <Link href="/login">
          <UserIcon className="h-6 w-6 text-primary" />
        </Link>
      </Button>
    );
  };

  return (
      <div 
        className="md:hidden bg-card text-card-foreground p-4 rounded-b-3xl shadow-md border-b-4 border-primary"
        style={{ backgroundImage: blueDotPattern }}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image src="/LOGO2.png" alt="شعار توظيفك" width={140} height={35} priority />
            </Link>
            <div className="flex items-center gap-1">
              {renderAuthButton()}
              <ThemeToggleButton className="text-primary bg-background/50 hover:bg-background/70 h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
  );
}
