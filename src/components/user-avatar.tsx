
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  photoURL?: string | null;
  color?: string;
  className?: string;
}

export function UserAvatar({ name, photoURL, color, className }: UserAvatarProps) {
  const initials = getInitials(name);
  const style = color ? { backgroundColor: color } : {};

  return (
    <Avatar className={cn('bg-muted', className)}>
      <AvatarImage src={photoURL || undefined} alt={name || 'User Avatar'} />
      <AvatarFallback style={style} className="text-white font-bold flex items-center justify-center">
        {initials ? (
          <span className="text-[55%]">{initials}</span>
        ) : (
          <User className="h-[60%] w-[60%]" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
