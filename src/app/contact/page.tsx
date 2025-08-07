
'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export default function ContactUsPage() {
  const email = 'tawzifakweb@gmail.com';

  return (
    <AppLayout>
      <MobilePageHeader title="اتصل بنا">
        <Mail className="h-5 w-5 text-primary" />
      </MobilePageHeader>
       <DesktopPageHeader
        icon={Mail}
        title="اتصل بنا"
        description="نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو اقتراح."
      />
      <div className="container mx-auto max-w-3xl px-4 pb-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-red-600 md:text-3xl">
              <Mail className="h-6 w-6" />
              اتصل بنا
            </h1>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-green-600 prose-a:text-primary pt-0 md:pt-2">
            
            <p>
                في "توظيفك"، نؤمن بأن التواصل الفعّال هو أساس بناء علاقة قوية ومستدامة مع مستخدمينا. سواء كنت صاحب عمل، أو باحثًا عن فرصة، أو مجرد زائر مهتم، فإن ملاحظاتك، استفساراتك، واقتراحاتك هي محركنا الأساسي للتطور والتحسين. نحن هنا لنستمع إليك ونقدم لك الدعم الذي تحتاجه في كل خطوة.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3 text-green-600">لماذا قد تحتاج إلى التواصل معنا؟</h3>
            <p>
                قد تكون لديك العديد من الأسباب التي تدفعك للتواصل مع فريقنا، ويسعدنا دائمًا أن نكون في خدمتك. من بين هذه الأسباب:
            </p>
            <ul className="list-disc pr-5 space-y-2 mb-4">
                <li>
                    <strong>استفسارات عامة:</strong> إذا كان لديك أي سؤال حول كيفية عمل المنصة، أو طريقة التسجيل، أو كيفية نشر إعلان فعال.
                </li>
                <li>
                    <strong>دعم فني:</strong> إذا واجهت أي مشكلة تقنية أثناء استخدامك للموقع، مثل صعوبة في تحميل الوثائق، أو خطأ في عرض صفحة ما.
                </li>
                <li>
                    <strong>اقتراحات للتطوير:</strong> نحن نرحب دائمًا بأفكارك الجديدة. إذا كانت لديك فكرة لميزة جديدة أو تحسين لواجهة المستخدم، فلا تتردد في مشاركتها معنا.
                </li>
                <li>
                    <strong>الإبلاغ عن محتوى:</strong> إذا صادفت إعلانًا تشعر أنه مخالف لشروطنا، أو احتيالي، أو غير لائق، فإن إبلاغك يساعدنا في الحفاظ على بيئة آمنة وموثوقة للجميع.
                </li>
                <li>
                    <strong>فرص شراكة:</strong> إذا كنت تمثل مؤسسة أو شركة وترغب في استكشاف فرص للتعاون أو الشراكة مع "توظيفك"، فنحن منفتحون لمناقشة الأفكار المبتكرة.
                </li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3 text-green-600">كيفية التواصل معنا: الطريقة الأفضل والأسرع</h3>
            <p>
              الطريقة الأكثر فعالية وموثوقية للتواصل مع فريق الدعم في "توظيفك" هي عبر البريد الإلكتروني. يضمن لك البريد الإلكتروني وصول رسالتك بشكل منظم إلى القسم المختص، كما يتيح لنا تتبع طلبك والرد عليه في أسرع وقت ممكن.
            </p>
            
            <div className="text-center my-6">
              <Button asChild size="lg">
                <a href={`mailto:${email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  {email}
                </a>
              </Button>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3 text-green-600">ماذا تتوقع بعد إرسال رسالتك؟</h3>
            <p>
                بمجرد إرسال بريدك الإلكتروني، سيقوم نظامنا بتسجيل طلبك وتوجيهه إلى الشخص المسؤول. نحن نسعى جاهدين للرد على جميع الاستفسارات خلال 24 إلى 48 ساعة عمل. لضمان حصولك على رد سريع وفعّال، يرجى تضمين المعلومات التالية في رسالتك:
            </p>
            <ol className="list-decimal pr-5 space-y-2 mb-4">
                <li>
                    <strong>عنوان واضح للرسالة:</strong> على سبيل المثال، "مشكلة في تسجيل الدخول" أو "اقتراح بخصوص الفلاتر".
                </li>
                <li>
                    <strong>وصف تفصيلي للمشكلة أو الاستفسار:</strong> كلما كانت التفاصيل أوضح، كان من الأسهل علينا فهم طلبك وحله.
                </li>
                <li>
                    <strong>معلومات حسابك (اختياري):</strong> إذا كان استفسارك يتعلق بحساب معين، فإن تزويدنا بالبريد الإلكتروني المستخدم في التسجيل يمكن أن يسرّع من عملية الدعم. (لا تشارك كلمة المرور أبدًا).
                </li>
                 <li>
                    <strong>لقطات شاشة (إذا أمكن):</strong> في حال واجهت خطأ تقنيًا، فإن إرفاق لقطة شاشة للمشكلة يساعد فريقنا الفني على تشخيصها بدقة.
                </li>
            </ol>

            <h3 className="text-xl font-bold mt-6 mb-3 text-green-600">قنوات أخرى للمتابعة</h3>
            <p>
                بالإضافة إلى البريد الإلكتروني، يمكنك متابعة آخر أخبارنا وتحديثاتنا عبر منصات التواصل الاجتماعي (سيتم إطلاقها قريبًا). سنعلن عن أي ميزات جديدة أو فرص مهمة عبر هذه القنوات.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3 text-green-600">أسئلة شائعة قد تجيب على استفسارك</h3>
            <p>
              قبل إرسال رسالتك، قد تجد إجابة سريعة على سؤالك في صفحة <Link href="/faq">الأسئلة الشائعة</Link>. لقد قمنا بتجميع قائمة بأكثر الأسئلة التي تصلنا من المستخدمين مع إجابات واضحة ومباشرة، والتي تغطي جوانب مثل كيفية نشر إعلان، تعديل الحساب، وحذف الإعلانات.
            </p>
            
            <p>
                نحن في "توظيفك" نقدّر وقتك وثقتك، ونتعهد ببذل قصارى جهدنا لتقديم تجربة مستخدم سلسة وممتعة. لا تتردد في التواصل معنا، فصوتك هو جزء أساسي من نجاحنا.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
