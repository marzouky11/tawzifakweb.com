
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import type { Category, Job, PostType } from '@/lib/types';
import { postJob, updateAd } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Briefcase, Users, FileText, FileSignature, 
  LayoutGrid, Globe, MapPin, Wallet, Phone, MessageSquare, Mail,
  Building2, Award, Users2, Info, Instagram, GraduationCap, Link as LinkIcon,
  ClipboardList, ArrowLeft, ArrowRight, CheckSquare, Check, HelpCircle, Target,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  postType: z.enum(['seeking_worker', 'seeking_job'], { required_error: 'الرجاء تحديد نوع الإعلان.' }),
  title: z.string().min(1, { message: 'اسم الإعلان مطلوب.' }),
  categoryId: z.string().optional(),
  customCategory: z.string().optional(),
  workType: z.enum(['full_time', 'part_time', 'freelance', 'remote']).optional(),
  country: z.string().min(1, { message: 'الدولة مطلوبة.' }),
  city: z.string().min(1, { message: 'المدينة مطلوبة.' }),
  
  companyName: z.string().optional(),
  experience: z.string().optional(),
  description: z.string().optional(),
  qualifications: z.string().optional(),
  salary: z.string().optional(),
  openPositions: z.coerce.number().int().positive().optional(),
  conditions: z.string().optional(),
  tasks: z.string().optional(),
  featuresAndOpportunities: z.string().optional(),
  
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }).optional().or(z.literal('')),
  instagram: z.string().optional(),
  applyUrl: z.string().url({ message: 'الرجاء إدخال رابط صحيح' }).optional().or(z.literal('')),
  howToApply: z.string().optional(),
}).refine(data => 
    (!!data.phone || !!data.whatsapp || !!data.email || !!data.instagram) || 
    (!!data.applyUrl && data.postType === 'seeking_worker'), {
  message: 'يجب توفير وسيلة تواصل واحدة على الأقل أو رابط للتقديم.',
  path: ['phone'],
});

const stepFields = [
  ['postType', 'title', 'categoryId', 'customCategory', 'workType', 'country', 'city'],
  ['companyName', 'experience', 'description', 'qualifications', 'salary', 'openPositions', 'conditions', 'tasks', 'featuresAndOpportunities'],
  ['phone', 'whatsapp', 'email', 'instagram', 'applyUrl', 'howToApply'],
];

interface PostJobFormProps {
  categories: Category[];
  job?: Job | null;
  preselectedType?: PostType;
}

