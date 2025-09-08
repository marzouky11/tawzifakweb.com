
'use client';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // The home page has a different footer/bottom nav behavior on mobile,
  // so we apply bottom padding to every page EXCEPT the home page.
  const isHomePage = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className={cn(
          "flex-1",
          !isHomePage && "pb-24", // Add padding to all pages except home on mobile
          "md:pb-0" // Remove padding on desktop
        )}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
