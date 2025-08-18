
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Users, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from '@/components/user-avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { getAllUsers, deleteUser } from '@/lib/data';
import type { User as AppUser } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

function formatFirestoreTimestamp(timestamp: any) {
    if (!timestamp || !timestamp.toDate) {
        return 'N/A';
    }
    return timestamp.toDate().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function AdminUsersPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!authLoading && !userData?.isAdmin) {
      router.push('/');
    }
  }, [userData, authLoading, router]);

  useEffect(() => {
    if (userData?.isAdmin) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const allUsers = await getAllUsers();
          setUsers(allUsers);
        } catch (error) {
          toast({ variant: 'destructive', title: 'فشل تحميل المستخدمين' });
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [userData, toast]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
        await deleteUser(userToDelete.id);
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        toast({ title: "تم حذف المستخدم بنجاح" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'فشل حذف المستخدم' });
    } finally {
        setUserToDelete(null);
    }
  }

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MobilePageHeader title="إدارة المستخدمين">
        <Users className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Users}
        title="إدارة المستخدمين"
        description="عرض وحذف المستخدمين المسجلين في المنصة."
      />
      <div className="container mx-auto max-w-7xl px-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                    <TableHead className="text-center">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.name} color={user.avatarColor} />
                            <div>
                                <span className="font-medium">{user.name}</span>
                                {user.isAdmin && <Badge variant="destructive" className="mr-2">مشرف</Badge>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatFirestoreTimestamp(user.createdAt)}</TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setUserToDelete(user)}
                            disabled={user.isAdmin}
                            title={user.isAdmin ? "لا يمكن حذف حساب مشرف" : "حذف المستخدم"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        لا يوجد مستخدمون لعرضهم.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

       <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف المستخدم؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء سيقوم بحذف حساب المستخدم ({userToDelete?.name}) من قاعدة البيانات. لا يمكن التراجع عن هذا القرار.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">تأكيد الحذف</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
