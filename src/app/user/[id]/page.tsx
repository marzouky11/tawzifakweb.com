

import { notFound } from 'next/navigation';
import { getUserById, getJobsByUserId } from '@/lib/data';
import { JobCard } from '@/components/job-card';
import { UserAvatar } from '@/components/user-avatar';
import type { Job, User } from '@/lib/types';
import { User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { UserAdsClient } from './user-ads-client';

interface UserAdsPageProps {
  params: { id: string };
}

export default async function UserAdsPage({ params }: UserAdsPageProps) {
    const userId = params.id;

    const [user, jobs] = await Promise.all([
        getUserById(userId),
        getJobsByUserId(userId),
    ]);

    if (!user) {
        notFound();
    }

    return (
        <>
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
                    <CardHeader className="flex flex-row items-center gap-4">
                        <UserAvatar name={user.name} color={user.avatarColor} className="h-20 w-20 text-3xl" />
                        <div>
                            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                            {user.description && <p className="text-muted-foreground mt-1">{user.description}</p>}
                        </div>
                    </CardHeader>
                </Card>
                
                <UserAdsClient initialJobs={jobs} />
            </div>
        </>
    );
}
