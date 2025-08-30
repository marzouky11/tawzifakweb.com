

'use client';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showMobileFooter = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Suspense>
        <Header />
      </Suspense>
      <main className={cn("flex-1 md:pb-0", showMobileFooter ? 'pb-0' : 'pb-28')}>
        {children}
      </main>
      <Footer />
      <Suspense>
        <BottomNav />
      </Suspense>
    </div>
  )
}
