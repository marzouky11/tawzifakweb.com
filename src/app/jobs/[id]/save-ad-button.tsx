'use client';

import { useState, useEffect, useRef, useOptimistic } from 'react';
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

  // Use useOptimistic for instant UI feedback
  const [optimisticIsSaved, setOptimisticIsSaved] = useOptimistic(
    isSaved,
    (currentState, optimisticValue: boolean) => optimisticValue
  );

  useEffect(() => {
    let mounted = true;
    if (user) {
      setIsLoading(true);
      getSavedAdIds(user.uid).then(savedIds => {
        if (mounted) {
          const savedStatus = savedIds.includes(adId);
          setIsSaved(savedStatus);
          setIsLoading(false);
        }
      });
    } else {
      setIsSaved(false);
      setIsLoading(false);
    }
    return () => { mounted = false; };
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

    buttonRef.current?.blur();
    
    // Optimistically update the UI
    const newOptimisticState = !optimisticIsSaved;
    setOptimisticIsSaved(newOptimisticState);

    try {
      const newSaveStatus = await toggleSaveAd(user.uid, adId, adType);
      
      // Sync the real state
      setIsSaved(newSaveStatus);

      toast({
        title: newSaveStatus ? 'تم الحفظ بنجاح!' : 'تمت إزالة الحفظ',
        description: newSaveStatus
          ? 'يمكنك العثور على الإعلان في صفحة الإعلانات المحفوظة.'
          : 'تمت إزالة الإعلان من قائمتك المحفوظة.',
      });
    } catch (error) {
      // Revert the optimistic update on error
      setOptimisticIsSaved(isSaved);
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'حدث خطأ أثناء محاولة حفظ الإعلان. يرجى المحاولة مرة أخرى.',
      });
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant={optimisticIsSaved ? 'secondary' : 'outline'}
      size="lg"
      className="h-auto py-3 transition-all w-full"
      onClick={handleSaveToggle}
      disabled={authLoading || isLoading}
    >
      {isLoading || authLoading ? (
        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      ) : (
        <Bookmark
          className={cn(
            'ml-2 h-5 w-5 transition-colors',
            optimisticIsSaved ? 'fill-current text-primary' : 'text-muted-foreground'
          )}
        />
      )}
      <span className="text-base">{optimisticIsSaved ? 'تم الحفظ' : 'حفظ الإعلان'}</span>
    </Button>
  );
}
