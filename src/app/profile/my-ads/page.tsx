'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Edit, Trash2, FileText, Frown } from 'lucide-react';
import { getJobsByUserId, deleteAd } from '@/lib/data';
import type { Job } from '@/lib/types';
import { JobCard } from '@/components/job-card';
import { useToast } from '@/hooks/use-toast';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export default function MyAdsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [myAds, setMyAds] = useState<Job[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
        const fetchAds = async () => {
            setAdsLoading(true);
            const ads = await getJobsByUserId(user.uid);
            setMyAds(ads);
            setAdsLoading(false);
        };
        fetchAds();
    }
  }, [user]);

  const handleDeleteAd = async () => {
    if (!adToDelete) return;
    try {
        await deleteAd(adToDelete);
        setMyAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete));
        toast({ title: "تم حذف الإعلان بنجاح" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'فشل حذف الإعلان' });
    } finally {
        setAdToDelete(null);
    }
  };

  return (
    <AppLayout>
      <MobilePageHeader title="إعلاناتي">
        <FileText className="h-5 w-5 text-primary" />
      </MobilePageHeader>
       <DesktopPageHeader
        icon={FileText}
        title="إعلاناتي"
        description="هنا يمكنك إدارة جميع إعلاناتك، تعديلها، أو حذفها."
      />
      <div className="flex-grow">
        {authLoading ? (
          <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="container mx-auto max-w-3xl px-4 pb-8">
            <Card>
                <CardContent>
                    {adsLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : myAds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                            {myAds.map(ad => (
                                <div key={ad.id} className="flex flex-col gap-2">
                                    <JobCard job={ad} />
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link href={`/edit-job/${ad.id}`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                تعديل
                                            </Link>
                                        </Button>
                                        <Button variant="destructive" className="flex-1" onClick={() => setAdToDelete(ad.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            حذف
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
                            <Frown className="w-16 h-16 text-muted-foreground/50" />
                            <p>لم تقم بنشر أي إعلانات بعد.</p>
                            <Button asChild>
                                <Link href="/post-job">نشر إعلان جديد</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
              </Card>
          </div>
        )}
      </div>
      <AlertDialog open={!!adToDelete} onOpenChange={(open) => !open && setAdToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء سيقوم بحذف إعلانك بشكل نهائي. لا يمكن التراجع عن هذا القرار.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdToDelete(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAd}>تأكيد الحذف</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
