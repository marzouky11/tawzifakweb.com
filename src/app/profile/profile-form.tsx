
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import type { User, Category } from '@/lib/types';
import { updateUserProfile } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'الاسم مطلوب.' }),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
});

interface ProfileFormProps {
  categories: Category[];
  user: User;
}

export function ProfileForm({ categories, user }: ProfileFormProps) {
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      categoryId: user?.categoryId || '',
      description: user?.description || '',
      country: user?.country || '',
      city: user?.city || '',
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || '',
      instagram: user?.instagram || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!authUser) return;

    setIsSubmitting(true);
    try {
        await updateUserProfile(authUser.uid, values);
        toast({
            title: "تم تحديث الملف الشخصي",
            description: "تم حفظ معلوماتك بنجاح.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "خطأ",
            description: "فشل تحديث الملف الشخصي.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
                <FormLabel>الاسم</FormLabel>
                <FormControl><Input placeholder="اسمك الكامل" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <FormField control={form.control} name="categoryId" render={({ field }) => (
          <FormItem>
            <FormLabel>فئة العمل</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر فئة عملك الرئيسية" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
                <FormLabel>نبذة تعريفية</FormLabel>
                <FormControl><Textarea placeholder="اكتب وصفاً قصيراً عنك أو عن مهاراتك..." {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem><FormLabel>الدولة</FormLabel><FormControl><Input placeholder="الدولة التي تقيم بها" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem><FormLabel>المدينة</FormLabel><FormControl><Input placeholder="المدينة التي تقيم بها" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="whatsapp" render={({ field }) => (
            <FormItem><FormLabel>رقم واتساب</FormLabel><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="instagram" render={({ field }) => (
            <FormItem>
                <FormLabel>حساب إنستغرام (اختياري)</FormLabel>
                <FormControl><Input placeholder="username" {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            حفظ التغييرات
        </Button>
      </form>
    </Form>
  );
}
