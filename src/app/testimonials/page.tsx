'use client';

import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { getTestimonials } from '@/lib/data';
import { MessageSquare } from 'lucide-react';
import { TestimonialCard } from './testimonial-card';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import type { Testimonial } from '@/lib/types';
import { useEffect, useState } from 'react';

async function fetchTestimonials(): Promise<Testimonial[]> {
    return getTestimonials();
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials().then(data => setTestimonials(data));
  }, []);

  return (
    <>
      <MobilePageHeader title="آراء المستخدمين">
        <MessageSquare className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      
      <DesktopPageHeader
        icon={MessageSquare}
        title="آراء المستخدمين"
        description="نحن نقدر جميع الآراء ونسعى دائمًا لتحسين خدماتنا بناءً على ملاحظاتكم."
      />
        
      <div className="container mx-auto max-w-7xl px-4 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </>
  );
}
