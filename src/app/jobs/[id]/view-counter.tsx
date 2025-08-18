
'use client';

import { useEffect, useRef } from 'react';
import { recordView } from '@/lib/data';

export function ViewCounter({ adId }: { adId: string }) {
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (!adId || hasRecorded.current) {
      return;
    }

    // Use a more reliable way to prevent re-recording within the same session.
    const viewedAdsKey = 'viewedAds';
    try {
      const viewedAds = JSON.parse(sessionStorage.getItem(viewedAdsKey) || '[]');
      
      if (viewedAds.includes(adId)) {
        hasRecorded.current = true; // Already viewed in this session
        return;
      }
      
      recordView(adId).then(() => {
          // Add to session storage after successful recording
          viewedAds.push(adId);
          sessionStorage.setItem(viewedAdsKey, JSON.stringify(viewedAds));
      });

      hasRecorded.current = true; // Mark as recorded for this component instance

    } catch (error) {
        // Fallback for environments where sessionStorage is not available or fails
        console.error("Session storage is not available or failed, recording view without session tracking:", error);
        recordView(adId);
        hasRecorded.current = true;
    }

  }, [adId]);

  return null;
}
