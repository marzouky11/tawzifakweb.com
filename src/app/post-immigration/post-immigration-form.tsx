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
import { 
    Loader2, Plane, FileText, Globe, MapPin, Users, Calendar, Award, Wallet, Link as LinkIcon, 
    GraduationCap, ClipboardList, Info, Briefcase, Check, ArrowRight, ArrowLeft, Mail, MessageSquare, Instagram,
    Phone, HelpCircle, Target, CheckSquare,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ImmigrationPost } from '@/lib/types';
import { slugify, cn, getProgramTypeDetails, programTypes } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { CategoryIcon } from '@/components/icons';


const formSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل.'),
  targetCountry: z.string().min(2, 'الدولة المستهدفة مطلوبة.'),
  city: z.string().optional(),
  programType: z.enum(['work', 'study', 'seasonal', 'training'], { required_error: "نوع البرنامج مطلوب." }),
  
  salary: z.string().optional(),
  targetAudience: z.string().min(2, "الفئة المستهدفة مطلوبة."),
  deadline: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  tasks: z.string().optional(),
  featuresAndOpportunities: z.string().optional(),
  applyUrl: z.string().url('رابط التقديم يجب أن يكون رابطًا صحيحًا.'),
  howToApply: z.string().optional(),
  
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }).optional().or(z.literal('')),
  instagram: z.string().optional(),
}).refine(data => !!data.phone || !!data.whatsapp || !!data.email || !!data.instagram || !!data.applyUrl, {
  message: 'يجب توفير وسيلة تواصل واحدة على الأقل أو رابط للتقديم.',
  path: ['phone'],
});


interface PostImmigrationFormProps {
  post?: ImmigrationPost | null;
}

const stepFields = [
  ['title', 'targetCountry', 'city', 'programType', 'salary'],
  ['description', 'requirements', 'qualifications', 'experience', 'tasks', 'featuresAndOpportunities', 'howToApply', 'targetAudience', 'deadline'],
  ['applyUrl', 'phone', 'whatsapp', 'email', 'instagram'],
];

const steps = [
    { id: 1, name: "المعلومات الأساسية", description: "تفاصيل فرصة الهجرة.", icon: Info },
    { id: 2, name: "الوصف والمتطلبات", description: "شروط وتفاصيل البرنامج.", icon: FileText },
    { id: 3, name: "التواصل والتقديم", description: "معلومات الاتصال ورابط التسجيل.", icon: LinkIcon },
];

const sectionColor = '#0ea5e9';

