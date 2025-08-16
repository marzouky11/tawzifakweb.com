
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { getTestimonials } from '@/lib/data';
import { MessageSquare } from 'lucide-react';
import { TestimonialCard } from './testimonial-card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'آراء المستخدمين',
    description: 'شاهد ماذا يقول المستخدمون عن تجاربهم مع منصة توظيفك.',
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <AppLayout>
      <MobilePageHeader title="آراء المستخدمين">
        <MessageSquare className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      
      <DesktopPageHeader
        icon={MessageSquare}
        title="آراء المستخدمين"
        description="نحن نقدر جميع الآراء ونسعى دائمًا لتحسين خدماتنا بناءً على ملاحظاتكم."
      />
        
      <div className="container mx-auto max-w-7xl px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
