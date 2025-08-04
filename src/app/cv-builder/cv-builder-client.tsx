
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { CVForm } from './cv-form';
import { Loader2 } from 'lucide-react';

export default function CVBuilderClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/cv-builder');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-7xl px-4 pb-8">
      <CVForm />
    </div>
  );
}
