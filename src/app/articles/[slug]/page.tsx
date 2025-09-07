import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleBySlug as getDbArticleBySlug, getArticles as getDbArticles } from '@/lib/data';
import { getArticleBySlug as getStaticArticleBySlug, getArticles as getStaticArticles } from '@/lib/articles';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { User, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';
import { ArticleCard } from '../article-card';
import { Separator } from '@/components/ui/separator';
import type { Article } from '@/lib/types';

interface Props {
  params: { slug: string };
}

async function getArticle(slug: string): Promise<Article | null> {
  let article = await getDbArticleBySlug(slug);
  if (!article) {
    article = getStaticArticleBySlug(slug) || null;
  }
  return article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/MH0BfvFB/og-image.jpg';

  if (!article) {
    return {
      title: 'المقال غير موجود',
      description: 'لم نتمكن من العثور على المقال الذي تبحث عنه.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }

  const articleDate = article.createdAt
    ? article.createdAt.toDate()
    : article.date
      ? new Date(article.date)
      : new Date();

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [{ url: article.imageUrl }],
      url: `${baseUrl}/articles/${article.slug}`,
      siteName: 'توظيفك',
      type: 'article',
      publishedTime: articleDate.toISOString(),
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const staticArticles = getStaticArticles();
  const dbArticles = await getDbArticles();
  const allArticles = [...staticArticles, ...dbArticles];

  const relatedArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const contentBlocks = article.content.split('\n');

  // تحويل أي رابط موجود في النص إلى رابط قابل للنقر
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, idx) => {
      if (part.match(urlRegex)) {
        return <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{part}</a>;
      }
      return part;
    });
  };

  const renderContent = () => {
    return contentBlocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return <br key={i} />; // سطر فارغ يظهر فقط إذا تركت فراغ
      if (trimmed.startsWith('### ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-green-600">{trimmed.replace('### ', '')}</h2>;
      if (trimmed.startsWith('#### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-3 text-gray-800 dark:text-gray-200">{trimmed.replace('#### ', '')}</h3>;
      if (trimmed.startsWith('- ')) return <li key={i} className="list-disc list-inside">{trimmed.replace('- ', '')}</li>; // النقاط بمسافة طبيعية
      return <p key={i} className="mb-4">{linkify(trimmed)}</p>;
    });
  };

  return (
    <>
      <MobilePageHeader title="مقالات"><Newspaper className="h-5 w-5 text-primary" /></MobilePageHeader>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <article>
          <Card>
            <CardContent className="p-4 md:p-8">
              <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-red-600 dark:text-red-500 mb-4">{article.title}</h1>
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{article.author}</span></div>
                </div>
              </header>

              <div className="relative h-64 md:h-80 w-full mb-8 rounded-lg overflow-hidden">
                <Image src={article.imageUrl} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" priority />
              </div>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ul className="list-none">{renderContent()}</ul>
              </div>
            </CardContent>
          </Card>
        </article>

        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <Separator className="my-8" />
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">مقالات قد تعجبك أيضاً</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const { getArticles: getStaticArticles } = await import('@/lib/articles');
  const { getArticles: getDbArticles } = await import('@/lib/data');

  const staticArticles = getStaticArticles();
  const dbArticles = await getDbArticles();
  const allArticles = [...staticArticles, ...dbArticles];

  return allArticles.map(a => ({ slug: a.slug }));
    }
