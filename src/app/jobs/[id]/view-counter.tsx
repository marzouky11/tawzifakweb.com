
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { recordView } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export function ViewCounter({ adId }: { adId: string }) {
  const { user } = useAuth();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (!adId || hasRecorded.current) {
      return;
    }

    // Use sessionStorage to track viewed ads within the current session
    const viewedAdsKey = 'viewedAds';
    try {
      const viewedAds = JSON.parse(sessionStorage.getItem(viewedAdsKey) || '[]');
      if (viewedAds.includes(adId)) {
        hasRecorded.current = true; // Already viewed in this session
        return;
      }
      
      const viewerId = user?.uid || uuidv4();
      recordView(adId, viewerId).then(() => {
          // Add to session storage after successful recording
          viewedAds.push(adId);
          sessionStorage.setItem(viewedAdsKey, JSON.stringify(viewedAds));
      });

      hasRecorded.current = true; // Mark as recorded for this component instance

    } catch (error) {
        // If sessionStorage is not available or fails, still try to record the view
        // but we won't be able to prevent re-recording on page refresh in this session.
        console.error("Session storage is not available or failed:", error);
        const viewerId = user?.uid || uuidv4();
        recordView(adId, viewerId);
        hasRecorded.current = true;
    }

  }, [adId, user]);

  return null;
}
