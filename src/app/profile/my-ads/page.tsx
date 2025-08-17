
'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
import { Loader2, Trash2, FileText, Frown, FileSignature } from 'lucide-react';
import { getJobsByUserId, deleteAd, getJobs, getCompetitions, deleteCompetition } from '@/lib/data';
import type { Job, Competition } from '@/lib/types';
import { JobCard } from '@/components/job-card';
import { CompetitionCard } from '@/components/competition-card';
import { useToast } from '@/hooks/use-toast';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function AdGrid({ ads, onAdDelete }: { ads: Job[], onAdDelete: (adId: string) => void }) {
    if (ads.length === 0) {
        return (
             <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
                <Frown className="w-16 h-16 text-muted-foreground/50" />
                <p>لا توجد إعلانات في هذا القسم.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map(ad => (
                <div key={ad.id} className="flex flex-col gap-2">
                    <JobCard job={ad} />
                    <Button variant="destructive" className="flex-1" onClick={() => onAdDelete(ad.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف
                    </Button>
                </div>
            ))}
        </div>
    )
}

function UserAdGrid({ ads, onAdDelete }: { ads: Job[], onAdDelete: (adId: string) => void }) {
    if (ads.length === 0) {
        return (
             <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
                <Frown className="w-16 h-16 text-muted-foreground/50" />
                <p>لم تقم بنشر أي إعلانات بعد.</p>
                <Button asChild>
                    <Link href="/post-job/select-type">نشر إعلان جديد</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map(ad => (
                <div key={ad.id} className="flex flex-col gap-2">
                    <JobCard job={ad} />
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                            <Link href={`/edit-job/${ad.id}`}>
                                <FileSignature className="mr-2 h-4 w-4" />
                                تعديل
                            </Link>
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={() => onAdDelete(ad.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}


function CompetitionGrid({ competitions, onAdDelete }: { competitions: Competition[], onAdDelete: (adId: string) => void }) {
    if (competitions.length === 0) {
        return (
             <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
                <Frown className="w-16 h-16 text-muted-foreground/50" />
                <p>لا توجد مباريات في هذا القسم.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {competitions.map(comp => (
                <div key={comp.id} className="flex flex-col gap-2">
                    <CompetitionCard competition={comp} />
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                            <Link href={`/edit-competition/${comp.id}`}>
                                <FileSignature className="mr-2 h-4 w-4" />
                                تعديل
                            </Link>
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={() => onAdDelete(comp.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function MyAdsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData, loading: authLoading } = useAuth();
  
  const [allAds, setAllAds] = useState<Job[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  
  const [adsLoading, setAdsLoading] = useState(true);
  const [adToDelete, setAdToDelete] = useState<{ id: string, type: 'ad' | 'competition' } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !authLoading) {
        const fetchAds = async () => {
            setAdsLoading(true);
            try {
                if (userData?.isAdmin) {
                    const [jobs, comps] = await Promise.all([
                        getJobs(),
                        getCompetitions()
                    ]);
                    setAllAds(jobs);
                    setCompetitions(comps);
                } else {
                    const userJobs = await getJobsByUserId(user.uid);
                    setAllAds(userJobs);
                }
            } catch (error) {
                console.error("Failed to fetch ads:", error);
                toast({ variant: 'destructive', title: 'فشل تحميل الإعلانات' });
            } finally {
                setAdsLoading(false);
            }
        };
        fetchAds();
    }
  }, [user, userData, authLoading, toast]);


  const handleDelete = async () => {
    if (!adToDelete) return;
    try {
        if(adToDelete.type === 'ad') {
            await deleteAd(adToDelete.id);
            setAllAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete.id));
        } else {
            await deleteCompetition(adToDelete.id);
            setCompetitions(prevComps => prevComps.filter(comp => comp.id !== adToDelete.id));
        }
        toast({ title: "تم حذف الإعلان بنجاح" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'فشل حذف الإعلان' });
    } finally {
        setAdToDelete(null);
    }
  };

  const { jobOffers, jobRequests, myPersonalAds } = useMemo(() => {
    const jobOffers = allAds.filter(ad => ad.postType === 'seeking_worker');
    const jobRequests = allAds.filter(ad => ad.postType === 'seeking_job');
    const myPersonalAds = userData?.isAdmin ? [] : allAds;
    return { jobOffers, jobRequests, myPersonalAds };
  }, [allAds, userData?.isAdmin]);
  
  const handleDeleteTrigger = (id: string, type: 'ad' | 'competition') => {
      setAdToDelete({ id, type });
  };


  const renderContent = () => {
    if (authLoading || adsLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if(userData?.isAdmin) {
        return (
            <Tabs defaultValue="offers" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="offers">الوظائف ({jobOffers.length})</TabsTrigger>
                    <TabsTrigger value="competitions">المباريات ({competitions.length})</TabsTrigger>
                    <TabsTrigger value="requests">الباحثون ({jobRequests.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="offers">
                    <AdGrid ads={jobOffers} onAdDelete={(id) => handleDeleteTrigger(id, 'ad')} />
                </TabsContent>
                <TabsContent value="competitions">
                    <CompetitionGrid competitions={competitions} onAdDelete={(id) => handleDeleteTrigger(id, 'competition')} />
                </TabsContent>
                <TabsContent value="requests">
                    <AdGrid ads={jobRequests} onAdDelete={(id) => handleDeleteTrigger(id, 'ad')} />
                </TabsContent>
            </Tabs>
        )
    }

    return <UserAdGrid ads={myPersonalAds} onAdDelete={(id) => handleDeleteTrigger(id, 'ad')} />;
  }

  return (
    <AppLayout>
      <MobilePageHeader title="إعلاناتي">
        <FileText className="h-5 w-5 text-primary" />
      </MobilePageHeader>
       <DesktopPageHeader
        icon={FileText}
        title={userData?.isAdmin ? "لوحة تحكم الإعلانات" : "إعلاناتي"}
        description={userData?.isAdmin ? "إدارة جميع الإعلانات والمباريات المنشورة في المنصة." : "هنا يمكنك إدارة جميع إعلاناتك، تعديلها، أو حذفها."}
      />
      <div className="flex-grow">
          <div className="container mx-auto max-w-7xl px-4 pb-8">
            <Card>
                <CardContent className="pt-6">
                    {renderContent()}
                </CardContent>
              </Card>
          </div>
      </div>
      <AlertDialog open={!!adToDelete} onOpenChange={(open) => !open && setAdToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء سيقوم بحذف الإعلان بشكل نهائي. لا يمكن التراجع عن هذا القرار.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdToDelete(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">تأكيد الحذف</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
