
'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import { MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { getTestimonials, deleteTestimonial } from '@/lib/data';
import type { Testimonial } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserAvatar } from '@/components/user-avatar';
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

export default function ManageTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchTestimonials = async () => {
            setLoading(true);
            const data = await getTestimonials();
            setTestimonials(data);
            setLoading(false);
        };
        fetchTestimonials();
    }, []);

    const handleDelete = async () => {
        if (!testimonialToDelete) return;

        try {
            await deleteTestimonial(testimonialToDelete);
            setTestimonials(prev => prev.filter(t => t.id !== testimonialToDelete));
            toast({ title: "تم حذف الرأي بنجاح." });
        } catch (error) {
            toast({ variant: 'destructive', title: 'فشل حذف الرأي.' });
        } finally {
            setTestimonialToDelete(null);
        }
    };

    return (
        <AppLayout>
            <DesktopPageHeader
                icon={MessageSquare}
                title="إدارة الآراء"
                description="مراجعة وحذف آراء المستخدمين."
            />
            <div className="container mx-auto max-w-4xl px-4 pb-8">
                <Card>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {testimonials.map(testimonial => (
                                    <div key={testimonial.id} className="flex items-start justify-between p-4 border rounded-lg gap-4">
                                        <div className="flex items-start gap-4">
                                            <UserAvatar name={testimonial.userName} color={testimonial.userAvatarColor} />
                                            <div>
                                                <p className="font-semibold">{testimonial.userName}</p>
                                                <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{testimonial.postedAt}</p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="icon" onClick={() => setTestimonialToDelete(testimonial.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!testimonialToDelete} onOpenChange={(open) => !open && setTestimonialToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                    <AlertDialogDescription>
                        هذا الإجراء سيقوم بحذف هذا الرأي بشكل نهائي. لا يمكن التراجع عن هذا القرار.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>تأكيد الحذف</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
