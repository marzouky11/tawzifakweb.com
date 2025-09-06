
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast"
import type { User } from '@/lib/types';
import { updateUserProfile } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { Loader2, Lock } from 'lucide-react';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const profileSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل.' }),
  email: z.string().email(),
  phone: z.string().min(1, { message: 'رقم الهاتف مطلوب.' }),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'كلمة المرور الحالية مطلوبة.'}),
    newPassword: z.string().min(6, { message: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.' }),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين.",
    path: ["confirmPassword"],
});


interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    if (!authUser) return;
    setIsSubmitting(true);
    try {
        await updateUserProfile(authUser.uid, { name: values.name, phone: values.phone });
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

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
      if (!authUser || !authUser.email) return;
      setIsPasswordSubmitting(true);
      try {
          const credential = EmailAuthProvider.credential(authUser.email, values.currentPassword);
          await reauthenticateWithCredential(authUser, credential);
          await updatePassword(authUser, values.newPassword);
          toast({
              title: "تم تغيير كلمة المرور بنجاح",
          });
          passwordForm.reset();
      } catch (error: any) {
          let errorMessage = "فشل تغيير كلمة المرور. يرجى المحاولة مرة أخرى.";
          if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
              errorMessage = "كلمة المرور الحالية غير صحيحة.";
          }
          toast({
              variant: "destructive",
              title: "خطأ",
              description: errorMessage,
          });
      } finally {
          setIsPasswordSubmitting(false);
      }
  }

  return (
    <div className="space-y-8">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
          <h2 className="text-xl font-bold">المعلومات الشخصية</h2>
          <FormField control={profileForm.control} name="name" render={({ field }) => (
              <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl><Input placeholder="اسمك الكامل" {...field} /></FormControl>
                  <FormMessage />
              </FormItem>
          )} />
          <FormField control={profileForm.control} name="email" render={({ field }) => (
            <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl><Input disabled {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )} />
          <FormField control={profileForm.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ التغييرات
          </Button>
        </form>
      </Form>

      <Separator />
        
      <Collapsible>
        <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
                <Lock className="ml-2 h-4 w-4" />
                تغيير كلمة المرور
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 mt-6 border p-6 rounded-lg">
                     <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                        <FormItem>
                            <FormLabel>كلمة المرور الحالية</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                        <FormItem>
                            <FormLabel>كلمة المرور الجديدة</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                        <FormItem>
                            <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" size="lg" className="w-full" variant="secondary" disabled={isPasswordSubmitting}>
                        {isPasswordSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        تحديث كلمة المرور
                    </Button>
                </form>
            </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
