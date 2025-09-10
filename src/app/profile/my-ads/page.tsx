
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
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
import {
  Loader2,
  Trash2,
  FileText,
  Frown,
  FileSignature,
} from "lucide-react";
import {
  getJobsByUserId,
  deleteAd,
  getJobs,
  getCompetitions,
  deleteCompetition,
  getImmigrationPosts,
  deleteImmigrationPost,
} from "@/lib/data";
import type { Job, Competition, ImmigrationPost } from "@/lib/types";
import { JobCard } from "@/components/job-card";
import { CompetitionCard } from "@/components/competition-card";
import { ImmigrationCard } from "@/components/immigration-card";
import { useToast } from "@/hooks/use-toast";
import { MobilePageHeader } from "@/components/layout/mobile-page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DesktopPageHeader } from "@/components/layout/desktop-page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function AdGrid({
  ads,
  onAdDelete,
  showEditButton = false,
}: {
  ads: Job[];
  onAdDelete: (adId: string) => void;
  showEditButton?: boolean;
}) {
  if (ads.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
        <Frown className="w-16 h-16 text-muted-foreground/50" />
        <p>لا توجد إعلانات في هذا القسم.</p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {ads.map((ad) => (
        <Card key={ad.id} className="flex flex-col">
          <div className="flex-grow">
            <JobCard job={ad} />
          </div>
          <CardFooter className="p-4 flex gap-2">
            {showEditButton && (
              <Button
                asChild
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Link href={`/edit-job/${ad.id}`}>
                  <FileSignature className="h-4 w-4" />
                  <span>تعديل</span>
                </Link>
              </Button>
            )}
            <Button
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              onClick={() => onAdDelete(ad.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span>حذف</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function ImmigrationGrid({
  posts,
  onAdDelete,
}: {
  posts: ImmigrationPost[];
  onAdDelete: (postId: string) => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
        <Frown className="w-16 h-16 text-muted-foreground/50" />
        <p>لا توجد إعلانات هجرة في هذا القسم.</p>
      </div>
    );
  }
  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {posts.map((post) => (
         <Card key={post.id} className="flex flex-col">
          <div className="flex-grow">
            <ImmigrationCard post={post} />
          </div>
          <CardFooter className="p-4 flex gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Link href={`/edit-immigration/${post.id}`}>
                <FileSignature className="h-4 w-4" />
                <span>تعديل</span>
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              onClick={() => onAdDelete(post.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span>حذف</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function CompetitionGrid({
  competitions,
  onAdDelete,
}: {
  competitions: Competition[];
  onAdDelete: (adId: string) => void;
}) {
  if (competitions.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
        <Frown className="w-16 h-16 text-muted-foreground/50" />
        <p>لا توجد مباريات في هذا القسم.</p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {competitions.map((comp) => (
         <Card key={comp.id} className="flex flex-col">
          <div className="flex-grow">
            <CompetitionCard competition={comp} />
          </div>
          <CardFooter className="p-4 flex gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Link href={`/edit-competition/${comp.id}`}>
                <FileSignature className="h-4 w-4" />
                <span>تعديل</span>
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              onClick={() => onAdDelete(comp.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span>حذف</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function MyAdsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData, loading: authLoading } = useAuth();

  const [allAds, setAllAds] = useState<Job[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [immigrationPosts, setImmigrationPosts] = useState<ImmigrationPost[]>(
    []
  );

  const [adsLoading, setAdsLoading] = useState(true);
  const [adToDelete, setAdToDelete] = useState<{
    id: string;
    type: "ad" | "competition" | "immigration";
  } | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !authLoading) {
      const fetchAds = async () => {
        setAdsLoading(true);
        try {
          if (userData?.isAdmin) {
            const [jobs, comps, immigrations] = await Promise.all([
              getJobs(),
              getCompetitions(),
              getImmigrationPosts(),
            ]);
            setAllAds(jobs);
            setCompetitions(comps);
            setImmigrationPosts(immigrations);
          } else {
            const userJobs = await getJobsByUserId(user.uid);
            setAllAds(userJobs);
          }
        } catch (error) {
          console.error("Failed to fetch ads:", error);
          toast({ variant: "destructive", title: "فشل تحميل الإعلانات" });
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
      if (adToDelete.type === "ad") {
        await deleteAd(adToDelete.id);
        setAllAds((prevAds) =>
          prevAds.filter((ad) => ad.id !== adToDelete.id)
        );
      } else if (adToDelete.type === "competition") {
        await deleteCompetition(adToDelete.id);
        setCompetitions((prevComps) =>
          prevComps.filter((comp) => comp.id !== adToDelete.id)
        );
      } else if (adToDelete.type === "immigration") {
        await deleteImmigrationPost(adToDelete.id);
        setImmigrationPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== adToDelete.id)
        );
      }
      toast({ title: "تم حذف الإعلان بنجاح" });
    } catch (error) {
      toast({ variant: "destructive", title: "فشل حذف الإعلان" });
    } finally {
      setAdToDelete(null);
    }
  };

  const { jobOffers, jobRequests } = useMemo(() => {
    const jobOffers = allAds.filter((ad) => ad.postType === "seeking_worker");
    const jobRequests = allAds.filter((ad) => ad.postType === "seeking_job");
    return { jobOffers, jobRequests };
  }, [allAds]);

  const handleDeleteTrigger = (
    id: string,
    type: "ad" | "competition" | "immigration"
  ) => {
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

    if (userData?.isAdmin) {
      return (
        <Tabs defaultValue="jobs" className="w-full">
          {/* ✅ Tabs بخلفية وحواف */}
          <TabsList
            dir="rtl"
            className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-6 h-auto"
          >
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:bg-primary data-[state=active]:text-white 
                         p-3 w-full justify-center border rounded-md bg-gray-50 hover:bg-gray-100"
            >
              وظائف ({jobOffers.length})
            </TabsTrigger>
            <TabsTrigger
              value="migration"
              className="data-[state=active]:bg-primary data-[state=active]:text-white 
                         p-3 w-full justify-center border rounded-md bg-gray-50 hover:bg-gray-100"
            >
              فرص الهجرة ({immigrationPosts.length})
            </TabsTrigger>
            <TabsTrigger
              value="competitions"
              className="data-[state=active]:bg-primary data-[state=active]:text-white 
                         p-3 w-full justify-center border rounded-md bg-gray-50 hover:bg-gray-100"
            >
              مباريات عمومية ({competitions.length})
            </TabsTrigger>
            <TabsTrigger
              value="seekers"
              className="data-[state=active]:bg-primary data-[state=active]:text-white 
                         p-3 w-full justify-center border rounded-md bg-gray-50 hover:bg-gray-100"
            >
              باحثون عن عمل ({jobRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <AdGrid
              ads={jobOffers}
              onAdDelete={(id) => handleDeleteTrigger(id, "ad")}
              showEditButton={true}
            />
          </TabsContent>
          <TabsContent value="migration">
            <ImmigrationGrid
              posts={immigrationPosts}
              onAdDelete={(id) => handleDeleteTrigger(id, "immigration")}
            />
          </TabsContent>
          <TabsContent value="competitions">
            <CompetitionGrid
              competitions={competitions}
              onAdDelete={(id) => handleDeleteTrigger(id, "competition")}
            />
          </TabsContent>
          <TabsContent value="seekers">
            <AdGrid
              ads={jobRequests}
              onAdDelete={(id) => handleDeleteTrigger(id, "ad")}
              showEditButton={false}
            />
          </TabsContent>
        </Tabs>
      );
    }

    return (
      <AdGrid
        ads={allAds}
        onAdDelete={(id) => handleDeleteTrigger(id, "ad")}
        showEditButton={true}
      />
    );
  };

  return (
    <>
      <MobilePageHeader title="إعلاناتي">
        <FileText className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={FileText}
        title={userData?.isAdmin ? "لوحة تحكم الإعلانات" : "إعلاناتي"}
        description={
          userData?.isAdmin
            ? "إدارة جميع الإعلانات والمباريات المنشورة في المنصة."
            : "هنا يمكنك إدارة جميع إعلاناتك، تعديلها، أو حذفها."
        }
      />
      <div className="flex-grow pt-4">
        <div className="container mx-auto max-w-7xl px-4 pb-8">
          <Card>
            <CardContent className="pt-6">{renderContent()}</CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog
        open={!!adToDelete}
        onOpenChange={(open) => !open && setAdToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء سيقوم بحذف الإعلان بشكل نهائي. لا يمكن التراجع عن
              هذا القرار.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdToDelete(null)}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
