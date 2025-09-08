'use client';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // This logic was complex and causing issues.
  // The simplest solution is to ensure there is always enough padding on mobile
  // for the bottom navigation bar.
  // The footer itself handles its own padding and margins.

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className={cn(
          "flex-1",
          "pb-24 md:pb-0" // Add padding-bottom on mobile, remove on desktop
        )}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
