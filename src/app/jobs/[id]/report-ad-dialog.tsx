'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Flag, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const reportReasons = [
  'إعلان احتيالي أو مضلل',
  'محتوى غير لائق',
  'إعلان مكرر',
  'معلومات اتصال خاطئة',
  'سبب آخر',
] as const;

const reportSchema = z.object({
  reason: z.enum(reportReasons, { 
    required_error: 'الرجاء اختيار سبب الإبلاغ.' 
  }),
  details: z.string().optional(),
});

interface ReportAdDialogProps {
  adId: string;
}

export function ReportAdDialog({ adId }: ReportAdDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      details: '',
    },
  });

  const onSubmit = (data: z.infer<typeof reportSchema>) => {
    setIsSubmitting(true);
    try {
      const adUrl = window.location.href;
      const subject = `بلاغ بخصوص إعلان مخالف (${adId})`;
      const body = `
مرحبًا فريق توظيفك،

أود الإبلاغ عن المحتوى التالي:
- رابط الإعلان: ${adUrl}
- سبب الإبلاغ: ${data.reason}
- تفاصيل إضافية: ${data.details || 'لا يوجد'}

شكرًا لكم لمراجعة هذا البلاغ.
      `.trim().replace(/^\s+/gm, '');

      const mailtoLink = `mailto:tawzifakweb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink;

      toast({
        title: 'تم تحويلك إلى برنامج البريد',
        description: 'يرجى إرسال البريد الإلكتروني الذي تم تجهيزه لإتمام عملية الإبلاغ.',
      });

      setTimeout(() => {
        setIsOpen(false);
        form.reset();
      }, 500);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'فشل فتح برنامج البريد',
        description: 'حدث خطأ ما. يمكنك نسخ بريدنا الإلكتروني يدويًا: tawzifakweb@gmail.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
        }
    }}>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="text-destructive hover:text-destructive/80 w-fit mx-auto p-0 h-auto">
          <Flag className="ml-2 h-4 w-4" />
          الإبلاغ عن هذا الإعلان
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>الإبلاغ عن إعلان</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم فتح برنامج البريد الإلكتروني لديك لإرسال تفاصيل البلاغ إلى فريقنا. لن تتم مشاركة معلوماتك مع المعلن.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-4">
               <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>سبب الإبلاغ</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {reportReasons.map((reason) => (
                            <FormItem key={reason} className="flex items-center space-x-2 space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value={reason} id={reason} />
                              </FormControl>
                              <Label htmlFor={reason} className="font-normal">{reason}</Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>تفاصيل إضافية (اختياري)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="اكتب تفاصيل إضافية هنا..."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
               />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={() => { setIsOpen(false); form.reset(); }}>إلغاء</AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                إرسال البلاغ
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
