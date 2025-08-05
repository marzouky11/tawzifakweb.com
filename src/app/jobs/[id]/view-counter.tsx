
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { recordView } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

// Function to get or create a unique visitor ID
const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = uuidv4();
        localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
};

// Function to check if an ad has been viewed by the current visitor
const hasViewedAd = (adId: string) => {
    const viewedAds = JSON.parse(localStorage.getItem('viewedAds') || '{}');
    return !!viewedAds[adId];
};

// Function to mark an ad as viewed
const markAdAsViewed = (adId: string) => {
    const viewedAds = JSON.parse(localStorage.getItem('viewedAds') || '{}');
    viewedAds[adId] = true;
    // Keep the list clean, store for ~30 days
    localStorage.setItem('viewedAds', JSON.stringify(viewedAds));
};


export function ViewCounter({ adId }: { adId: string }) {
  const { user } = useAuth();
  const viewRecordedRef = useRef(false);

  useEffect(() => {
    if (!adId || viewRecordedRef.current) {
      return;
    }

    const record = (viewerId: string) => {
        if (!hasViewedAd(adId)) {
            recordView(adId, viewerId);
            markAdAsViewed(adId);
            viewRecordedRef.current = true;
        }
    };

    if (user) {
        // Logged-in user
        record(user.uid);
    } else {
        // Guest user
        const visitorId = getVisitorId();
        record(visitorId);
    }

  }, [adId, user]);

  return null;
}
