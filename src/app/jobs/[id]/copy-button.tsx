'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clipboard } from 'lucide-react';

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({
              title: 'تم النسخ!',
              description: 'تم نسخ الرقم إلى الحافظة.',
            });
        });
    }
  };

  return (
    <Button onClick={handleCopy} variant="outline" className="flex-grow">
      <Clipboard className="ml-2 h-4 w-4" />
      نسخ الرقم
    </Button>
  );
}
