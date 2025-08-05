
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

export function ViewCounter({ adId }: { adId: string }) {
  const { user } = useAuth();
  const viewRecordedRef = useRef(false);

  useEffect(() => {
    // We only want to record the view once per page load.
    if (!adId || viewRecordedRef.current) {
      return;
    }

    const record = (viewerId: string) => {
        recordView(adId, viewerId);
        viewRecordedRef.current = true; // Mark as recorded for this session
    };

    // Determine the viewer ID (either logged-in user or guest) and record the view.
    if (user) {
        record(user.uid);
    } else {
        const visitorId = getVisitorId();
        record(visitorId);
    }

  }, [adId, user]);

  return null;
}
