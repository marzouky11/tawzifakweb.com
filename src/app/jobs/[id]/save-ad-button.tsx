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

  // ✅ State محلي متزامن مع UI
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ جلب البيانات أول مرة أو عند تغير user/adId
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

    // ✅ تحديث الفورم مباشرة قبل الطلب للسيرفر
    setIsSaved(prev => !prev);
    setIsLoading(true);

    try {
      const newSaveStatus = await toggleSaveAd(user.uid, adId, adType);
      setIsSaved(newSaveStatus); // مزامنة مع السيرفر بعد الطلب
      toast({
        title: newSaveStatus ? 'تم الحفظ بنجاح!' : 'تمت إزالة الحفظ',
        description: newSaveStatus
          ? 'يمكنك العثور على الإعلان في صفحة الإعلانات المحفوظة.'
          : 'تمت إزالة الإعلان من قائمتك المحفوظة.',
      });
    } catch (error) {
      // ✅ الرجوع للوضع السابق في حالة خطأ
      setIsSaved(prev => !prev);
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'حدث خطأ أثناء محاولة حفظ الإعلان. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsLoading(false);
      buttonRef.current?.blur();
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant={isSaved ? 'secondary' : 'outline'} // استخدم variant للتغيير الفوري
      size="default"
      className="h-10 px-4 transition-all"
      onClick={handleSaveToggle}
      disabled={authLoading || isLoading}
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
