'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const slidesData = [
  {
    key: 'main',
    desktopSrc: "/web1.png",
    mobileSrc: "/Sliderphone1.jpg",
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
    desktopSrc: "/web2.png",
    mobileSrc: "/Sliderphone2.png",
    alt: "وظائف مميزة",
    hint: "professional worker",
    title: "وظائف مميزة بانتظارك",
    description: "استكشف الفرص المناسبة لمهاراتك واهتماماتك",
    buttonText: "استكشف الآن",
    buttonLink: "/jobs",
    buttonClass: "bg-[#0D47A1] hover:bg-[#0D47A1]/90"
  },
  {
    key: 'competitions',
    desktopSrc: "/web5.png",
    mobileSrc: "/Sliderphone5.jpg",
    alt: "المباريات العمومية",
    hint: "public competitions",
    title: "تصفح المباريات العمومية",
    description: "اكتشف آخر مباريات التوظيف في القطاع العام.",
    buttonText: "استكشف الآن",
    buttonLink: "/competitions",
    buttonClass: "bg-green-600 hover:bg-green-700"
  },
  {
    key: 'explore-jobs',
    desktopSrc: "/web3.png",
    mobileSrc: "/Sliderphone3.png",
    alt: "عمال محترفون",
    hint: "job opportunities",
    title: "عمّال محترفون في جميع المجالات",
    description: "من البناء إلى التقنية – الجميع هنا",
    buttonText: "استكشف الآن",
    buttonLink: "/workers",
    buttonClass: "bg-[#424242] hover:bg-[#424242]/90"
  },
  {
    key: 'cv-builder',
    desktopSrc: "/web4.png",
    mobileSrc: "/Sliderphone4.jpg",
    alt: "إنشاء سيرة ذاتية احترافية",
    hint: "cv builder",
    title: "أنشئ سيرتك الذاتية بسهولة",
    description: "استخدم أداتنا المجانية لإنشاء سيرة ذاتية",
    buttonText: "أنشئ سيرتك الذاتية الآن",
    buttonLink: "/cv-builder",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600"
  }
];

export function HomeCarousel() {
  const { user, loading: authLoading } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
  );
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || authLoading) {
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
      key="static-carousel"
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
                <div className="hidden md:block w-full h-full">
                  <Image
                    src={slide.desktopSrc}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="absolute inset-0 w-full h-full object-cover"
                    data-ai-hint={slide.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center p-12">
                    <div className="w-[45%] text-white space-y-4">
                      <h2 className="text-5xl font-bold leading-tight drop-shadow-md">{title}</h2>
                      <p className="text-lg text-white/90 drop-shadow-sm">{description}</p>
                      <Button asChild size="lg" className={cn("text-white font-semibold transition-transform hover:scale-105", slide.buttonClass)}>
                        {buttonLink ? (
                          <Link href={buttonLink}>{buttonText}</Link>
                        ) : (
                          <span>{buttonText}</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="md:hidden w-full h-full">
                  <Image
                    src={slide.mobileSrc}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="absolute inset-0 w-full h-full object-cover"
                    data-ai-hint={slide.hint}
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                    <div className="text-white space-y-2">
                      <h2 className="text-2xl font-bold leading-tight drop-shadow-md">{title}</h2>
                      <p className="text-sm text-white/90 drop-shadow-sm">{description}</p>
                      <Button asChild size="sm" className={cn("text-white font-semibold mt-2", slide.buttonClass)}>
                        {buttonLink ? (
                          <Link href={buttonLink}>{buttonText}</Link>
                        ) : (
                          <span>{buttonText}</span>
                        )}
                      </Button>
                    </div>
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
