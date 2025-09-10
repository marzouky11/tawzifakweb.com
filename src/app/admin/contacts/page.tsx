
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Mail, Trash2 } from 'lucide-react';
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
import { getContactMessages, deleteContactMessage } from '@/lib/data';
import type { ContactMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export default function AdminContactsPage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (!authLoading && !userData?.isAdmin) {
      router.push('/');
    }
  }, [userData, authLoading, router]);

  useEffect(() => {
    if (userData?.isAdmin) {
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const allMessages = await getContactMessages();
          setMessages(allMessages);
        } catch (error) {
          toast({ variant: 'destructive', title: 'فشل تحميل الرسائل' });
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [userData, toast]);

  const handleDelete = async () => {
    if (!messageToDelete) return;
    try {
        await deleteContactMessage(messageToDelete.id);
        setMessages(prev => prev.filter(m => m.id !== messageToDelete.id));
        toast({ title: "تم حذف الرسالة بنجاح" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'فشل حذف الرسالة' });
    } finally {
        setMessageToDelete(null);
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'غير معروف';
    return format(timestamp.toDate(), 'yyyy/MM/dd, h:mm a');
  };

  if (authLoading || loading) {
    return (
        <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <MobilePageHeader title="رسائل التواصل">
        <Mail className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Mail}
        title="رسائل التواصل"
        description="عرض وحذف الرسائل الواردة من صفحة اتصل بنا."
      />
      <div className="container mx-auto max-w-4xl px-4 pb-8 space-y-8">
        {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div>
                                <CardTitle>{message.name}</CardTitle>
                                <CardDescription className="text-primary hover:underline pt-1">
                                    <a href={`mailto:${message.email}`}>{message.email}</a>
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="shrink-0">{formatDate(message.createdAt)}</Badge>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                        <p className="whitespace-pre-wrap">{message.message}</p>
                    </CardContent>
                </Card>
                 <Button
                    variant="destructive"
                    className="w-full active:scale-95 transition-transform"
                    onClick={() => setMessageToDelete(message)}
                >
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف الرسالة
                </Button>
              </div>
            ))
        ) : (
             <div className="text-center text-muted-foreground py-10">
                <p>لا توجد رسائل لعرضها.</p>
            </div>
        )}
      </div>

       <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الرسالة؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء سيقوم بحذف الرسالة بشكل نهائي. لا يمكن التراجع عن هذا القرار.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMessageToDelete(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">تأكيد الحذف</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
