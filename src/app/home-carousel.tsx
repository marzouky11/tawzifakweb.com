
'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

const slidesData = [
  {
    key: 'main',
    src: "/slide1.webp",
    alt: "شخص يبدأ رحلته المهنية",
    hint: "professional journey start",
    authTitle: "ابدأ بنشر إعلانك الآن",
    authDescription: "أنشئ عرض عمل أو اطلب وظيفة في ثوانٍ",
    authButtonText: "أنشئ إعلانك الآن",
    authButtonLink: "/post-job/select-type",
    guestTitle: "افتح باب مستقبلك المهني الآن",
    guestDescription: "اكتشف أفضل الوظائف التي تناسب خبراتك وطموحاتك",
    guestButtonText: "سجّل الآن",
    guestButtonLink: "/signup",
    buttonClass: "bg-blue-600 hover:bg-blue-700"
  },
  {
    key: 'explore-workers',
    src: "/slide2.webp",
    alt: "وظائف مميزة",
    hint: "professional worker",
    title: "وظائف مميزة بانتظارك",
    description: "استكشف الفرص المناسبة لمهاراتك واهتماماتك",
    buttonText: "استكشف الآن",
    buttonLink: "/jobs",
    buttonClass: "bg-green-600 hover:bg-green-700"
  },
  {
    key: 'explore-jobs',
    src: "/slide3.webp",
    alt: "عمال محترفون",
    hint: "job opportunities",
    title: "عمّال محترفون في جميع المجالات",
    description: "من البناء إلى التقنية – الجميع هنا",
    buttonText: "استكشف الآن",
    buttonLink: "/workers",
    buttonClass: "bg-red-600 hover:bg-red-700"
  },
  {
    key: 'cv-builder',
    src: "/slide4.webp",
    alt: "إنشاء سيرة ذاتية احترافية",
    hint: "cv builder",
    title: "أنشئ سيرتك الذاتية بسهولة",
    description: "استخدم أداتنا المجانية لإنشاء سيرة ذاتية احترافية تجذب انتباه أصحاب العمل.",
    buttonText: "أنشئ سيرتك الذاتية الآن",
    buttonLink: "/cv-builder",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600"
  }
];

export function HomeCarousel() {
  const { user, loading: authLoading } = useAuth();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
  );

  if (authLoading) {
    return <Skeleton className="w-full h-64 md:h-80 rounded-2xl" />;
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full rounded-2xl overflow-hidden shadow-lg"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play(true)}
      opts={{
        loop: true,
        direction: 'rtl',
      }}
    >
      <CarouselContent>
        {slidesData.map((slide, index) => {
          const isFirstSlideAuth = index === 0;
          const title = isFirstSlideAuth ? (user ? slide.authTitle : slide.guestTitle) : slide.title;
          const description = isFirstSlideAuth ? (user ? slide.authDescription : slide.guestDescription) : slide.description;
          const buttonText = isFirstSlideAuth ? (user ? slide.authButtonText : slide.guestButtonText) : slide.buttonText;
          const buttonLink = isFirstSlideAuth ? (user ? slide.authButtonLink : slide.guestButtonLink) : slide.buttonLink;

          return (
            <CarouselItem key={slide.key}>
              <div className="relative h-64 md:h-80">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  data-ai-hint={slide.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center p-6 md:p-12">
                  <div className="max-w-md md:max-w-lg text-white space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-md">{title}</h2>
                    <p className="text-base md:text-lg text-white/90 drop-shadow-sm">{description}</p>
                    <Button asChild size="lg" className={cn("text-white font-semibold transition-transform hover:scale-105", slide.buttonClass)}>
                      <Link href={buttonLink!}>{buttonText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