const StepsIndicator = ({ currentStep, onStepClick }: { currentStep: number; onStepClick: (step: number) => void; }) => {
  return (
    <div className="relative">
      <div className="absolute right-0 top-1/2 w-full -translate-y-1/2" aria-hidden="true"><div className="h-0.5 w-full bg-border" /></div>
      <div className="absolute right-0 top-1/2 h-0.5 -translate-y-1/2 transition-all duration-300" style={{ width: `calc(${currentStep} / ${steps.length - 1} * 100%)`, backgroundColor: sectionColor }} />
      <div className="relative flex justify-between">
        {steps.map((step, stepIdx) => {
          const isCompleted = stepIdx < currentStep;
          const isCurrent = stepIdx === currentStep;
          return (
            <div key={step.name} className="flex flex-col items-center">
              <button type="button" onClick={() => stepIdx <= currentStep && onStepClick(stepIdx)} className={cn("relative z-10 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 border-2", isCurrent ? "scale-110" : "bg-muted text-muted-foreground border-border", "hover:scale-105")} style={{ backgroundColor: isCurrent || isCompleted ? sectionColor : undefined, borderColor: isCurrent || isCompleted ? sectionColor : undefined, color: isCurrent || isCompleted ? 'white' : undefined, }} aria-current={isCurrent ? "step" : undefined}>
                {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
              </button>
              <div className="hidden md:block text-center mt-2">
                <p className={cn("font-bold", isCurrent ? "text-primary" : "text-foreground")} style={{color: isCurrent ? sectionColor : undefined}}>{step.name}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FormLabelIcon = ({icon: Icon, label}: {icon: React.ElementType, label: string}) => (
    <FormLabel className="flex items-center gap-2 text-base md:text-lg">
      <Icon className='h-4 w-4' style={{color: sectionColor}} />
      {label}
    </FormLabel>
  );


export function PostImmigrationForm({ post }: PostImmigrationFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isEditing = !!post;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      targetCountry: post?.targetCountry || '',
      city: post?.city || '',
      programType: post?.programType || undefined,
      targetAudience: post?.targetAudience || '',
      deadline: post?.deadline || '',
      description: post?.description || '',
      requirements: post?.requirements || '',
      qualifications: post?.qualifications || '',
      experience: post?.experience || '',
      tasks: post?.tasks || '',
      salary: post?.salary || '',
      featuresAndOpportunities: post?.featuresAndOpportunities || '',
      applyUrl: post?.applyUrl || '',
      howToApply: post?.howToApply || '',
      phone: post?.phone || '',
      whatsapp: post?.whatsapp || '',
      email: post?.email || '',
      instagram: post?.instagram || '',
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = stepFields[currentStep] as (keyof z.infer<typeof formSchema>)[];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep < steps.length - 1) {
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
    if(isValid) setCurrentStep(stepIndex);
    else toast({ variant: "destructive", title: "حقول ناقصة", description: "الرجاء تعبئة جميع الحقول في المراحل السابقة أولاً." });
  }

  const prevStep = () => setCurrentStep(prev => prev - 1);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const dataToSave = { ...values, slug: slugify(values.title) };

      if (isEditing && post) {
        await updateImmigrationPost(post.id, dataToSave);
        toast({ title: "تم تحديث الإعلان بنجاح!" });
        router.push(`/immigration/${post.id}`);
      } else {
        const { id } = await postImmigration(dataToSave);
        toast({ title: "تم نشر الإعلان بنجاح!" });
        form.reset();
        router.push(`/immigration/${id}`);
      }
    } catch (error) {
      console.error("Failed to process immigration post:", error);
      toast({ variant: "destructive", title: "خطأ في العملية", description: `حدث خطأ غير متوقع.` });
    } finally {
      setIsSubmitting(false);
    }
  }

  const stepsContent = [
    <div className="space-y-6" key="step1">
      <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabelIcon icon={FileText} label="عنوان الفرصة" /><FormControl><Input placeholder="مثال: مطلوب عمال موسميون في كندا" {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={form.control} name="targetCountry" render={({ field }) => (<FormItem><FormLabelIcon icon={Globe} label="الدولة المستهدفة" /><FormControl><Input placeholder="مثال: كندا" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabelIcon icon={MapPin} label="المدينة (اختياري)" /><FormControl><Input placeholder="مثال: مونتريال" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
       <FormField control={form.control} name="programType" render={({ field }) => (<FormItem><FormLabelIcon icon={Briefcase} label="نوع البرنامج" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع البرنامج" /></SelectTrigger></FormControl><SelectContent>{programTypes.map(p => (<SelectItem key={p.value} value={p.value}><div className="flex items-center gap-2"><CategoryIcon name={p.icon} className="w-5 h-5" style={{ color: p.color }} /> {p.label}</div></SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
       <FormField control={form.control} name="salary" render={({ field }) => (<FormItem><FormLabelIcon icon={Wallet} label="الأجر (اختياري)" /><FormControl><Input placeholder="مثال: 3000 دولار شهريا" {...field} /></FormControl><FormMessage /></FormItem>)} />
    </div>,
    <div className="space-y-6" key="step2">
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabelIcon icon={Info} label="وصف تفصيلي للبرنامج" /><FormControl><Textarea placeholder="تفاصيل حول فرصة الهجرة، مهام العمل، مدة البرنامج..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="requirements" render={({ field }) => (<FormItem><FormLabelIcon icon={ClipboardList} label="الشروط العامة" /><FormControl><Textarea placeholder="شروط العمر، اللغة، الحالة الصحية..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="qualifications" render={({ field }) => (<FormItem><FormLabelIcon icon={GraduationCap} label="المؤهلات المطلوبة" /><FormControl><Textarea placeholder="الشهادات التعليمية المطلوبة..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabelIcon icon={Award} label="الخبرة المطلوبة" /><FormControl><Textarea placeholder="سنوات الخبرة أو نوعها..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="tasks" render={({ field }) => (<FormItem><FormLabelIcon icon={CheckSquare} label="المهام المطلوبة (اختياري)" /><FormControl><Textarea placeholder="اكتب قائمة بالمهام والمسؤوليات للوظيفة..." rows={3} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="featuresAndOpportunities" render={({ field }) => (<FormItem><FormLabelIcon icon={Target} label="المميزات والفرص" /><FormControl><Textarea placeholder="معلومات عن السكن، التأمين، فرص التدريب أو التوظيف بعد البرنامج..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="howToApply" render={({ field }) => (<FormItem><FormLabelIcon icon={HelpCircle} label="كيفية التقديم" /><FormControl><Textarea placeholder="اشرح هنا خطوات التقديم. مثلاً: أرسل سيرتك الذاتية إلى البريد الإلكتروني المذكور أعلاه." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem><FormLabelIcon icon={Users} label="الفئة المستهدفة" /><FormControl><Input placeholder="طلاب، عمال، مهنيين..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="deadline" render={({ field }) => (<FormItem><FormLabelIcon icon={Calendar} label="آخر أجل للتقديم (اختياري)" /><FormControl><Input placeholder="YYYY-MM-DD" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
    </div>,
    <div className="space-y-6" key="step3">
        <FormField control={form.control} name="applyUrl" render={({ field }) => (<FormItem><FormLabelIcon icon={LinkIcon} label="رابط التقديم الرسمي" /><FormControl><Input type="url" placeholder="https://example.com/apply" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <Separator />
        <h3 className="font-semibold flex items-center gap-2 text-base md:text-lg"><Info className="h-5 w-5" style={{color: sectionColor}} />معلومات التواصل (اختياري)</h3>
        <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabelIcon icon={Phone} label="رقم الهاتف" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="whatsapp" render={({ field }) => (<FormItem><FormLabelIcon icon={MessageSquare} label="رقم واتساب" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabelIcon icon={Mail} label="البريد الإلكتروني" /><FormControl><Input type="email" placeholder="example@mail.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormLabelIcon icon={Instagram} label="حساب إنستغرام" /><FormControl><Input placeholder="username" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
        <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
    </div>
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
         <div className="p-6 md:p-8">
          <StepsIndicator currentStep={currentStep} onStepClick={handleStepClick} />
        </div>
        <Separator className="mx-auto w-[calc(100%-3rem)]" />
        <div className="p-6 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
              {stepsContent[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-4 items-center justify-between p-6 border-t bg-muted/50 rounded-b-lg mt-auto">
          {currentStep > 0 ? (<Button type="button" variant="outline" onClick={prevStep}><ArrowRight className="ml-2 h-4 w-4" />السابق</Button>) : <div />}
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep} className="text-primary-foreground" style={{backgroundColor: sectionColor}}>التالي<ArrowLeft className="mr-2 h-4 w-4" /></Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="text-primary-foreground" style={{backgroundColor: sectionColor}}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'تحديث الإعلان' : 'نشر الإعلان'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
