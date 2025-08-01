import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة',
  description: 'إجابات على الأسئلة الأكثر شيوعًا حول استخدام منصة توظيفك، وكيفية نشر الإعلانات، وإدارة حسابك.',
};

const faqs = [
    {
        question: 'كيف يمكنني نشر إعلان جديد؟',
        answer: 'يمكنك نشر إعلان جديد بسهولة بالضغط على زر "إضافة" في الشريط السفلي (للهاتف) أو زر "نشر إعلان" في الأعلى (للحاسوب). بعد ذلك، املأ النموذج بالمعلومات المطلوبة واضغط على "نشر".'
    },
    {
        question: 'هل استخدام منصة "توظيفك" مجاني؟',
        answer: 'نعم، حاليًا جميع خدمات المنصة، بما في ذلك نشر الإعلانات وتصفحها، مجانية تمامًا لكل من أصحاب العمل والباحثين عن عمل.'
    },
    {
        question: 'كيف يمكنني تعديل إعلاني بعد نشره؟',
        answer: 'لتعديل إعلانك، اذهب إلى صفحة "الإعدادات" أو ملفك الشخصي. ستجد قسم "إعلاناتي" الذي يعرض جميع إعلاناتك، مع زر "تعديل" بجانب كل إعلان.'
    },
    {
        question: 'كيف يمكنني حذف إعلاني؟',
        answer: 'لحذف إعلان، اذهب إلى صفحة "الإعدادات"، ثم إلى قسم "إعلاناتي". ستجد زر "حذف" بجانب كل إعلان. يرجى العلم أن هذا الإجراء نهائي ولا يمكن التراجع عنه.'
    },
    {
        question: 'ماذا أفعل إذا واجهت إعلانًا مشبوهًا أو احتياليًا؟',
        answer: 'إذا واجهت إعلانًا تعتقد أنه مخالف، يرجى استخدام زر "إبلاغ عن إعلان" الموجود في صفحة تفاصيل الإعلان. سيقوم فريقنا بمراجعة البلاغ واتخاذ الإجراء المناسب.'
    }
]

export default function FaqPage() {
  return (
    <AppLayout>
      <MobilePageHeader title="الأسئلة الشائعة">
        <HelpCircle className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={HelpCircle}
        title="الأسئلة الشائعة"
        description="هنا تجد إجابات على الأسئلة الأكثر شيوعًا حول استخدام المنصة."
      />
      <div className="container mx-auto max-w-3xl px-4 pb-8">
        <Card>
          <CardHeader className="md:hidden">
            <h1 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              الأسئلة الشائعة
            </h1>
          </CardHeader>
          <CardContent className="md:pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
