
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
import { Loader2, Calendar as CalendarIcon, FileText, FileSignature, Info, Check, ArrowLeft, ArrowRight, Building, School, Wallet, Target, ListOrdered, FileUp, LogIn, Users2, Clock, Bed, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل.'),
  organizer: z.string().min(2, 'الجهة المنظمة مطلوبة.'),
  customOrganizer: z.string().optional(),
  
  competitionType: z.string().min(2, 'نوع المباراة مطلوب.'),
  description: z.string().optional(),

  trainingSystem: z.string().optional(),
  trainingDuration: z.string().optional(),
  accommodation: z.string().optional(),
  allowance: z.string().optional(),
  location: z.string().min(2, 'الموقع مطلوب.'),
  jobProspects: z.string().optional(),
  requirements: z.string().min(10, 'الشروط مطلوبة.'),
  competitionStages: z.string().optional(),

  documentsNeeded: z.string().min(10, 'الوثائق المطلوبة.'),
  registrationStartDate: z.date().optional(),
  deadline: z.date({ required_error: "آخر أجل للتسجيل مطلوب." }),
  competitionDate: z.date().optional(),
  
  officialLink: z.string().url('الرابط الرسمي يجب أن يكون رابطًا صحيحًا.'),
  fileUrl: z.string().url('رابط الملف يجب أن يكون رابطًا صحيحًا.').optional().or(z.literal('')),
  
  positionsAvailable: z.coerce.number().int().positive('عدد المناصب يجب أن يكون رقمًا صحيحًا موجبًا.'),

}).refine(data => {
    return data.organizer !== 'أخرى' || !!data.customOrganizer;
}, {
    message: "الرجاء إدخال اسم الجهة المنظمة المخصصة.",
    path: ["customOrganizer"],
});


const stepFields = [
  ['title', 'organizer', 'customOrganizer', 'competitionType', 'description'],
  ['trainingSystem', 'trainingDuration', 'accommodation', 'allowance', 'location', 'jobProspects', 'requirements', 'competitionStages', 'positionsAvailable'],
  ['documentsNeeded', 'registrationStartDate', 'deadline', 'competitionDate', 'officialLink', 'fileUrl'],
];

const steps = [
    { id: 1, name: "المعلومات الأساسية", description: "تفاصيل المباراة الرئيسية.", icon: FileText },
    { id: 2, name: "التفاصيل الإضافية", description: "الشروط، المراحل، والأفق المهني.", icon: FileSignature },
    { id: 3, name: "الوثائق والتواريخ", description: "الملفات المطلوبة ومواعيد التسجيل.", icon: CalendarIcon },
];

