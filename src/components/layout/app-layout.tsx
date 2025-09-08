

'use client';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noMobilePaddingOnMain = ['/'].includes(pathname);
  const addMobilePaddingOnMain = ['/testimonials'].includes(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className={cn(
          "flex-1",
          noMobilePaddingOnMain ? 'pb-0' : 'pb-16',
          addMobilePaddingOnMain ? 'pb-28' : '',
           "md:pb-0"
        )}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
