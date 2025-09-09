
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react'; // Using ArrowRight for RTL 'back'

interface MobilePageHeaderProps {
  title: string;
  children?: React.ReactNode; // For the icon
}

export function MobilePageHeader({ title, children }: MobilePageHeaderProps) {
  const router = useRouter();

  return (
    <div className="md:hidden sticky top-0 z-50 flex items-center gap-4 p-4 border-b bg-card mb-4">
      <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => router.back()}>
        <ArrowRight className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-3 text-lg font-bold text-foreground">
        {children}
        <h1 className="truncate">{title}</h1>
      </div>
    </div>
  );
}
