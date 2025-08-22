
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { postImmigration, updateImmigrationPost } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Loader2, Plane, FileText, Globe, MapPin, Users, Calendar, Award, Wallet, Link as LinkIcon, GraduationCap, ClipboardList, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ImmigrationPost } from '@/lib/types';
import { slugify } from '@/lib/utils';


const formSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل.'),
  slug: z.string().min(5, 'الرابط المختصر مطلوب.'),
  targetCountry: z.string().min(2, 'الدولة المستهدفة مطلوبة.'),
  city: z.string().optional(),
  programType: z.enum(['work', 'study', 'seasonal', 'training'], { required_error: "نوع البرنامج مطلوب." }),
  targetAudience: z.string().min(2, "الفئة المستهدفة مطلوبة."),
  deadline: z.string().min(1, "آخر أجل للتقديم مطلوب."),
  description: z.string().optional(),
  requirements: z.string().optional(),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  benefitsAndSalary: z.string().optional(),
  applyUrl: z.string().url('رابط التقديم يجب أن يكون رابطًا صحيحًا.'),
});

interface PostImmigrationFormProps {
  post?: ImmigrationPost | null;
}

export function PostImmigrationForm({ post }: PostImmigrationFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!post;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      targetCountry: post?.targetCountry || '',
      city: post?.city || '',
      programType: post?.programType || undefined,
      targetAudience: post?.targetAudience || '',
      deadline: post?.deadline || '',
      description: post?.description || '',
      requirements: post?.requirements || '',
      qualifications: post?.qualifications || '',
      experience: post?.experience || '',
      benefitsAndSalary: post?.benefitsAndSalary || '',
      applyUrl: post?.applyUrl || '',
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('title', e.target.value);
    if (!isEditing) { // Only auto-slug on create
      form.setValue('slug', slugify(e.target.value));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEditing && post) {
        await updateImmigrationPost(post.id, values);
        toast({ title: "تم تحديث الإعلان بنجاح!" });
        router.push(`/immigration/${post.id}`);
      } else {
        const { id } = await postImmigration(values);
        toast({ title: "تم نشر الإعلان بنجاح!" });
        form.reset();
        router.push(`/immigration/${id}`);
      }
    } catch (error) {
      console.error("Failed to process immigration post:", error);
      toast({
        variant: "destructive",
        title: "خطأ في العملية",
        description: `حدث خطأ غير متوقع.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const sectionColor = '#0ea5e9'; // sky-500

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>عنوان الفرصة</FormLabel>
            <FormControl><Input placeholder="مثال: مطلوب عمال موسميون في كندا" {...field} onChange={handleTitleChange} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
         <FormField control={form.control} name="slug" render={({ field }) => (
          <FormItem>
            <FormLabel>الرابط (Slug)</FormLabel>
            <FormControl><Input placeholder="سيتم إنشاؤه تلقائيا" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <FormField control={form.control} name="targetCountry" render={({ field }) => (
              <FormItem><FormLabel>الدولة المستهدفة</FormLabel><FormControl><Input placeholder="مثال: كندا" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem><FormLabel>المدينة (اختياري)</FormLabel><FormControl><Input placeholder="مثال: مونتريال" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="programType" render={({ field }) => (
                <FormItem><FormLabel>نوع البرنامج</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع البرنامج" /></SelectTrigger></FormControl><SelectContent><SelectItem value="work">عمل</SelectItem><SelectItem value="study">دراسة</SelectItem><SelectItem value="seasonal">موسمي</SelectItem><SelectItem value="training">تدريب</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="targetAudience" render={({ field }) => (
                <FormItem><FormLabel>الفئة المستهدفة</FormLabel><FormControl><Input placeholder="طلاب، عمال، مهنيين..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="deadline" render={({ field }) => (
                <FormItem><FormLabel>آخر أجل للتقديم</FormLabel><FormControl><Input placeholder="YYYY-MM-DD" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>وصف البرنامج (اختياري)</FormLabel><FormControl><Textarea placeholder="تفاصيل حول فرصة الهجرة..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="requirements" render={({ field }) => (<FormItem><FormLabel>الشروط العامة (اختياري)</FormLabel><FormControl><Textarea placeholder="شروط العمر، اللغة، الحالة الصحية..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="qualifications" render={({ field }) => (<FormItem><FormLabel>المؤهلات المطلوبة (اختياري)</FormLabel><FormControl><Textarea placeholder="الشهادات التعليمية المطلوبة..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabel>الخبرة المطلوبة (اختياري)</FormLabel><FormControl><Textarea placeholder="سنوات الخبرة أو نوعها..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="benefitsAndSalary" render={({ field }) => (<FormItem><FormLabel>المزايا والأجر (اختياري)</FormLabel><FormControl><Textarea placeholder="معلومات عن الراتب، السكن، التأمين..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="applyUrl" render={({ field }) => (<FormItem><FormLabel>رابط التقديم الرسمي</FormLabel><FormControl><Input type="url" placeholder="https://example.com/apply" {...field} /></FormControl><FormMessage /></FormItem>)} />

        <Button type="submit" size="lg" className="w-full text-primary-foreground" style={{backgroundColor: sectionColor}} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'تحديث الإعلان' : 'نشر الإعلان'}
        </Button>
      </form>
    </Form>
  );
}
