
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Star, Users, MessageSquare, Landmark } from 'lucide-react';
import { motion, useInView } from "framer-motion";
import type { Testimonial } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TestimonialCard } from '@/app/testimonials/testimonial-card';

// CountUp component for animating numbers
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
            setCount(end); // Ensure it ends on the exact number  
            clearInterval(timer);  
        }  
    }, frameDuration);  

    return () => clearInterval(timer);

  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString('ar-EG')}</span>;
};

// Stats Section Component
function StatsSection({ stats }: { stats: { jobs: number, competitions: number, seekers: number } }) {
  const statItems = [
    {
      label: "عرض عمل منشور",
      count: stats.jobs,
      icon: Briefcase,
      color: "#0D47A1", // Dark Blue for Job Offers
    },
    {
      label: "مباراة عمومية",
      count: stats.competitions,
      icon: Landmark,
      color: "#14532d", // Dark Green for Competitions
    },
    {
      label: "باحث عن عمل",
      count: stats.seekers,
      icon: Users,
      color: "#424242", // Dark Gray for Job Seekers
    }
  ];

  return (
    <section className="relative overflow-hidden py-8 bg-muted/50 rounded-2xl">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card 
                className="p-6 text-center flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl border-transparent border bg-background"
                style={{'--stat-color': item.color} as React.CSSProperties}
              >
                <div 
                    className="p-4 rounded-full"
                    style={{ backgroundColor: `${item.color}1A`, color: item.color }}
                >
                  <item.icon className="h-10 w-10" />
                </div>
                <p className="text-lg font-semibold text-foreground">{item.label}</p>
                <div 
                    className="text-5xl font-bold"
                    style={{ color: item.color }}
                >
                  <CountUp end={item.count} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Component
const INITIAL_DISPLAY_COUNT_MOBILE = 2;
const INITIAL_DISPLAY_COUNT_DESKTOP = 3;

function TestimonialsSection({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  const displayedTestimonials = initialTestimonials.slice(0, INITIAL_DISPLAY_COUNT_DESKTOP);

  return (
    <section ref={ref} className="py-6">
      <div className="container mx-auto px-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground">ماذا يقول مستخدمونا؟</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">آراؤكم هي مصدر إلهامنا ووقودنا للتطور المستمر.</p>
        </motion.div>

        {initialTestimonials.length > 0 ? (  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">  
            {displayedTestimonials.map((testimonial, index) => (  
              <motion.div  
                key={testimonial.id}  
                custom={index}  
                initial={{ opacity: 0, y: 50 }}  
                animate={isInView ? { opacity: 1, y: 0 } : {}}  
                transition={{ duration: 0.5, delay: index * 0.2 }}  
                className={cn(  
                  index >= INITIAL_DISPLAY_COUNT_DESKTOP ? 'hidden lg:block' : '',  
                  index >= INITIAL_DISPLAY_COUNT_MOBILE ? 'hidden md:block' : '',  
                  'lg:block'  
                )}  
              >  
                <TestimonialCard testimonial={testimonial} />  
              </motion.div>  
            ))}  
          </div>  
        ) : (  
          <Card className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">  
            <MessageSquare className="w-16 h-16 text-muted-foreground/30" />  
            <p className="text-lg">كن أول من يشاركنا رأيه في المنصة!</p>  
          </Card>  
        )}  

        <div className="mt-10 text-center flex flex-col sm:flex-row justify-center items-center gap-4">  
          <Button asChild variant="outline" size="lg">  
            <Link href="/testimonials">عرض كل الآراء</Link>  
          </Button>  
          <Button asChild size="lg">  
            <Link href="/add-testimonial">أضف رأيك</Link>  
          </Button>  
        </div>  
      </div>  
    </section>
  );
}

interface HomeExtraSectionsProps {
  testimonials: Testimonial[];
  jobOffersCount: number;
  competitionsCount: number;
  jobSeekersCount: number;
}

// Main component to export
export function HomeExtraSections({ testimonials, jobOffersCount, competitionsCount, jobSeekersCount }: HomeExtraSectionsProps) {
  const stats = { jobs: jobOffersCount, competitions: competitionsCount, seekers: jobSeekersCount };

  return (  
    <div className="space-y-6">  
      <StatsSection stats={stats} />  
      <TestimonialsSection initialTestimonials={testimonials} />  
    </div>  
  );
                          }
