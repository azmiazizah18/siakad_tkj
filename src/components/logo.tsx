import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <GraduationCap className="h-6 w-6" />
      <span className="text-xl font-bold tracking-tight">
        SIAKAD TKJ
      </span>
    </div>
  );
}