const StepsIndicator = ({ currentStep, steps, onStepClick, themeColor }: { currentStep: number; steps: { id: number; name: string, description: string; icon: React.ElementType }[]; onStepClick: (step: number) => void; themeColor: string; }) => {
  return (
    <div className="relative">
      <div className="absolute right-0 top-1/2 w-full -translate-y-1/2" aria-hidden="true">
        <div className="h-0.5 w-full bg-border" />
      </div>
      <div
        className="absolute right-0 top-1/2 h-0.5 -translate-y-1/2 transition-all duration-300"
        style={{ width: `calc(${currentStep} / ${steps.length - 1} * 100%)`, backgroundColor: themeColor }}
      />
      <div className="relative flex justify-between">
        {steps.map((step, stepIdx) => {
          const isCompleted = stepIdx < currentStep;
          const isCurrent = stepIdx === currentStep;
          
          return (
            <div key={step.name} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => stepIdx <= currentStep && onStepClick(stepIdx)}
                className={cn(
                  "relative z-10 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 border-2",
                  isCurrent ? "scale-110" : "bg-muted text-muted-foreground border-border",
                  "hover:scale-105"
                )}
                 style={{
                    backgroundColor: isCurrent || isCompleted ? themeColor : undefined,
                    borderColor: isCurrent || isCompleted ? themeColor : undefined,
                    color: isCurrent || isCompleted ? 'white' : undefined,
                }}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
              </button>
              <div className="hidden md:block text-center mt-2">
                <p className={cn("font-bold", isCurrent ? "text-primary" : "text-foreground")} style={{color: isCurrent ? themeColor : undefined}}>
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



export function PostJobForm({ categories, job, preselectedType }: PostJobFormProps) {
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const router = useRouter();
  const isEditing = !!job;
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postType: job?.postType || preselectedType,
      title: job?.title || '',
      categoryId: job?.categoryId || '',
      customCategory: !job?.categoryId && job?.categoryName ? job.categoryName : '',
      country: job?.country || '',
      city: job?.city || '',
      workType: job?.workType,
      salary: job?.salary || '',
      experience: job?.experience || '',
      description: job?.description || '',
      qualifications: job?.qualifications || '',
      companyName: job?.companyName || '',
      openPositions: job?.openPositions || undefined,
      conditions: job?.conditions || '',
      tasks: job?.tasks || '',
      featuresAndOpportunities: job?.featuresAndOpportunities || '',
      phone: job?.phone || '',
      whatsapp: job?.whatsapp || '',
      email: job?.email || '',
      instagram: job?.instagram || '',
      applyUrl: job?.applyUrl || '',
      howToApply: job?.howToApply || '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedType) {
      form.setValue('postType', preselectedType);
    }
  }, [preselectedType, form]);

  const postType = form.watch('postType');
  const categoryId = form.watch('categoryId');
  const customCategory = form.watch('customCategory');
  
  const getThemeColor = () => {
    if (postType === 'seeking_job') return '#424242'; // Dark Gray
    if (postType === 'seeking_worker') return '#0D47A1'; // Dark Blue
    return 'hsl(var(--primary))';
  }

  const nextStep = async () => {
    const fieldsToValidate = stepFields[currentStep] as (keyof z.infer<typeof formSchema>)[];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
        if (currentStep < stepsContent.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    } else {
        toast({
            variant: "destructive",
            title: "حقول ناقصة",
            description: "الرجاء تعبئة جميع الحقول المطلوبة للمتابعة.",
        });
    }
  };
  
  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex < currentStep) {
        setCurrentStep(stepIndex);
        return;
    }
    const fieldsToValidate = stepFields.slice(0, stepIndex + 1).flat() as (keyof z.infer<typeof formSchema>)[];
    const isValid = await form.trigger(fieldsToValidate);

    if(isValid) {
        setCurrentStep(stepIndex);
    } else {
         toast({
            variant: "destructive",
            title: "حقول ناقصة",
            description: "الرجاء تعبئة جميع الحقول في المراحل السابقة أولاً.",
        });
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };


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
      const { customCategory, ...restOfValues } = values;

      const dataToSave: { [key: string]: any } = { ...restOfValues };

      if (customCategory) {
          dataToSave.categoryName = customCategory;
          dataToSave.categoryId = null; // Use null to clear the field in Firestore
      } else if (values.categoryId) {
          const selectedCat = categories.find(c => c.id === values.categoryId);
          dataToSave.categoryName = selectedCat?.name;
      } else {
          dataToSave.categoryName = null;
          dataToSave.categoryId = null;
      }

      if (isEditing && job) {
        await updateAd(job.id, dataToSave);
        toast({
          title: "تم تحديث الإعلان بنجاح!",
          description: "تم حفظ التغييرات على إعلانك.",
        });
        router.push(`/profile/my-ads`);
      } else {
        const newJobData = {
          userId: user.uid,
          ownerName: userData.name,
          ownerAvatarColor: userData.avatarColor,
          postType: values.postType,
          title: values.title,
          country: values.country,
          city: values.city,
          workType: values.workType,
          categoryId: dataToSave.categoryId,
          categoryName: dataToSave.categoryName,
          companyName: values.companyName,
          salary: values.salary,
          experience: values.experience,
          description: values.description,
          qualifications: values.qualifications,
          conditions: values.conditions,
          tasks: values.tasks,
          featuresAndOpportunities: values.featuresAndOpportunities,
          openPositions: values.openPositions,
          phone: values.phone,
          whatsapp: values.whatsapp,
          email: values.email,
          instagram: values.instagram,
          applyUrl: values.applyUrl,
          howToApply: values.howToApply,
        };

        const { id } = await postJob(newJobData);
        toast({
          title: "تم النشر بنجاح!",
          description: "تم نشر إعلانك وسيظهر في القسم المناسب.",
        });
        form.reset();
        router.push(values.postType === 'seeking_job' ? `/workers/${id}` : `/jobs/${id}`);
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "خطأ",
        description: isEditing ? "فشل تحديث الإعلان." : "حدث خطأ أثناء نشر الإعلان.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const FormLabelIcon = ({icon: Icon, label}: {icon: React.ElementType, label: string}) => (
    <FormLabel className="flex items-center gap-2 text-base md:text-lg">
      <Icon 
        className='h-4 w-4'
        style={{ color: getThemeColor() }}
      />
      {label}
    </FormLabel>
  )

  const steps = [
    { id: 1, name: "المعلومات الأساسية", description: "نوع الإعلان وتفاصيله الرئيسية.", icon: FileText },
    { id: 2, name: "التفاصيل", description: "معلومات إضافية عن الوظيفة أو خبرتك.", icon: FileSignature },
    { id: 3, name: "التواصل", description: "كيف يمكن للمهتمين التواصل معك.", icon: Phone },
  ];
  
  const step1Content = (
    <div className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabelIcon icon={FileText} label="عنوان الإعلان" /><FormControl><Input placeholder={postType === 'seeking_job' ? "مثال: مصمم جرافيك يبحث عن فرصة..." : "مثال: مطلوب مهندس مدني..."} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <FormLabelIcon icon={LayoutGrid} label="الفئة (اختياري)"/>
                {(categoryId || customCategory) && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-1 text-xs"
                        onClick={() => {
                            form.setValue('categoryId', '');
                            form.setValue('customCategory', '');
                        }}
                    >
                        مسح الاختيار
                    </Button>
                )}
            </div>
             <p className="text-sm text-muted-foreground -mt-2">
                اختر من القائمة أو أدخل فئة مخصصة. لا يمكن اختيار الاثنين معاً.
            </p>
            <FormField control={form.control} name="categoryId" render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value) {
                      form.setValue('customCategory', '');
                    }
                  }} 
                  value={field.value}
                  disabled={!!customCategory}
                >
                  <FormControl><SelectTrigger><SelectValue placeholder="اختر فئة العمل من القائمة" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <ScrollArea className="h-[250px]">
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="relative flex items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground">أو</span>
                <div className="flex-grow border-t border-border"></div>
            </div>
            <FormField control={form.control} name="customCategory" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="أدخل فئة مخصصة إذا لم تجدها في القائمة" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value) {
                        form.setValue('categoryId', '');
                      }
                    }}
                    disabled={!!categoryId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
        </div>
        <FormField control={form.control} name="workType" render={({ field }) => (
            <FormItem><FormLabelIcon icon={Briefcase} label="نوع العمل (اختياري)" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع العمل" /></SelectTrigger></FormControl><SelectContent><SelectItem value="full_time">دوام كامل</SelectItem><SelectItem value="part_time">دوام جزئي</SelectItem><SelectItem value="freelance">عمل حر</SelectItem><SelectItem value="remote">عن بعد</SelectItem></SelectContent></Select><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem><FormLabelIcon icon={Globe} label="الدولة" /><FormControl><Input placeholder="مثال: المغرب" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabelIcon icon={MapPin} label="المدينة"/><FormControl><Input placeholder="مثال: الدار البيضاء" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
    </div>
  );
  
  const step2Content = (
     <div className="space-y-6">
        {postType === 'seeking_job' ? (
          <>
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabelIcon icon={FileSignature} label="وصف المهارات والخبرة" /><FormControl><Textarea placeholder="اكتب تفاصيل عن مهاراتك وخبراتك..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="qualifications" render={({ field }) => (<FormItem><FormLabelIcon icon={GraduationCap} label="الشهادات والمؤهلات" /><FormControl><Textarea placeholder="مثال: بكالوريوس هندسة، دبلوم تقني..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabelIcon icon={Award} label="الخبرة" /><FormControl><Textarea placeholder="مثال: 5 سنوات في مجال التسويق، أو حديث التخرج بخبرة تدريبية في شركة..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ) : (
           <>
                <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabelIcon icon={Building2} label="اسم الشركة (اختياري)" /><FormControl><Input placeholder="اسم الشركة أو الجهة" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="salary" render={({ field }) => (<FormItem><FormLabelIcon icon={Wallet} label="الأجر (اختياري)" /><FormControl><Input placeholder="مثال: 5000 درهم / شهري" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="openPositions" render={({ field }) => (<FormItem><FormLabelIcon icon={Users2} label="الوظائف المتاحة (اختياري)" /><FormControl><Input type="number" placeholder="مثال: 3" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabelIcon icon={FileSignature} label="وصف الوظيفة (اختياري)"/><FormControl><Textarea placeholder="اكتب تفاصيل إضافية عن الوظيفة..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="conditions" render={({ field }) => (<FormItem><FormLabelIcon icon={ClipboardList} label="الشروط المطلوبة (اختياري)" /><FormControl><Textarea placeholder="اكتب الشروط الإضافية هنا، مثل: العمر، توفر وسيلة نقل، أوقات العمل..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="qualifications" render={({ field }) => (<FormItem><FormLabelIcon icon={GraduationCap} label='المؤهلات المطلوبة (اختياري)' /><FormControl><Textarea placeholder="مثال: بكالوريوس هندسة، دبلوم تقني..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabelIcon icon={Award} label='الخبرة المطلوبة' /><FormControl><Textarea placeholder="مثال: 5 سنوات في مجال التسويق، أو حديث التخرج بخبرة تدريبية في شركة..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tasks" render={({ field }) => (<FormItem><FormLabelIcon icon={CheckSquare} label="المهام المطلوبة (اختياري)" /><FormControl><Textarea placeholder="اكتب قائمة بالمهام والمسؤوليات للوظيفة..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="featuresAndOpportunities" render={({ field }) => (<FormItem><FormLabelIcon icon={Target} label="المميزات والفرص (اختياري)" /><FormControl><Textarea placeholder="معلومات عن السكن، التأمين، فرص التدريب أو التوظيف بعد البرنامج..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="howToApply" render={({ field }) => (<FormItem><FormLabelIcon icon={HelpCircle} label="كيفية التقديم (اختياري)" /><FormControl><Textarea placeholder="اشرح هنا خطوات التقديم. مثلاً: أرسل سيرتك الذاتية إلى البريد الإلكتروني المذكور أعلاه." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </>
        )}
    </div>
  );

  const step3Content = (
      <div className="space-y-6">
        <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-base md:text-lg"><Info className="h-5 w-5" style={{color: getThemeColor()}} />طرق التواصل</h3>
            <p className="text-sm text-muted-foreground -mt-2">
                أدخل وسيلة تواصل واحدة على الأقل. كلما أضفت طرقًا أكثر، زادت فرصة تواصل المهتمين معك.
            </p>
            <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabelIcon icon={Phone} label="رقم الهاتف (اختياري)" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
                <FormItem><FormLabelIcon icon={MessageSquare} label="رقم واتساب (اختياري)" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabelIcon icon={Mail} label="البريد الإلكتروني (اختياري)" /><FormControl><Input type="email" placeholder="example@mail.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="instagram" render={({ field }) => (
                <FormItem><FormLabelIcon icon={Instagram} label="حساب إنستغرام (اختياري)" /><FormControl><Input placeholder="username" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
             {postType === 'seeking_worker' && (
                <FormField control={form.control} name="applyUrl" render={({ field }) => (
                    <FormItem><FormLabelIcon icon={LinkIcon} label="رابط التقديم (اختياري)" /><FormControl><Input type="url" placeholder="https://example.com/apply" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
             )}
              <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
        </div>
    </div>
  );

  const stepsContent = [step1Content, step2Content, step3Content];

  return (
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            {isEditing ? (
                 <div className="p-6 md:p-8 space-y-8">
                     <h2 className="text-xl font-bold border-b pb-2">المعلومات الأساسية</h2>
                     {step1Content}
                     <Separator />
                     <h2 className="text-xl font-bold border-b pb-2">التفاصيل</h2>
                     {step2Content}
                     <Separator />
                     <h2 className="text-xl font-bold border-b pb-2">التواصل</h2>
                     {step3Content}
                     <Button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ backgroundColor: getThemeColor() }}
                        className="text-primary-foreground w-full !mt-12"
                        size="lg"
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        تحديث الإعلان
                    </Button>
                 </div>
            ) : (
                <>
                    <div className="p-6 md:p-8">
                        <StepsIndicator currentStep={currentStep} steps={steps} onStepClick={handleStepClick} themeColor={getThemeColor()} />
                    </div>
                    
                    <Separator className="mx-auto w-[calc(100%-3rem)]" />

                    <div className="p-6 flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {stepsContent[currentStep]}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-4 items-center justify-between p-6 border-t bg-muted/50 rounded-b-lg mt-auto">
                        {currentStep > 0 ? (
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ArrowRight className="ml-2 h-4 w-4" />
                                السابق
                            </Button>
                        ) : <div />}

                        {currentStep < stepsContent.length - 1 && (
                            <Button type="button" onClick={nextStep} style={{ backgroundColor: getThemeColor() }} className="text-primary-foreground">
                                التالي
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </Button>
                        )}

                        {currentStep === stepsContent.length - 1 && (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                style={{ backgroundColor: getThemeColor() }}
                                className="text-primary-foreground"
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                نشر الإعلان
                            </Button>
                        )}
                    </div>
                </>
            )}
            </form>
        </Form>
  );
}
