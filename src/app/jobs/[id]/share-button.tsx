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
    if (typeof navigator !== 'undefined' && ('share' in navigator || 'clipboard' in navigator)) {
      setCanShare(true);
    }
  }, []);

  const handleShare = async () => {
    buttonRef.current?.blur();
    
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
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: 'تم نسخ الرابط!',
          description: 'تم نسخ رابط الإعلان إلى الحافظة لمشاركته.',
        });
      });
    }
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
