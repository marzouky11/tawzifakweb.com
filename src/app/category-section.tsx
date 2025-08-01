'use client';

import React, { useState } from 'react';
import { CategoryCard } from './category-card';
import type { Category } from '@/lib/types';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategorySectionProps {
  categories: Category[];
}

const INITIAL_MOBILE_COUNT = 6;
const INITIAL_DESKTOP_COUNT = 10;

export function CategorySection({ categories }: CategorySectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    setIsClient(true);
    
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleToggleShow = () => {
    setShowAll(prev => !prev);
  };
  
  if (!isClient) {
    // Return a skeleton or null to avoid hydration mismatch, and ensure the UI doesn't jump.
    // A simple container with a fixed height could work.
    return (
        <section>
            <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                    تصفح حسب الفئة
                </h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {/* You can add skeleton loaders here for better UX */}
            </div>
        </section>
    );
  }
  
  const initialCount = isMobile ? INITIAL_MOBILE_COUNT : INITIAL_DESKTOP_COUNT;
  const displayedCategories = showAll ? categories : categories.slice(0, initialCount);
  const showToggleButton = categories.length > initialCount;

  return (
    <section>
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          تصفح حسب الفئة
        </h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {displayedCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      {showToggleButton && (
        <div className="mt-6 text-center">
          <Button onClick={handleToggleShow} variant="outline">
            {showAll ? 'عرض أقل' : 'عرض الكل'}
          </Button>
        </div>
      )}
    </section>
  );
}
