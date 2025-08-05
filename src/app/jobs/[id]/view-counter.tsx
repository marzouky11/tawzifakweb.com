
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { recordView } from '@/lib/data';

export function ViewCounter({ adId }: { adId: string }) {
  const { user } = useAuth();
  // Use a ref to ensure the view is only recorded once per component mount per session
  const viewRecordedRef = useRef(false);

  useEffect(() => {
    // Only record a view if we have a logged-in user, an adId, and we haven't recorded a view yet for this component instance.
    if (user && adId && !viewRecordedRef.current) {
      recordView(adId, user.uid);
      // Mark that we've recorded the view for this session.
      viewRecordedRef.current = true;
    }
  }, [adId, user]);

  return null;
}
