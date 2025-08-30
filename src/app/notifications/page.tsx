import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
      <div className="container py-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    الإشعارات
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[50vh]">
                    <Bell className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <p>لا توجد إشعارات حالياً.</p>
                </div>
            </CardContent>
        </Card>
      </div>
  );
}
