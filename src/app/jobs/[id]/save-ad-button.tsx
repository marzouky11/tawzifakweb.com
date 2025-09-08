'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Loader2 } from 'lucide-react';
import { toggleSaveAd, getSavedAdIds } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SaveAdButtonProps {
  adId: string;
  adType: 'job' | 'competition' | 'immigration';
}

export function SaveAdButton({ adId, adType }: SaveAdButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // جلب حالة الحفظ عند تحميل الصفحة أو تغير user/adId
  useEffect(() => {
    let mounted = true;
    if (user) {
      setIsLoading(true);
      getSavedAdIds(user.uid).then(savedIds => {
        if (mounted) {
          setIsSaved(savedIds.includes(adId));
          setIsLoading(false);
        }
      });
    } else {
      setIsSaved(false);
      setIsLoading(false);
    }
    return () => {
      mounted = false; // لتجنب تحديث state بعد unmount
    };
  }, [user, adId]);

  const handleSaveToggle = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'مطلوب تسجيل الدخول',
        description: 'يجب عليك تسجيل الدخول أولاً لحفظ الإعلانات.',
      });
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    setIsLoading(true);

    try {
      // انتظار النتيجة من السيرفر أولًا
      const newSaveStatus = await toggleSaveAd(user.uid, adId, adType);

      // تحديث UI حسب النتيجة الحقيقية
      setIsSaved(newSaveStatus);

      toast({
        title: newSaveStatus ? 'تم الحفظ بنجاح!' : 'تمت إزالة الحفظ',
        description: newSaveStatus
          ? 'يمكنك العثور على الإعلان في صفحة الإعلانات المحفوظة.'
          : 'تمت إزالة الإعلان من قائمتك المحفوظة.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'حدث خطأ أثناء محاولة حفظ الإعلان. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsLoading(false);
      // إزالة أي حالة focus/active
      buttonRef.current?.blur();
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant={isSaved ? 'secondary' : 'outline'} // تغيير اللون فورًا حسب الحالة
      size="default"
      className="h-10 px-4 transition-all"
      onClick={handleSaveToggle}
      disabled={authLoading || isLoading}
      onMouseUp={() => buttonRef.current?.blur()} // إزالة أي ضغط بصري بعد الضغط
    >
      {isLoading || authLoading ? (
        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      ) : (
        <Bookmark
          className={cn(
            'ml-2 h-4 w-4 transition-colors',
            isSaved ? 'fill-current text-primary' : 'text-muted-foreground'
          )}
        />
      )}
      <span>{isSaved ? 'تم الحفظ' : 'حفظ الإعلان'}</span>
    </Button>
  );
}
