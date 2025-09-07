
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Newspaper, Trash2, Edit } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { getArticles, deleteArticle } from '@/lib/data';
import type { Article } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminArticlesPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  useEffect(() => {
    if (!authLoading && !userData?.isAdmin) {
      router.push('/');
    }
  }, [userData, authLoading, router]);

  useEffect(() => {
    if (userData?.isAdmin) {
      const fetchArticles = async () => {
        setLoading(true);
        try {
          const dbArticles = await getArticles();
          setArticles(dbArticles);
        } catch (error) {
          toast({ variant: 'destructive', title: 'فشل تحميل المقالات' });
        } finally {
          setLoading(false);
        }
      };
      fetchArticles();
    }
  }, [userData, toast]);

  const handleDelete = async () => {
    if (!articleToDelete) return;
    try {
      await deleteArticle(articleToDelete.id);
      setArticles(prev => prev.filter(a => a.id !== articleToDelete.id));
      toast({ title: "تم حذف المقال بنجاح" });
    } catch (error) {
      toast({ variant: 'destructive', title: 'فشل حذف المقال' });
    } finally {
      setArticleToDelete(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <MobilePageHeader title="إدارة المقالات">
        <Newspaper className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Newspaper}
        title="إدارة المقالات"
        description="مراجعة وتعديل وحذف المقالات المنشورة في قاعدة البيانات."
      />
      <div className="container mx-auto max-w-7xl px-4 pb-8 space-y-4">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col">
                <div className="relative h-40 w-full">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2 leading-snug">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.summary}
                  </p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                        <Link href={`/admin/post-article?id=${article.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل
                        </Link>
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => setArticleToDelete(article)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>لا توجد مقالات منشورة في قاعدة البيانات بعد.</p>
             <Button asChild className="mt-4">
                <Link href="/admin/post-article">
                    <Newspaper className="mr-2 h-4 w-4" />
                    نشر مقال جديد
                </Link>
             </Button>
          </div>
        )}
      </div>

      <AlertDialog open={!!articleToDelete} onOpenChange={(open) => !open && setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المقال؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المقال "{articleToDelete?.title}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setArticleToDelete(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">تأكيد الحذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
