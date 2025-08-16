
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompetitionFiltersProps {
  className?: string;
}

export function CompetitionFilters({ className }: CompetitionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setLocation(searchParams.get('location') || '');
  }, [searchParams]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      handleFilter();
  }

  const resetFilters = () => {
    setSearchQuery('');
    setLocation('');
    router.push(pathname);
  }

  const hasFilters = searchQuery || location;

  return (
    <div className={cn(`w-full p-4 bg-muted/50 rounded-lg border`, className)}>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="ابحث عن مباراة، جهة، أو كلمة مفتاحية..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:col-span-1 bg-background"
        />
        <Input
          placeholder="ابحث بالموقع أو المدينة..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="md:col-span-1 bg-background"
        />
        <div className="flex gap-2">
            <Button type="submit" className="flex-grow">
              <Search className="ml-2 h-4 w-4" />
              بحث
            </Button>
            {hasFilters && (
                <Button type="button" variant="ghost" onClick={resetFilters}>
                    مسح
                </Button>
            )}
        </div>
      </form>
    </div>
  );
}
