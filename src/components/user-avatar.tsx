
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
  const style = color && !photoURL ? { backgroundColor: color } : {};

  return (
    <Avatar className={cn('bg-muted', className)}>
      {photoURL && <AvatarImage src={photoURL} alt={name || 'User Avatar'} />}
      <AvatarFallback style={style} className={cn("text-white font-bold", !photoURL && color && "bg-transparent")}>
        {initials ? (
          <div className="flex items-center justify-center h-full w-full text-xl">
            {initials}
          </div>
        ) : (
          <User className="h-[60%] w-[60%]" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
