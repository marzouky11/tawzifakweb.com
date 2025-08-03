
'use client';

import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2, Download } from 'lucide-react';
import { templates } from './templates/templates';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

const formSchema = z.object({
  fullName: z.string().min(1, 'الاسم الكامل مطلوب'),
  jobTitle: z.string().min(1, 'المسمى الوظيفي مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  address: z.string().min(1, 'العنوان مطلوب'),
  summary: z.string().min(10, 'يجب أن يكون الملخص 10 أحرف على الأقل'),
  experiences: z.array(z.object({
    title: z.string().min(1, 'المسمى الوظيفي مطلوب'),
    company: z.string().min(1, 'اسم الشركة مطلوب'),
    date: z.string().min(1, 'التاريخ مطلوب'),
    description: z.string().min(1, 'الوصف مطلوب'),
  })),
  educations: z.array(z.object({
    degree: z.string().min(1, 'الشهادة مطلوبة'),
    school: z.string().min(1, 'المؤسسة التعليمية مطلوبة'),
    date: z.string().min(1, 'التاريخ مطلوب'),
  })),
  skills: z.array(z.object({
    name: z.string().min(1, 'اسم المهارة مطلوب'),
  })),
});

export type CVData = z.infer<typeof formSchema>;

export function CVForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const form = useForm<CVData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      jobTitle: '',
      email: user?.email || '',
      phone: '',
      address: '',
      summary: '',
      experiences: [{ title: '', company: '', date: '', description: '' }],
      educations: [{ degree: '', school: '', date: '' }],
      skills: [{ name: '' }],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experiences" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "educations" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });

  const onSubmit = async (data: CVData) => {
    setIsGenerating(true);
    toast({ title: 'جاري إنشاء سيرتك الذاتية...', description: 'قد يستغرق هذا بضع لحظات.' });

    try {
        if (!printRef.current) {
            throw new Error('Could not find the template element to print.');
        }

        const dataUrl = await toPng(printRef.current, { cacheBust: true, pixelRatio: 2 });
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${data.fullName}-cv.pdf`);
        
        toast({ title: 'تم التحميل بنجاح!', description: 'تم تحميل سيرتك الذاتية بصيغة PDF.' });

    } catch (error) {
        console.error('Failed to generate PDF', error);
        toast({ variant: 'destructive', title: 'خطأ', description: 'فشل إنشاء ملف PDF. يرجى المحاولة مرة أخرى.' });
    } finally {
        setIsGenerating(false);
    }
  };
  
   if (!user) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">يجب عليك تسجيل الدخول لإنشاء سيرة ذاتية.</p>
        <Button onClick={() => router.push('/login?redirect=/cv-builder')}>تسجيل الدخول</Button>
      </div>
    );
  }
  
  const TemplateComponent = selectedTemplate.component;

  return (
    <>
      {/* Hidden container for rendering the template for PDF generation */}
      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
          <div ref={printRef} style={{ width: '210mm', height: '297mm' }}>
              <style>{selectedTemplate.styles}</style>
              <TemplateComponent data={form.getValues()} />
          </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader><CardTitle>المعلومات الشخصية</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>الاسم الكامل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem><FormLabel>المسمى الوظيفي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>البريد الإلكتروني</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>العنوان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="summary" render={({ field }) => (<FormItem><FormLabel>ملخص احترافي</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>الخبرة العملية</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {expFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`experiences.${index}.title`} render={({ field }) => (<FormItem><FormLabel>المسمى الوظيفي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`experiences.${index}.company`} render={({ field }) => (<FormItem><FormLabel>الشركة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <FormField control={form.control} name={`experiences.${index}.date`} render={({ field }) => (<FormItem><FormLabel>التاريخ</FormLabel><FormControl><Input placeholder="مثال: يناير 2020 - الحالي" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`experiences.${index}.description`} render={({ field }) => (<FormItem><FormLabel>الوصف</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeExp(index)} className="absolute top-2 left-2"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendExp({ title: '', company: '', date: '', description: '' })}><PlusCircle className="ml-2 h-4 w-4" /> إضافة خبرة</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>التعليم</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                       <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`educations.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>الشهادة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`educations.${index}.school`} render={({ field }) => (<FormItem><FormLabel>المؤسسة التعليمية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <FormField control={form.control} name={`educations.${index}.date`} render={({ field }) => (<FormItem><FormLabel>التاريخ</FormLabel><FormControl><Input placeholder="مثال: 2016 - 2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeEdu(index)} className="absolute top-2 left-2"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendEdu({ degree: '', school: '', date: '' })}><PlusCircle className="ml-2 h-4 w-4" /> إضافة تعليم</Button>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle>المهارات</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="relative">
                        <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => (<FormItem><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute -top-3 -left-3 h-6 w-6 text-destructive" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={() => appendSkill({ name: '' })}><PlusCircle className="ml-2 h-4 w-4" /> إضافة مهارة</Button>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Download className="ml-2 h-4 w-4" />}
                {isGenerating ? 'جاري التحميل...' : 'تحميل السيرة الذاتية (PDF)'}
              </Button>
            </form>
          </Form>
        </div>

        <div className="md:col-span-1 space-y-6 md:sticky md:top-24">
          <h3 className="text-xl font-bold">اختر القالب</h3>
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border-4 rounded-lg cursor-pointer transition-all ${selectedTemplate.id === template.id ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setSelectedTemplate(template)}
              >
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  width={200}
                  height={282}
                  className="rounded-md w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
