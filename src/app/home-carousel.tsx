'use client';

import * as React from 'react';
import Link from 'next/link';
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
    authTitle: "ابدأ بنشر إعلانك الآن",
    authDescription: "أنشئ عرض عمل أو اطلب وظيفة في ثوانٍ",
    authButtonText: "أنشئ إعلانك الآن",
    authButtonLink: "/post-job/select-type",
    guestTitle: "افتح باب مستقبلك المهني الآن",
    guestDescription: "اكتشف أفضل الوظائف التي تناسب خبراتك وطموحاتك",
    guestButtonText: "سجّل الآن",
    guestButtonLink: "/signup",
    buttonClass: "bg-blue-600 hover:bg-blue-700"
  }
];

let cachedImageLoaded = false;

export function HomeCarousel() {
  const { user, loading: authLoading } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(cachedImageLoaded);
  
  React.useEffect(() => {
    setIsMounted(true);
    if (cachedImageLoaded) {
      setImageLoaded(true);
    }
  }, []);

  const handleImageLoad = () => {
    if (!cachedImageLoaded) {
      cachedImageLoaded = true;
      setImageLoaded(true);
    }
  };

  if (!isMounted || authLoading || !imageLoaded) {
    return <Skeleton className="w-full h-64 md:h-80 rounded-2xl" />;
  }

  const slide = slidesData[0];
  const title = user ? slide.authTitle : slide.guestTitle;
  const description = user ? slide.authDescription : slide.guestDescription;
  const buttonText = user ? slide.authButtonText : slide.guestButtonText;
  const buttonLink = user ? slide.authButtonLink : slide.guestButtonLink;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg relative h-64 md:h-80">
      <div className="hidden md:block w-full h-full">
        <Image
          src={slide.desktopSrc}
          alt={slide.alt}
          fill
          sizes="100vw"
          priority
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center p-12">
          <div className="w-[45%] text-white space-y-4">
            <h2 className="text-5xl font-bold leading-tight drop-shadow-md">{title}</h2>
            <p className="text-lg text-white/90 drop-shadow-sm">{description}</p>
            <Button asChild size="lg" className={cn("text-white font-semibold transition-transform hover:scale-105", slide.buttonClass)}>
              {buttonLink ? <Link href={buttonLink}>{buttonText}</Link> : <span>{buttonText}</span>}
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
          priority
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <div className="text-white space-y-2">
            <h2 className="text-2xl font-bold leading-tight drop-shadow-md">{title}</h2>
            <p className="text-sm text-white/90 drop-shadow-sm">{description}</p>
            <Button asChild size="sm" className={cn("text-white font-semibold mt-2", slide.buttonClass)}>
              {buttonLink ? <Link href={buttonLink}>{buttonText}</Link> : <span>{buttonText}</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
