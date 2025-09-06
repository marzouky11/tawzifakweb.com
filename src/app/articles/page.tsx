import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { getArticles as getDbArticles } from '@/lib/data';
import { getArticles as getStaticArticles } from '@/lib/articles';
import { Newspaper } from 'lucide-react';
import { ArticleCard } from './article-card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'مقالات ونصائح للعمل والتوظيف في الوطن العربي – تحسين فرصك الآن',
    description: 'نصائح للتوظيف، كتابة السيرة الذاتية، العمل عن بعد، وفرص الربح من الإنترنت. محتوى موجه للعرب الباحثين عن الاستقرار المهني أو الحرية المالية.',
    robots: 'index, follow',
};


function ArticlesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-80 w-full rounded-lg" />
      ))}
    </div>
  );
}

async function AllArticles() {
    const staticArticles = getStaticArticles();
    const dbArticles = await getDbArticles();

    const allArticles = [...staticArticles, ...dbArticles].sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.toMillis() : new Date(a.date).getTime();
        const dateB = b.createdAt ? b.createdAt.toMillis() : new Date(b.date).getTime();
        return dateB - dateA;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
    )
}

export default function ArticlesPage() {

  return (
    <>
      <MobilePageHeader title="مقالات">
        <Newspaper className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      
      <DesktopPageHeader
        icon={Newspaper}
        title="مقالات لنموك المهني"
        description="نقدم لك مجموعة من المقالات المختارة بعناية لمساعدتك على تطوير مهاراتك، والنجاح في مسيرتك المهنية، ومواكبة آخر تطورات سوق العمل."
      />
        
      <div className="container mx-auto max-w-7xl px-4 pb-8">
        <Suspense fallback={<ArticlesListSkeleton />}>
            <AllArticles />
        </Suspense>
      </div>
    </>
  );
}
