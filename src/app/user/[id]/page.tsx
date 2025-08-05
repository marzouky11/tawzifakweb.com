

'use client';

import { useEffect, useMemo, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { getUserById, getJobsByUserId } from '@/lib/data';
import { JobCard } from '@/components/job-card';
import { UserAvatar } from '@/components/user-avatar';
import type { Job, User } from '@/lib/types';
import { Loader2, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';

export default function UserAdsPage() {
    const params = useParams<{ id: string }>();
    const userId = params.id;

    const [user, setUser] = useState<User | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'seeking_worker' | 'seeking_job'>('all');

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                setLoading(true);
                const [userData, userJobs] = await Promise.all([
                    getUserById(userId),
                    getJobsByUserId(userId),
                ]);

                if (!userData) {
                    notFound();
                    return;
                }
                
                setUser(userData);
                setJobs(userJobs);
                setLoading(false);
            };
            fetchData();
        }
    }, [userId]);
    
    const filteredJobs = useMemo(() => {
        if (activeTab === 'all') {
          return jobs;
        }
        return jobs.filter(job => job.postType === activeTab);
    }, [jobs, activeTab]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }
    
    if (!user) {
        notFound();
    }

    return (
        <AppLayout>
            <MobilePageHeader title={`إعلانات ${user.name}`}>
                <UserIcon className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <DesktopPageHeader
                icon={UserIcon}
                title={`إعلانات ${user.name}`}
                description={`تصفح جميع الإعلانات التي قام بنشرها ${user.name}.`}
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <UserAvatar name={user.name} color={user.avatarColor} className="h-20 w-20 text-3xl" />
                            <div>
                                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                                {user.description && <p className="text-muted-foreground mt-1">{user.description}</p>}
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                
                <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full sm:w-auto sm:mx-auto">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">الكل</TabsTrigger>
                        <TabsTrigger value="seeking_worker">عروض العمل</TabsTrigger>
                        <TabsTrigger value="seeking_job">طلبات العمل</TabsTrigger>
                    </TabsList>
                </Tabs>

                {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </div>
        </AppLayout>
    );
}

