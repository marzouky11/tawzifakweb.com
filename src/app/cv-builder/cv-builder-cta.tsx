
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';

export function CvBuilderCta() {
  return (
    <div className="mt-8">
      <Card className="bg-gradient-to-tr from-muted/50 to-background shadow-lg border">
        <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
                 <div className="p-3 bg-primary/10 rounded-full w-fit">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
            </div>
          <h3 className="text-xl font-bold">هل تحتاج إلى سيرة ذاتية احترافية؟</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            استخدم أداتنا المجانية لإنشاء سيرة ذاتية مميزة في دقائق وجذب انتباه أصحاب العمل.
          </p>
          <Button asChild>
            <Link href="/cv-builder">
              أنشئ سيرتك الذاتية الآن
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
