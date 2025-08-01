
import type { Metadata } from 'next';
import { getCategories } from '@/lib/data';
import PostJobClientPage from './post-job-client-page';
import { Suspense } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'أنشر إعلان وظيفة مجانًا في الوطن العربي – استقطب موظفين بسرعة',
  description: 'سواء كنت شركة أو فرد، أنشر إعلانك الوظيفي مجاناً على منصتنا ووصل لملايين الباحثين عن عمل في الدول العربية.',
};

function PostJobPageFallback() {
    return (
        <AppLayout>
            <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </AppLayout>
    )
}

export default function PostJobPage() {
    const categories = getCategories();
    return (
        <Suspense fallback={<PostJobPageFallback />}>
            <PostJobClientPage categories={categories} />
        </Suspense>
    );
}

