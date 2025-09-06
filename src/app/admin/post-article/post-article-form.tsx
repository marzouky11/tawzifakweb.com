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
import { addArticle, updateArticle } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, Image as ImageIcon, Info, AlignLeft } from 'lucide-react';
import type { Article } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل.'),
  imageUrl: z.string().url('الرجاء إدخال رابط صورة صحيح.'),
  imageHint: z.string().min(2, "تلميح الصورة مطلوب لوصفها."),
  content: z.string().min(50, 'المحتوى يجب أن يكون 50 حرفًا على الأقل.'),
});

const sectionColor = '#00897B';

const FormLabelIcon = ({icon: Icon, label}: {icon: React.ElementType, label: string}) => (
    <FormLabel className="flex items-center gap-2 text-base md:text-lg">
      <Icon className='h-4 w-4' style={{color: sectionColor}} />
      {label}
    </FormLabel>
);

interface PostArticleFormProps {
  article?: Article;
}

export function PostArticleForm({ article }: PostArticleFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!article;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article?.title || '',
      imageUrl: article?.imageUrl || '',
      imageHint: article?.imageHint || '',
      content: article?.content || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const articleData = {
        title: values.title,
        imageUrl: values.imageUrl,
        imageHint: values.imageHint,
        content: values.content,
        summary: values.content.substring(0, 150) + '...', // Auto-generate summary
      };

      if (isEditing && article) {
        await updateArticle(article.id, articleData);
        toast({ title: "تم تحديث المقال بنجاح!" });
        router.push(`/articles/${article.slug}`);
      } else {
        const { id } = await addArticle({ ...articleData, author: 'فريق التحرير' });
        toast({ title: "تم نشر المقال بنجاح!" });
        router.push(`/articles`);
      }
      router.refresh();

    } catch (error) {
      console.error("Failed to process article:", error);
      toast({
        variant: "destructive",
        title: "خطأ في العملية",
        description: `حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabelIcon icon={FileText} label="عنوان المقال" /><FormControl><Input placeholder="اكتب عنوانًا جذابًا للمقال..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabelIcon icon={ImageIcon} label="رابط الصورة الرئيسية" /><FormControl><Input type="url" placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="imageHint" render={({ field }) => (<FormItem><FormLabelIcon icon={ImageIcon} label="تلميح الصورة (للبحث)" /><FormControl><Input placeholder="مثال: job search" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
                <FormLabelIcon icon={AlignLeft} label="المحتوى الكامل للمقال" />
                <div className="text-xs text-muted-foreground space-y-1">
                    <p> - استخدم `###` قبل النص لإنشاء عنوان رئيسي (سيظهر باللون الأخضر).</p>
                    <p> - لكتابة عنوان فرعي (باللون الأسود)، اكتبه في السطر الذي يلي العنوان الرئيسي مباشرة.</p>
                </div>
                <FormControl><Textarea placeholder="اكتب محتوى المقال هنا..." rows={15} {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        
        <Button type="submit" disabled={isSubmitting} className="w-full mt-8" size="lg" style={{backgroundColor: sectionColor}}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'تحديث المقال' : 'نشر المقال'}
        </Button>
      </form>
    </Form>
  );
}
