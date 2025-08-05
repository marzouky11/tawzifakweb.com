
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { recordView } from '@/lib/data';

export function ViewCounter({ adId }: { adId: string }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user && adId) {
      recordView(adId, user.uid);
    }
  }, [adId, user]);

  return null;
}
