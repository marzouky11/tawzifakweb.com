
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
      {photoURL ? (
        <AvatarImage src={photoURL} alt={name || 'User Avatar'} />
      ) : null}
      <AvatarFallback 
        style={style} 
        className={cn(
          "text-white font-bold", 
          !photoURL && color && "bg-transparent",
          // Add flex centering to ensure the initial is perfectly centered
          "flex items-center justify-center"
        )}
      >
        {initials ? (
          // The size of the initial will be controlled by the `className` prop on the component
          // e.g., <UserAvatar className="h-16 w-16 text-2xl" />
          <span>{initials}</span>
        ) : (
          <User className="h-[60%] w-[60%]" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
