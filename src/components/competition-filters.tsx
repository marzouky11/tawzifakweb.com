

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CompetitionFiltersProps {
  className?: string;
}

export function CompetitionFilters({ className }: CompetitionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setLocation(searchParams.get('location') || '');
  }, [searchParams]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    router.push(`${pathname}?${params.toString()}`);
    setIsSheetOpen(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      handleFilter();
  }

  const resetFilters = () => {
    setSearchQuery('');
    setLocation('');
    router.push(pathname);
    setIsSheetOpen(false);
  }

  const hasFilters = !!searchQuery || !!location;

  return (
    <div className={cn(`flex gap-2 items-center`, className)}>
      <form onSubmit={handleSearch} className="flex-grow flex gap-2">
        <div className="relative w-full flex-grow">
          <Input
            placeholder="ابحث عن مباراة، جهة، أو كلمة مفتاحية..."
            className="h-14 text-base rounded-xl pl-4 pr-14 border bg-background shadow-lg focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
           <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button type="submit" size="icon" variant="ghost" className="rounded-full h-10 w-10">
                  <Search className="h-5 w-5 text-primary" />
              </Button>
          </div>
        </div>
      </form>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-14 w-14 flex-shrink-0 shadow-lg rounded-xl border bg-background p-0">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80svh] flex flex-col">
          <SheetHeader>
            <SheetTitle>فلترة النتائج</SheetTitle>
            <SheetDescription>
              قم بتحديد خيارات البحث للعثور على ما يناسبك.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto pr-6 space-y-6">
            <div className="grid gap-4 py-4">
               <div>
                  <Label htmlFor="location-filter" className="mb-2 block">الموقع</Label>
                  <Input 
                      id="location-filter"
                      placeholder="اكتب اسم المدينة أو المنطقة"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
            </div>
             {hasFilters && (
                <Button type="button" variant="ghost" onClick={resetFilters} className="w-full">
                    مسح كل الفلاتر
                </Button>
            )}
          </div>
          <SheetFooter className="mt-4 pt-4 border-t">
            <SheetClose asChild>
              <Button type="button" onClick={handleFilter} size="lg" className="w-full">عرض النتائج</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

