
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
import { postCompetition, getOrganizers } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { 
    Loader2, Calendar as CalendarIcon, FileText, FileSignature, Info, Check, 
    ArrowLeft, ArrowRight, Building, Target, ListOrdered, FileUp, LogIn, Users2, MapPin, Briefcase 
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryIcon } from '@/components/icons';

const formSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل.'),
  organizer: z.string().min(2, 'الجهة المنظمة مطلوبة.'),
  positionsAvailable: z.coerce.number().int().positive('عدد المناصب يجب أن يكون رقمًا صحيحًا موجبًا.'),
  competitionType: z.string().optional(),
  location: z.string().optional(),
  
  description: z.string().optional(),
  jobProspects: z.string().optional(),
  
  requirements: z.string().min(10, 'الشروط مطلوبة.'),
  competitionStages: z.string().optional(),
  documentsNeeded: z.string().min(10, 'الوثائق المطلوبة.'),
  
  registrationStartDate: z.date().optional(),
  deadline: z.date({ required_error: "آخر أجل للتسجيل مطلوب." }),
  competitionDate: z.date().optional(),
  
  officialLink: z.string().url('الرابط الرسمي يجب أن يكون رابطًا صحيحًا.'),
  fileUrl: z.string().url('رابط الملف يجب أن يكون رابطًا صحيحًا.').optional().or(z.literal('')),
});

const stepFields = [
  ['title', 'organizer', 'positionsAvailable', 'competitionType', 'location'],
  ['description', 'jobProspects', 'requirements', 'competitionStages', 'documentsNeeded'],
  ['registrationStartDate', 'deadline', 'competitionDate', 'officialLink', 'fileUrl'],
];

const steps = [
    { id: 1, name: "المعلومات الأساسية", description: "تفاصيل المباراة الرئيسية.", icon: FileText },
    { id: 2, name: "الوصف والمتطلبات", description: "شروط المباراة وتفاصيلها.", icon: FileSignature },
    { id: 3, name: "التواريخ والروابط", description: "مواعيد التسجيل وروابط التقديم.", icon: CalendarIcon },
];

const sectionColor = '#14532d';

const StepsIndicator = ({ currentStep, onStepClick }: { currentStep: number; onStepClick: (step: number) => void; }) => {
  return (
    <div className="relative">
      <div className="absolute right-0 top-1/2 w-full -translate-y-1/2" aria-hidden="true">
        <div className="h-0.5 w-full bg-border" />
      </div>
      <div
        className="absolute right-0 top-1/2 h-0.5 -translate-y-1/2 transition-all duration-300"
        style={{ width: `calc(${currentStep} / ${steps.length - 1} * 100%)`, backgroundColor: sectionColor }}
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
                    backgroundColor: isCurrent || isCompleted ? sectionColor : undefined,
                    borderColor: isCurrent || isCompleted ? sectionColor : undefined,
                    color: isCurrent || isCompleted ? 'white' : undefined,
                }}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
              </button>
              <div className="hidden md:block text-center mt-2">
                <p className={cn("font-bold", isCurrent ? "text-primary" : "text-foreground")} style={{color: isCurrent ? sectionColor : undefined}}>
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


const DatePickerField = ({ name, label, control, icon: Icon }: { name: any, label: string, control: any, icon: React.ElementType }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex flex-col">
                 <FormLabelIcon icon={Icon} label={label}/>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                                {field.value ? format(field.value, "PPP") : <span>اختر تاريخًا</span>}
                                <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
        )}
    />
);

const FormLabelIcon = ({icon: Icon, label}: {icon: React.ElementType, label: string}) => (
    <FormLabel className="flex items-center gap-2 text-base md:text-lg">
      <Icon className='h-4 w-4' style={{color: sectionColor}} />
      {label}
    </FormLabel>
  );


