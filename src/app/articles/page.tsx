
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { getArticles } from '@/lib/articles';
import { Newspaper } from 'lucide-react';
import { ArticleCard } from './article-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'مقالات ونصائح للعمل والتوظيف في الوطن العربي – تحسين فرصك الآن',
    description: 'نصائح للتوظيف، كتابة السيرة الذاتية، العمل عن بعد، وفرص الربح من الإنترنت. محتوى موجه للعرب الباحثين عن الاستقرار المهني أو الحرية المالية.',
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <AppLayout>
      <MobilePageHeader title="مقالات">
        <Newspaper className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      
      <DesktopPageHeader
        icon={Newspaper}
        title="مقالات لنموك المهني"
        description="نقدم لك مجموعة من المقالات المختارة بعناية لمساعدتك على تطوير مهاراتك، والنجاح في مسيرتك المهنية، ومواكبة آخر تطورات سوق العمل."
      />
        
      <div className="container mx-auto max-w-5xl px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

