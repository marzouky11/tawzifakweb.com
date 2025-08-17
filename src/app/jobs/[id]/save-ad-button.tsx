
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Loader2 } from 'lucide-react';
import { toggleSaveAd, getSavedAdIds } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface SaveAdButtonProps {
  adId: string;
  adType: 'job' | 'competition';
}

export function SaveAdButton({ adId, adType }: SaveAdButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getSavedAdIds(user.uid).then(savedIds => {
        setIsSaved(savedIds.includes(adId));
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
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
      const newSaveStatus = await toggleSaveAd(user.uid, adId, adType);
      setIsSaved(newSaveStatus);
      toast({
        title: newSaveStatus ? 'تم الحفظ بنجاح!' : 'تمت إزالة الحفظ',
        description: newSaveStatus ? 'يمكنك العثور على الإعلان في صفحة الإعلانات المحفوظة.' : 'تمت إزالة الإعلان من قائمتك المحفوظة.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'حدث خطأ أثناء محاولة حفظ الإعلان. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full"
      onClick={handleSaveToggle}
      disabled={authLoading || isLoading}
      aria-label={isSaved ? 'إلغاء حفظ الإعلان' : 'حفظ الإعلان'}
    >
      {isLoading || authLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Bookmark
          className={`h-5 w-5 transition-colors ${
            isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'
          }`}
        />
      )}
    </Button>
  );
}