export function PostCompetitionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const organizers = getOrganizers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      organizer: '',
      competitionType: '',
      positionsAvailable: 1,
      requirements: '',
      documentsNeeded: '',
      officialLink: '',
      description: '',
      fileUrl: '',
      location: '',
      jobProspects: '',
      competitionStages: '',
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
    setIsSubmitting(true);
    try {
      const dataToSave = {
          ...values,
          deadline: values.deadline.toISOString().split('T')[0],
          registrationStartDate: values.registrationStartDate?.toISOString().split('T')[0],
          competitionDate: values.competitionDate?.toISOString().split('T')[0],
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

  const stepsContent = [
    // Step 1
    <div className="space-y-6" key="step1">
      <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabelIcon icon={FileText} label="عنوان المباراة" /><FormControl><Input placeholder="اسم المباراة أو الإعلان الرسمي" {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="organizer" render={({ field }) => (<FormItem><FormLabelIcon icon={Building} label="الجهة المنظمة" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الجهة المنظمة من القائمة" /></SelectTrigger></FormControl><SelectContent><ScrollArea className="h-[250px]">{organizers.map(org => (<SelectItem key={org.name} value={org.name}><div className="flex items-center gap-2"><CategoryIcon name={org.icon} className="h-5 w-5" style={{color: org.color}} /> {org.name}</div></SelectItem>))}</ScrollArea></SelectContent></Select><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField control={form.control} name="positionsAvailable" render={({ field }) => (<FormItem><FormLabelIcon icon={Users2} label="عدد المناصب" /><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="competitionType" render={({ field }) => (<FormItem><FormLabelIcon icon={Briefcase} label="نوع المباراة (اختياري)" /><FormControl><Input placeholder="مفتوحة للجميع، لفئة معينة..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabelIcon icon={MapPin} label="الموقع (اختياري)" /><FormControl><Input placeholder="مكان إجراء التكوين أو المباراة" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
    </div>,
    // Step 2
    <div className="space-y-6" key="step2">
       <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabelIcon icon={Info} label="وصف تفصيلي (اختياري)" /><FormControl><Textarea placeholder="معلومات إضافية حول المباراة..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
       <FormField control={form.control} name="jobProspects" render={({ field }) => (<FormItem><FormLabelIcon icon={Target} label="أفق العمل بعد المباراة (اختياري)" /><FormControl><Textarea placeholder="المهام والوظائف المتاحة بعد التخرج أو النجاح" rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
       <FormField control={form.control} name="requirements" render={({ field }) => (<FormItem><FormLabelIcon icon={FileSignature} label="الشروط المطلوبة" /><FormControl><Textarea placeholder="المؤهلات، السن، الطول، حدة البصر..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
       <FormField control={form.control} name="competitionStages" render={({ field }) => (<FormItem><FormLabelIcon icon={ListOrdered} label="مراحل المباراة (اختياري)" /><FormControl><Textarea placeholder="الاختبارات الأولية، البدنية، الكتابية، المقابلة..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
       <FormField control={form.control} name="documentsNeeded" render={({ field }) => (<FormItem><FormLabelIcon icon={FileText} label="الوثائق المطلوبة" /><FormControl><Textarea placeholder="قائمة بالوثائق المطلوبة من المترشحين" rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
    </div>,
    // Step 3
    <div className="space-y-6" key="step3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DatePickerField name="registrationStartDate" label="تاريخ فتح التسجيل (اختياري)" control={form.control} icon={CalendarIcon} />
          <DatePickerField name="deadline" label="آخر أجل للتسجيل" control={form.control} icon={CalendarIcon} />
          <DatePickerField name="competitionDate" label="تاريخ إجراء المباراة (اختياري)" control={form.control} icon={CalendarIcon} />
      </div>
      <FormField control={form.control} name="fileUrl" render={({ field }) => (<FormItem><FormLabelIcon icon={FileUp} label="رابط ملف إضافي (PDF اختياري)" /><FormControl><Input type="url" placeholder="رابط مباشر لملف PDF رسمي" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="officialLink" render={({ field }) => (<FormItem><FormLabelIcon icon={LogIn} label="رابط التسجيل الإلكتروني" /><FormControl><Input type="url" placeholder="https://example.com/register" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
          {currentStep > 0 ? (<Button type="button" variant="outline" onClick={prevStep}><ArrowRight className="ml-2 h-4 w-4" />السابق</Button>) : <div />}
          {currentStep < steps.length - 1 ? (<Button type="button" onClick={nextStep} className="text-primary-foreground" style={{backgroundColor: sectionColor}}>التالي<ArrowLeft className="mr-2 h-4 w-4" /></Button>) : (
            <Button type="submit" disabled={isSubmitting} className="text-primary-foreground" style={{backgroundColor: sectionColor}}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              نشر المباراة
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
