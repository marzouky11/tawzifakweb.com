
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category, WorkType, SortByType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface JobFiltersProps {
  categories: Category[];
  className?: string;
  showPostTypeSelect?: boolean;
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

export function JobFilters({ categories, className, showPostTypeSelect = false }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState('all');
  
  const [postTypePath, setPostTypePath] = useState('/jobs');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedCountry(searchParams.get('country') || '');
    setSelectedCity(searchParams.get('city') || '');
    setSelectedWorkType(searchParams.get('workType') || 'all');
    
    if (pathname.startsWith('/workers')) {
      setPostTypePath('/workers');
    } else if (pathname.startsWith('/competitions')) {
      setPostTypePath('/competitions');
    } else {
      setPostTypePath('/jobs');
    }
  }, [searchParams, pathname]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    
    const targetPath = showPostTypeSelect ? postTypePath : pathname;

    if(targetPath !== '/competitions') {
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedCountry) params.set('country', selectedCountry);
      if (selectedCity) params.set('city', selectedCity);
      if (selectedWorkType && selectedWorkType !== 'all') params.set('workType', selectedWorkType);
    }
    
    router.push(`${targetPath}?${params.toString()}`);
    setIsSheetOpen(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      handleFilter();
  }
  
  const showAdvancedFilters = postTypePath !== '/competitions';

  return (
    <div className={cn(`flex gap-2 items-center`, className)}>
      <form onSubmit={handleSearch} className="flex-grow flex gap-2">
        <div className="relative w-full flex-grow">
          <Input
            placeholder="ابحث عن وظيفة، عامل، أو مباراة..."
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
              {showPostTypeSelect && (
                <div>
                  <Label className="mb-2 block">ماذا تبحث عنه؟</Label>
                  <RadioGroup value={postTypePath} onValueChange={setPostTypePath} dir="rtl" className="flex gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="/jobs" id="r_jobs" />
                      <Label htmlFor="r_jobs" className="font-normal cursor-pointer">وظائف</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="/workers" id="r_workers" />
                      <Label htmlFor="r_workers" className="font-normal cursor-pointer">عمّال</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="/competitions" id="r_competitions" />
                      <Label htmlFor="r_competitions" className="font-normal cursor-pointer">مباريات</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <AnimatePresence>
                {showAdvancedFilters && (
                   <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country-filter" className="mb-2 block">الدولة</Label>
                          <Input 
                              id="country-filter"
                              placeholder="اكتب الدولة"
                              value={selectedCountry}
                              onChange={(e) => setSelectedCountry(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city-filter" className="mb-2 block">المدينة</Label>
                          <Input
                              id="city-filter"
                              placeholder="اكتب المدينة"
                              value={selectedCity}
                              onChange={(e) => setSelectedCity(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category" className="mb-2 block">الفئة</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger id="category"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value="all">الكل</SelectItem>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                          <Label className="mb-2 block">طبيعة العمل</Label>
                          <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
                            <SelectTrigger><SelectValue placeholder="اختر طبيعة العمل" /></SelectTrigger>
                            <SelectContent position="item-aligned">
                              <SelectItem value="all">الكل</SelectItem>
                              {Object.entries(workTypeTranslations).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
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
