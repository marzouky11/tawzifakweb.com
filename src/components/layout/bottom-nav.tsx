

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Plus, Plane, Landmark, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/jobs', label: 'الوظائف', icon: Briefcase },
  { href: '/post-job/select-type', label: 'إضافة', icon: Plus, isFab: true },
  { href: '/immigration', label: 'الهجرة', icon: Plane },
  { href: '/competitions', label: 'المباريات', icon: Landmark },
];

function BottomNavContent() {
  const pathname = usePathname();
  
  return (
    <div className="relative flex items-center justify-around h-16 mx-4 bg-card border rounded-2xl shadow-lg">
      {navItems.map((item, index) => {
        const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));

        if (item.isFab) {
          return (
            <div key={item.href} className="relative -top-8 z-50">
              <Link href={item.href} className="block">
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg border-4 border-background">
                  <Plus className="w-8 h-8 text-primary-foreground" />
                </div>
              </Link>
            </div>
          );
        }

        const isPlaceholder = index === 2;
        if (isPlaceholder) {
          return <div key="placeholder" className="w-16 h-16" />;
        }

        return (
          <Link href={item.href} key={item.href} className="flex-1">
            <div className="flex flex-col items-center justify-center gap-1 relative">
              <item.icon
                className={cn(
                  'h-6 w-6 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}


export function BottomNav() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  
  return (
    <footer className="fixed bottom-0 left-0 z-40 w-full h-20 bg-transparent md:hidden">
      <BottomNavContent />
    </footer>
  );
}
