
'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { recordView } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

// Function to get or create a unique visitor ID
const getVisitorId = (): string | null => {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            visitorId = uuidv4();
            localStorage.setItem('visitorId', visitorId);
        }
        return visitorId;
    }
    return null; // Return null if not in a browser
};

export function ViewCounter({ adId }: { adId: string }) {
  const { user } = useAuth();
  const viewRecordedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // We only want to record the view once per page load and only on the client.
    if (!adId || !isClient || viewRecordedRef.current) {
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
        if (visitorId) {
            record(visitorId);
        }
    }

  }, [adId, user, isClient]);

  return null;
}
