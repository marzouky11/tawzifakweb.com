
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
import { postCompetition } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"


const formSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل.'),
  organizer: z.string().min(2, 'اسم الجهة المنظمة مطلوب.'),
  location: z.string().min(2, 'الموقع مطلوب.'),
  competitionType: z.string().min(2, 'نوع المباراة مطلوب.'),
  positionsAvailable: z.coerce.number().int().positive('عدد المناصب يجب أن يكون رقمًا صحيحًا موجبًا.'),
  requirements: z.string().min(10, 'الشروط مطلوبة.'),
  documentsNeeded: z.string().min(10, 'الوثائق المطلوبة.'),
  deadline: z.date({
    required_error: "آخر أجل للتسجيل مطلوب.",
  }),
  officialLink: z.string().url('الرابط الرسمي يجب أن يكون رابطًا صحيحًا.'),
  description: z.string().optional(),
  fileUrl: z.string().url('رابط الملف يجب أن يكون رابطًا صحيحًا.').optional().or(z.literal('')),
});

export function PostCompetitionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      organizer: '',
      location: '',
      competitionType: '',
      positionsAvailable: 1,
      requirements: '',
      documentsNeeded: '',
      officialLink: '',
      description: '',
      fileUrl: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const dataToSave = {
          ...values,
          deadline: values.deadline.toISOString().split('T')[0], // format to YYYY-MM-DD
      };

      const { id } = await postCompetition(dataToSave);
      
      toast({
        title: "تم النشر بنجاح!",
        description: "تم نشر المباراة العمومية وسيتم عرضها في القسم المخصص.",
      });
      form.reset();
      router.push(`/competitions/${id}`);
    } catch (error) {
      console.error("Failed to post competition:", error);
      toast({
        variant: "destructive",
        title: "خطأ في النشر",
        description: "حدث خطأ غير متوقع أثناء نشر المباراة. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>العنوان</FormLabel><FormControl><Input placeholder="اسم المباراة أو الإعلان الرسمي" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="organizer" render={({ field }) => (
            <FormItem><FormLabel>الجهة المنظمة</FormLabel><FormControl><Input placeholder="اسم المؤسسة أو الإدارة" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel>الموقع / المدينة</FormLabel><FormControl><Input placeholder="مكان إجراء المباراة" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="competitionType" render={({ field }) => (
            <FormItem><FormLabel>نوع المباراة</FormLabel><FormControl><Input placeholder="مفتوحة للجميع، لفئة معينة..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="positionsAvailable" render={({ field }) => (
            <FormItem><FormLabel>عدد المناصب</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <FormField control={form.control} name="requirements" render={({ field }) => (
          <FormItem><FormLabel>الشروط المطلوبة</FormLabel><FormControl><Textarea placeholder="المؤهلات المطلوبة (شهادات، خبرة، العمر...)" rows={4} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="documentsNeeded" render={({ field }) => (
          <FormItem><FormLabel>الوثائق المطلوبة</FormLabel><FormControl><Textarea placeholder="السيرة الذاتية، نسخة الشهادة، بطاقة التعريف..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>آخر أجل للتسجيل</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>اختر تاريخًا</span>
                      )}
                      <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={form.control} name="officialLink" render={({ field }) => (
          <FormItem><FormLabel>الرابط الرسمي للمباراة</FormLabel><FormControl><Input type="url" placeholder="https://example.com/competition" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>الوصف التفصيلي (اختياري)</FormLabel><FormControl><Textarea placeholder="معلومات إضافية حول طريقة التسجيل، الاختبار..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="fileUrl" render={({ field }) => (
          <FormItem><FormLabel>رابط ملف إضافي (PDF اختياري)</FormLabel><FormControl><Input type="url" placeholder="رابط مباشر لملف PDF رسمي" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          نشر المباراة
        </Button>
      </form>
    </Form>
  );
}
