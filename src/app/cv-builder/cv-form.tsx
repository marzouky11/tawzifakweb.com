
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2, Download, Image as ImageIcon, RotateCw, Crop, User, Briefcase, Mail, Phone, MapPin, GraduationCap, Award, Star, Info, MessageSquare, Instagram, Link as LinkIcon, Building2, Users2, ClipboardList, FileText, Globe } from 'lucide-react';
import { templates } from './templates/templates';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { getCroppedImg } from './crop-image';
import { Slider } from '@/components/ui/slider';


const formSchema = z.object({
  fullName: z.string().min(1, 'الاسم الكامل مطلوب'),
  jobTitle: z.string().min(1, 'المسمى الوظيفي مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  address: z.string().min(1, 'العنوان مطلوب'),
  summary: z.string().min(10, 'يجب أن يكون الملخص 10 أحرف على الأقل'),
  profilePicture: z.string().optional(),
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
  languages: z.array(z.object({
    name: z.string().min(1, 'اسم اللغة مطلوب'),
  })),
});

export type CVData = z.infer<typeof formSchema>;

// Function to convert a URL to a data URI
async function toDataURL(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function CVForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Image crop state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const form = useForm<CVData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      jobTitle: '',
      email: user?.email || '',
      phone: '',
      address: '',
      summary: '',
      profilePicture: user?.photoURL || '',
      experiences: [{ title: '', company: '', date: '', description: '' }],
      educations: [{ degree: '', school: '', date: '' }],
      skills: [{ name: 'مهارة 1' }, { name: 'مهارة 2'}, { name: 'مهارة 3' }],
      languages: [{ name: 'العربية' }],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experiences" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "educations" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });
  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control: form.control, name: "languages" });
  
  const profilePictureValue = form.watch('profilePicture');

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if(croppedImage) {
        form.setValue('profilePicture', croppedImage);
      }
      setImageSrc(null); // Close the dialog
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'خطأ في قص الصورة',
        description: 'حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.',
      });
    }
  }, [imageSrc, croppedAreaPixels, rotation, form, toast]);


  const onSubmit = async (data: CVData) => {
    setIsGenerating(true);
    toast({ title: 'جاري إنشاء سيرتك الذاتية...', description: 'قد يستغرق هذا بضع لحظات.' });

    try {
        if (!printRef.current) {
            throw new Error('Could not find the template element to print.');
        }

        const dataForPdf = { ...data };
        if (dataForPdf.profilePicture && !dataForPdf.profilePicture.startsWith('data:')) {
            try {
                dataForPdf.profilePicture = await toDataURL(dataForPdf.profilePicture);
            } catch (error) {
                console.error("Failed to convert image to data URL", error);
                toast({
                    variant: 'destructive',
                    title: 'خطأ في تحميل الصورة',
                    description: 'لم نتمكن من تحميل الصورة الشخصية، سيتم إنشاء السيرة الذاتية بدونها.'
                });
                dataForPdf.profilePicture = '';
            }
        }
        
        const originalData = form.getValues();
        form.reset(dataForPdf);
        
        await new Promise(resolve => setTimeout(resolve, 50));


        const dataUrl = await toPng(printRef.current, { cacheBust: true, pixelRatio: 2 });
        
        form.reset(originalData);

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
    // This case is handled by the page component, but as a fallback:
    return (
      <div className="text-center py-12">
        <p className="mb-4">يجب عليك تسجيل الدخول لإنشاء سيرة ذاتية.</p>
        <Button onClick={() => router.push('/login?redirect=/cv-builder')}>تسجيل الدخول</Button>
      </div>
    );
  }
  
  const TemplateComponent = selectedTemplate.component;

  const FormLabelIcon = ({icon: Icon, label}: {icon: React.ElementType, label: string}) => (
    <FormLabel className="flex items-center gap-2">
      <Icon className='h-4 w-4 text-primary' />
      {label}
    </FormLabel>
  );

  return (
    <>
      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none" aria-hidden="true">
          <div ref={printRef} style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white' }}>
              <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&family=Cairo:wght@400;700&display=swap');
                ${selectedTemplate.styles}
              `}</style>
              <TemplateComponent data={form.getValues()} />
          </div>
      </div>
      
      <Dialog open={!!imageSrc} onOpenChange={(isOpen) => !isOpen && setImageSrc(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>قص الصورة</DialogTitle>
          </DialogHeader>
          <div className="relative h-96 w-full bg-muted">
            <Cropper
              image={imageSrc || ''}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              <Slider value={[zoom]} onValueChange={(val) => setZoom(val[0])} min={1} max={3} step={0.1} />
            </div>
            <div className="flex items-center gap-2">
              <RotateCw className="h-5 w-5" />
              <Slider value={[rotation]} onValueChange={(val) => setRotation(val[0])} min={0} max={360} step={1} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageSrc(null)}>إلغاء</Button>
            <Button onClick={showCroppedImage}>قص وحفظ الصورة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/> المعلومات الشخصية</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelIcon icon={ImageIcon} label="الصورة الشخصية (اختياري)"/>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              {profilePictureValue ? (
                                <Image src={profilePictureValue} alt="صورة شخصية" width={96} height={96} className="object-cover w-full h-full" />
                              ) : (
                                <ImageIcon className="w-10 h-10 text-muted-foreground" />
                              )}
                            </div>
                            <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <div className="flex flex-col gap-2">
                                <Button type="button" variant="outline" onClick={() => document.getElementById('picture')?.click()}>
                                    تحميل صورة
                                </Button>
                               {profilePictureValue && (
                                <Button type="button" variant="destructive" size="sm" onClick={() => form.setValue('profilePicture', '')}>
                                    إزالة الصورة
                                </Button>
                               )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabelIcon icon={User} label="الاسم الكامل"/><FormControl><Input placeholder="مثال: محمد الأحمدي" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem><FormLabelIcon icon={Briefcase} label="المسمى الوظيفي"/><FormControl><Input placeholder="مثال: مطور ويب" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabelIcon icon={Mail} label="البريد الإلكتروني"/><FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabelIcon icon={Phone} label="رقم الهاتف"/><FormControl><Input placeholder="+xxxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabelIcon icon={MapPin} label="العنوان"/><FormControl><Input placeholder="المدينة، الدولة" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="summary" render={({ field }) => (<FormItem><FormLabelIcon icon={Info} label="ملخص احترافي"/><FormControl><Textarea rows={4} placeholder="اكتب نبذة مختصرة عنك وعن خبراتك وأهدافك المهنية..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> الخبرة العملية</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {expFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`experiences.${index}.title`} render={({ field }) => (<FormItem><FormLabel>المسمى الوظيفي</FormLabel><FormControl><Input placeholder="مثال: مدير مشروع" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`experiences.${index}.company`} render={({ field }) => (<FormItem><FormLabel>الشركة</FormLabel><FormControl><Input placeholder="اسم الشركة" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <FormField control={form.control} name={`experiences.${index}.date`} render={({ field }) => (<FormItem><FormLabel>التاريخ</FormLabel><FormControl><Input placeholder="مثال: يناير 2020 - الحالي" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`experiences.${index}.description`} render={({ field }) => (<FormItem><FormLabel>الوصف</FormLabel><FormControl><Textarea placeholder="صف مهامك وإنجازاتك الرئيسية في هذه الوظيفة..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeExp(index)} className="absolute top-1 left-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendExp({ title: '', company: '', date: '', description: '' })}><PlusCircle className="ml-2 h-4 w-4" /> إضافة خبرة</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5"/> التعليم</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                       <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`educations.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>الشهادة</FormLabel><FormControl><Input placeholder="مثال: بكالوريوس في علوم الحاسب" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`educations.${index}.school`} render={({ field }) => (<FormItem><FormLabel>المؤسسة التعليمية</FormLabel><FormControl><Input placeholder="اسم الجامعة أو المعهد" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <FormField control={form.control} name={`educations.${index}.date`} render={({ field }) => (<FormItem><FormLabel>التاريخ</FormLabel><FormControl><Input placeholder="مثال: 2016 - 2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeEdu(index)} className="absolute top-1 left-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendEdu({ degree: '', school: '', date: '' })}><PlusCircle className="ml-2 h-4 w-4" /> إضافة تعليم</Button>
                </CardContent>
              </Card>

               <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5"/> المهارات</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="relative">
                        <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => (<FormItem><FormControl><Input placeholder="مثال: Photoshop" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute -top-3 -left-3 h-6 w-6 text-destructive" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={() => appendSkill({ name: '' })}><PlusCircle className="ml-2 h-4 w-4" /> إضافة مهارة</Button>
                </CardContent>
              </Card>
              
               <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5"/> اللغات</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {langFields.map((field, index) => (
                      <div key={field.id} className="relative">
                        <FormField control={form.control} name={`languages.${index}.name`} render={({ field }) => (<FormItem><FormControl><Input placeholder="مثال: الإنجليزية" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute -top-3 -left-3 h-6 w-6 text-destructive" onClick={() => removeLang(index)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={() => appendLang({ name: '' })}><PlusCircle className="ml-2 h-4 w-4" /> إضافة لغة</Button>
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
                className={`border-4 rounded-lg cursor-pointer transition-all ${selectedTemplate.id === template.id ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                onClick={() => setSelectedTemplate(template)}
              >
                <Card
                  className="flex flex-col items-center justify-center p-2 h-full aspect-[1/1.41]"
                  style={{ backgroundColor: `${template.color}1A` }} // ~10% opacity
                >
                  <FileText className="w-7 h-7 mb-2" style={{ color: template.color }} />
                  <p className="font-semibold text-center text-xs" style={{ color: template.color }}>
                    {template.name}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

    

    

