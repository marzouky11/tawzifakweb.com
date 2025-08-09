
'use client';

import { useMemo, useState } from 'react';
import type { Job } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { JobCard } from '@/components/job-card';


interface UserAdsClientProps {
    initialJobs: Job[];
}

export function UserAdsClient({ initialJobs }: UserAdsClientProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'seeking_worker' | 'seeking_job'>('all');

    const filteredJobs = useMemo(() => {
        if (activeTab === 'all') {
            return initialJobs;
        }
        return initialJobs.filter(job => job.postType === activeTab);
    }, [initialJobs, activeTab]);

    return (
        <>
            <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full sm:w-auto sm:mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="seeking_worker">عروض العمل</TabsTrigger>
                    <TabsTrigger value="seeking_job">طلبات العمل</TabsTrigger>
                </TabsList>
            </Tabs>

            {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[30vh] p-8">
                        <p className="text-lg">لا توجد إعلانات من هذا النوع حاليًا.</p>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
