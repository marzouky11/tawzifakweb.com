
'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Newspaper } from 'lucide-react';
import { getArticles } from '@/lib/articles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ManageArticlesPage() {
    const articles = getArticles();
    const { toast } = useToast();

    const handleDelete = (slug: string) => {
        // This is a placeholder. Deleting static articles requires file system access,
        // which is not possible from the client-side in this architecture.
        // A more robust solution would involve a backend API or a CMS.
        toast({
            variant: "destructive",
            title: "الحذف غير ممكن حاليًا",
            description: "لا يمكن حذف المقالات الثابتة من لوحة التحكم هذه.",
        });
    };

    return (
        <AppLayout>
            <DesktopPageHeader
                icon={Newspaper}
                title="إدارة المقالات"
                description="مراجعة وحذف المقالات الموجودة في المنصة."
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {articles.map(article => (
                                <div key={article.slug} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Link href={`/articles/${article.slug}`} className="font-semibold hover:underline">{article.title}</Link>
                                        <p className="text-sm text-muted-foreground">{article.author} - {article.date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(article.slug)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
