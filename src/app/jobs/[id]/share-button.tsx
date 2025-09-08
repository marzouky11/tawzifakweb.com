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
    // Ensure this runs only on the client
    setCanShare(typeof navigator !== 'undefined' && ('share' in navigator || 'clipboard' in navigator));
  }, []);

  const handleShare = async () => {
    
    if ('share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          buttonRef.current?.blur();
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
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'تم نسخ الرابط!',
          description: 'تم نسخ رابط الإعلان إلى الحافظة لمشاركته.',
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({
          variant: 'destructive',
          title: 'فشل النسخ',
          description: 'حدث خطأ أثناء محاولة نسخ الرابط.',
        });
      }
    }

    buttonRef.current?.blur();
  };

  if (!canShare) {
    return null;
  }

  return (
    <Button ref={buttonRef} onClick={handleShare} variant="outline" size="lg" className="w-full h-auto py-3">
      <Share2 className="ml-2 h-5 w-5" />
      <span className="text-base">مشاركة الإعلان</span>
    </Button>
  );
}
