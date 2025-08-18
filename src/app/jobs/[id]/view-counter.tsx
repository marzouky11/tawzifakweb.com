
'use client';

import { useEffect, useRef } from 'react';
import { recordView } from '@/lib/data';

export function ViewCounter({ adId }: { adId: string }) {
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (!adId || hasRecorded.current) {
      return;
    }

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
        console.error("Session storage is not available or failed:", error);
        recordView(adId);
        hasRecorded.current = true;
    }

  }, [adId]);

  return null;
}
