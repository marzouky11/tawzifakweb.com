'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { addTestimonial } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  content: z.string().min(10, { message: 'يجب أن يكون الرأي 10 أحرف على الأقل.' }).max(500, { message: 'يجب ألا يتجاوز الرأي 500 حرف.' }),
});

function AddTestimonialForm() {
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !userData) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب عليك تسجيل الدخول أولاً.",
      });
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTestimonial({
        userId: user.uid,
        userName: userData.name,
        userAvatarColor: userData.avatarColor || '#3b82f6',
        content: values.content,
      });

      toast({
        title: "شكرًا لك!",
        description: "تم إرسال رأيك بنجاح. نحن نقدر مساهمتك.",
      });
      router.push('/');
    } catch (error) {
      console.error("Failed to add testimonial:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description: "حدث خطأ غير متوقع أثناء إرسال رأيك. يرجى المحاولة مرة أخرى لاحقًا.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رأيك يهمنا</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اكتب هنا رأيك حول تجربتك مع منصة توظيفك..."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          إرسال الرأي
        </Button>
      </form>
    </Form>
  );
}

export default AddTestimonialForm;
