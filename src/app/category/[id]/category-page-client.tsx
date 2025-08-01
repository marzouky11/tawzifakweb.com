
'use client';

import { useMemo, useState } from 'react';
import { JobCard } from '@/components/job-card';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryIcon } from '@/components/icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Job, Category } from '@/lib/types';

interface CategoryPageClientProps {
    initialJobs: Job[];
    category: Category;
}

export function CategoryPageClient({ initialJobs, category }: CategoryPageClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'seeking_worker' | 'seeking_job'>('all');

  const filteredJobs = useMemo(() => {
    if (activeTab === 'all') {
      return initialJobs;
    }
    return initialJobs.filter(job => job.postType === activeTab);
  }, [initialJobs, activeTab]);

  return (
    <>
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full sm:w-auto sm:mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="seeking_worker">عروض العمل</TabsTrigger>
            <TabsTrigger value="seeking_job">باحثون عن عمل</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[40vh] p-8">
            <CategoryIcon name={category.iconName} className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground">لا توجد إعلانات في هذا القسم حاليًا</h2>
            <p>كن أول من ينشر إعلانًا في فئة "{category.name}"!</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
