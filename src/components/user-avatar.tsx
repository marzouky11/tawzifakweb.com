'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string;
  color?: string;
  className?: string;
}

export function UserAvatar({ name, color, className }: UserAvatarProps) {
  const initials = getInitials(name);
  const style = color ? { backgroundColor: color } : {};

  return (
    <Avatar className={cn('bg-muted', className)}>
      <AvatarFallback style={style} className="text-white font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
