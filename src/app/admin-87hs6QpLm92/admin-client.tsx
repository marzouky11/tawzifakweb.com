
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Shield, Users, Newspaper, MessageSquare, ArrowLeft, PenSquare } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import Link from 'next/link';

const adminNavItems = [
    { href: '/admin-87hs6QpLm92/manage-ads', label: 'إدارة الإعلانات', icon: PenSquare },
    { href: '/admin-87hs6QpLm92/manage-articles', label: 'إدارة المقالات', icon: Newspaper },
    { href: '/admin-87hs6QpLm92/manage-testimonials', label: 'إدارة الآراء', icon: MessageSquare },
    { href: '/admin-87hs6QpLm92/manage-users', label: 'إدارة المستخدمين', icon: Users, disabled: true },
];

export default function AdminClientPage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login?redirect=/admin-87hs6QpLm92');
            } else if (!userData?.isAdmin) {
                router.push('/');
            }
        }
    }, [user, userData, loading, router]);
    
    if (loading || !userData?.isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <AppLayout>
            <DesktopPageHeader
                icon={Shield}
                title="لوحة تحكم المدير"
                description="إدارة محتوى وبيانات منصة توظيفك."
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminNavItems.map(item => (
                        <Link key={item.href} href={item.href} className={item.disabled ? "pointer-events-none" : ""}>
                            <Card className={`hover:shadow-lg transition-shadow h-full ${item.disabled ? "opacity-50 bg-muted/50" : "bg-card"}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg font-semibold">{item.label}</CardTitle>
                                    <item.icon className="h-6 w-6 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold flex items-center justify-end">
                                        <ArrowLeft className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardDescription>{item.disabled ? "قريباً" : "اضغط للانتقال"}</CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
