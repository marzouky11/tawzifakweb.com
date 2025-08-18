
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
        // We no longer record views from here for server components.
        // It's handled in `getViewsCount`. This component is for `use client` pages if needed.
        // recordView(adId, viewerId);
        viewRecordedRef.current = true; // Mark as recorded for this session
    };

    // This component will now only be used to get the visitorId and won't record views itself for pages that are server-rendered.
    if (user) {
      // User is logged in, their ID is handled on the server.
    } else {
      // Guest user, ensure they have an ID.
      getVisitorId();
    }
    viewRecordedRef.current = true; // Mark as "handled" to prevent re-runs.


  }, [adId, user, isClient]);

  return null;
}

    