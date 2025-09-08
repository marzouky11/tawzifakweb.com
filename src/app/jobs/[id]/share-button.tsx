
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ShareButtonProps {
  title: string;
  text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const { toast } = useToast();
  const [canShare, setCanShare] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted
    // Check if the Web Share API or Clipboard API is available
    if (typeof navigator !== 'undefined' && ('share' in navigator || 'clipboard' in navigator)) {
      setCanShare(true);
    }
  }, []);

  const handleShare = async () => {
    // Use 'share' in navigator to check for the Web Share API's existence
    if ('share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return; // User cancelled the share
        }
        console.error('Error sharing:', error);
        toast({
          variant: 'destructive',
          title: 'فشلت المشاركة',
          description: 'حدث خطأ أثناء محاولة مشاركة الإعلان.',
        });
      }
    } else if ('clipboard' in navigator && navigator.clipboard) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: 'تم نسخ الرابط!',
          description: 'تم نسخ رابط الإعلان إلى الحافظة لمشاركته.',
        });
      });
    }
    buttonRef.current?.blur();
  };

  // Only render the button if the functionality is available on the client
  if (!canShare) {
    return null;
  }

  return (
    <Button ref={buttonRef} onClick={handleShare} variant="outline" className="w-full">
      <Share2 className="ml-2 h-4 w-4" />
      مشاركة الإعلان
    </Button>
  );
}
