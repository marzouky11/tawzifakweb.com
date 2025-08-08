
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
import { Loader2, Edit, Trash2, PenSquare } from 'lucide-react';
import { getJobs, deleteAd } from '@/lib/data';
import type { Job } from '@/lib/types';
import { JobCard } from '@/components/job-card';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export default function ManageAdsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData, loading: authLoading } = useAuth();
  const [allAds, setAllAds] = useState<Job[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !userData?.isAdmin)) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.isAdmin) {
        const fetchAds = async () => {
            setAdsLoading(true);
            const ads = await getJobs();
            setAllAds(ads);
            setAdsLoading(false);
        };
        fetchAds();
    }
  }, [user, userData]);

  const handleDeleteAd = async () => {
    if (!adToDelete) return;
    try {
        await deleteAd(adToDelete);
        setAllAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete));
        toast({ title: "تم حذف الإعلان بنجاح" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'فشل حذف الإعلان' });
    } finally {
        setAdToDelete(null);
    }
  };

  if (authLoading || !userData?.isAdmin) {
    return (
        <AppLayout>
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout>
       <DesktopPageHeader
        icon={PenSquare}
        title={'إدارة جميع الإعلانات'}
        description={"هنا يمكنك إدارة جميع إعلانات المستخدمين."}
      />
      <div className="flex-grow">
          <div className="container mx-auto max-w-5xl px-4 pb-8">
            <Card>
                <CardContent>
                    {adsLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : allAds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                            {allAds.map(ad => (
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
                        <div className="text-center text-muted-foreground p-8">
                            <p>لا توجد أي إعلانات منشورة حاليًا.</p>
                        </div>
                    )}
                </CardContent>
              </Card>
          </div>
      </div>
      <AlertDialog open={!!adToDelete} onOpenChange={(open) => !open && setAdToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء سيقوم بحذف هذا الإعلان بشكل نهائي. لا يمكن التراجع عن هذا القرار.
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
