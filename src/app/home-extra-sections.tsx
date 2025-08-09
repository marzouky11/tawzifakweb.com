'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, Users } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import type { Testimonial } from '@/lib/types';
import { TestimonialCard } from '@/app/testimonials/testimonial-card';

// عداد CountUp مع تأثير دخول بالعرض
const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration * 1000 / frameDuration);
    const increment = (end - start) / totalFrames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      start += increment;
      setCount(Math.floor(start));
      if (currentFrame === totalFrames) {
        setCount(end);
        clearInterval(timer);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString('ar-EG')}</span>;
};

// قسم الإحصائيات
function StatsSection({ stats }: { stats: { jobs: number, seekers: number } }) {
  return (
    <section
      className="relative overflow-hidden py-12 pb-4 bg-muted/50 rounded-2xl"
      style={{ marginBottom: 0, paddingBottom: '1rem' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
      ></div>
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground">منصتنا بالأرقام</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">نحن ننمو كل يوم بفضل ثقتكم، ونسعى لربط الكفاءات بأفضل الفرص.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 text-center flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent border-transparent border bg-background">
              <div className="p-4 bg-accent/10 rounded-full text-accent">
                <Briefcase className="h-10 w-10" />
              </div>
              <p className="text-lg font-semibold text-foreground">عرض عمل منشور</p>
              <div className="text-5xl font-bold text-accent">
                <CountUp end={stats.jobs} />
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 text-center flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-destructive border-transparent border bg-background">
              <div className="p-4 bg-destructive/10 rounded-full text-destructive">
                <Users className="h-10 w-10" />
              </div>
              <p className="text-lg font-semibold text-foreground">باحث عن عمل</p>
              <div className="text-5xl font-bold text-destructive">
                <CountUp end={stats.seekers} />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// قسم الشهادات (التقييمات)
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <section ref={ref} className="pt-8 pb-0" style={{ marginBottom: 0 }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground">آراء المستخدمين</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">تعرف على تجارب وآراء من استفاد من خدماتنا.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

// المكون الرئيسي للصفحة
export default function HomeExtraSections({
  testimonials,
  stats,
}: {
  testimonials: Testimonial[];
  stats: { jobs: number; seekers: number };
}) {
  return (
    <main
      className="w-full max-w-7xl mx-auto px-4 mb-0"
      style={{ marginBottom: 0, paddingBottom: 0 }}
    >
      <StatsSection stats={stats} />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