const StepsIndicator = ({ currentStep, onStepClick }: { currentStep: number; onStepClick: (step: number) => void; }) => {
  return (
    <div className="relative">
      <div className="absolute right-0 top-1/2 w-full -translate-y-1/2" aria-hidden="true">
        <div className="h-0.5 w-full bg-border" />
      </div>
      <div
        className="absolute right-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-300"
        style={{ width: `calc(${currentStep} / ${steps.length - 1} * 100%)` }}
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
                  isCurrent ? "bg-primary text-primary-foreground border-primary scale-110" :
                  isCompleted ? "bg-primary text-primary-foreground border-primary" :
                  "bg-muted border-border text-muted-foreground",
                  "hover:scale-105"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
              </button>
              <div className="hidden md:block text-center mt-2">
                <p className={cn("font-bold text-sm", isCurrent ? "text-primary" : "text-foreground")}>
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
                <FormLabel className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" />{label}</FormLabel>
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
      <Icon className='h-4 w-4 text-primary' />
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
      customOrganizer: '',
      competitionType: '',
      positionsAvailable: 1,
      requirements: '',
      documentsNeeded: '',
      officialLink: '',
      description: '',
      fileUrl: '',
      location: '',
      trainingSystem: '',
      trainingDuration: '',
      accommodation: '',
      allowance: '',
      jobProspects: '',
      competitionStages: '',
    },
  });

  const selectedOrganizer = form.watch('organizer');

  const nextStep = async () => {
    const fields = stepFields[currentStep];
    const isValid = await form.trigger(fields as any);
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

    const fieldsToValidate = stepFields[currentStep] as (keyof z.infer<typeof formSchema>)[];
    const isValid = await form.trigger(fieldsToValidate);

    if(isValid) {
        setCurrentStep(stepIndex);
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const finalOrganizer = values.organizer === 'أخرى' ? values.customOrganizer : values.organizer;
      const { customOrganizer, ...restOfValues } = values;

      const dataToSave = {
          ...restOfValues,
          organizer: finalOrganizer,
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
      <div className="space-y-4">
        <FormLabelIcon icon={Building} label="الجهة المنظمة" />
        <FormField control={form.control} name="organizer" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الجهة المنظمة من القائمة" /></SelectTrigger></FormControl><SelectContent><ScrollArea className="h-[250px]">{organizers.map(org => <SelectItem key={org.name} value={org.name}>{org.name}</SelectItem>)}<SelectItem value="أخرى">جهة أخرى (مخصصة)</SelectItem></ScrollArea></SelectContent></Select><FormMessage /></FormItem>)} />
        {selectedOrganizer === 'أخرى' && (<FormField control={form.control} name="customOrganizer" render={({ field }) => (<FormItem><FormControl><Input placeholder="أدخل اسم الجهة المخصصة" {...field} /></FormControl><FormMessage /></FormItem>)} />)}
      </div>
      <FormField control={form.control} name="competitionType" render={({ field }) => (<FormItem><FormLabelIcon icon={Info} label="نوع المباراة" /><FormControl><Input placeholder="مفتوحة للجميع، لفئة معينة..." {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabelIcon icon={FileSignature} label="وصف تفصيلي (اختياري)" /><FormControl><Textarea placeholder="معلومات إضافية حول المباراة..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
    </div>,
    // Step 2
    <div className="space-y-6" key="step2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={form.control} name="trainingSystem" render={({ field }) => (<FormItem><FormLabelIcon icon={School} label="نظام التكوين" /><FormControl><Input placeholder="مثال: تكوين عسكري، شبه عسكري..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="trainingDuration" render={({ field }) => (<FormItem><FormLabelIcon icon={Clock} label="مدة التكوين" /><FormControl><Input placeholder="مثال: سنتان" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={form.control} name="accommodation" render={({ field }) => (<FormItem><FormLabelIcon icon={Bed} label="الإقامة والأكل" /><FormControl><Input placeholder="مثال: داخلية، خارجية..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="allowance" render={({ field }) => (<FormItem><FormLabelIcon icon={Wallet} label="المنحة / الأجر" /><FormControl><Input placeholder="مثال: 3000 درهم شهريا" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabelIcon icon={MapPin} label="مقر المعهد / المدينة" /><FormControl><Input placeholder="مكان إجراء التكوين أو المباراة" {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="jobProspects" render={({ field }) => (<FormItem><FormLabelIcon icon={Target} label="أفق العمل بعد المباراة" /><FormControl><Textarea placeholder="المهام والوظائف المتاحة بعد التخرج أو النجاح" rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="requirements" render={({ field }) => (<FormItem><FormLabelIcon icon={Info} label="الشروط المطلوبة" /><FormControl><Textarea placeholder="المؤهلات، السن، الطول، حدة البصر..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="competitionStages" render={({ field }) => (<FormItem><FormLabelIcon icon={ListOrdered} label="مراحل المباراة" /><FormControl><Textarea placeholder="الاختبارات الأولية، البدنية، الكتابية، المقابلة..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="positionsAvailable" render={({ field }) => (<FormItem><FormLabelIcon icon={Users2} label="عدد المناصب" /><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
    </div>,
    // Step 3
    <div className="space-y-6" key="step3">
      <FormField control={form.control} name="documentsNeeded" render={({ field }) => (<FormItem><FormLabelIcon icon={FileText} label="الوثائق المطلوبة" /><FormControl><Textarea placeholder="قائمة بالوثائق المطلوبة من المترشحين" rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DatePickerField name="registrationStartDate" label="تاريخ فتح التسجيل" control={form.control} icon={CalendarIcon} />
          <DatePickerField name="deadline" label="آخر أجل للتسجيل" control={form.control} icon={CalendarIcon} />
          <DatePickerField name="competitionDate" label="تاريخ إجراء المباراة" control={form.control} icon={CalendarIcon} />
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
          {currentStep < steps.length - 1 ? (<Button type="button" onClick={nextStep}>التالي<ArrowLeft className="mr-2 h-4 w-4" /></Button>) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              نشر المباراة
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
