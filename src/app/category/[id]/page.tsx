
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { getJobs, getCategoryById } from '@/lib/data';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CategoryIcon } from '@/components/icons';
import type { Job } from '@/lib/types';
import { JobCard } from '@/components/job-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CategoryPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

function JobsList({ jobs, categoryName }: { jobs: Job[]; categoryName: string }) {
  if (jobs.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[40vh] p-8">
        <h2 className="text-xl font-semibold text-foreground">لا توجد إعلانات في هذا القسم حاليًا</h2>
        <p>كن أول من ينشر إعلانًا في فئة "{categoryName}"!</p>
      </CardContent>
    </Card>
  );
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = getCategoryById(params.id);
  
  if (!category) {
    notFound();
  }
  
  const allJobs: Job[] = await getJobs({ categoryId: params.id });
  const seekingWorkerJobs = allJobs.filter(job => job.postType === 'seeking_worker');
  const seekingJobJobs = allJobs.filter(job => job.postType === 'seeking_job');

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

        <Tabs defaultValue="all" className="w-full">
            <div className="mb-6 flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="seeking_worker">عروض العمل</TabsTrigger>
                    <TabsTrigger value="seeking_job">باحثون عن عمل</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="all">
                <JobsList jobs={allJobs} categoryName={category.name} />
            </TabsContent>
            <TabsContent value="seeking_worker">
                <JobsList jobs={seekingWorkerJobs} categoryName={category.name} />
            </TabsContent>
            <TabsContent value="seeking_job">
                <JobsList jobs={seekingJobJobs} categoryName={category.name} />
            </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};
