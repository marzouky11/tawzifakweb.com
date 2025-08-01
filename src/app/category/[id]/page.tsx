

import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { getJobs, getCategoryById } from '@/lib/data';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from '@/components/icons';
import { CategoryPageClient } from './category-page-client';
import type { Job } from '@/lib/types';

interface CategoryPageProps {
  params: { id: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryById(params.id);
  
  if (!category) {
    notFound();
  }
  
  // Fetch all jobs for the given category, without any other filters.
  const initialJobs: Job[] = await getJobs({ categoryId: params.id });

  return (
    <AppLayout>
      <MobilePageHeader title={category.name}>
        <CategoryIcon name={category.iconName} className="h-5 w-5" style={{ color: category.color }} />
      </MobilePageHeader>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="mb-8 hidden md:block" style={{ borderColor: category.color, borderTopWidth: '4px' }}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${category.color}1A`}}>
                <CategoryIcon name={category.iconName} className="h-8 w-8" style={{ color: category.color }} />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold" style={{ color: category.color }}>
                  {category.name}
                </CardTitle>
                 <p className="text-muted-foreground mt-1">
                  تصفح أحدث الإعلانات المتعلقة بهذه الفئة
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <CategoryPageClient initialJobs={initialJobs} category={category} />

      </div>
    </AppLayout>
  );
};
