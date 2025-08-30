

'use client';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showMobileFooter = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className={cn("flex-1 md:pb-0", showMobileFooter ? 'pb-0' : 'pb-24')}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
