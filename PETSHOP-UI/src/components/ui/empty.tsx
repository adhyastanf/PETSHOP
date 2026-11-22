import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

function Empty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty'
      className={cn('flex min-w-0 flex-col items-center justify-center gap-6 rounded-xl border p-6 text-center', className)}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot='empty-header' className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)} {...props} />;
}

function EmptyMedia({ className, variant = 'default', ...props }: ComponentProps<'div'> & { variant?: 'default' | 'icon' }) {
  return (
    <div
      data-slot='empty-media'
      data-variant={variant}
      className={cn(
        'mb-2 flex shrink-0 items-center justify-center text-muted-foreground [&_svg]:pointer-events-none',
        variant === 'icon' && 'size-12 rounded-xl bg-muted text-foreground [&_svg:not([class*="size-"])]:size-6',
        className,
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 data-slot='empty-title' className={cn('font-semibold tracking-tight', className)} {...props} />;
}

function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot='empty-description' className={cn('max-w-sm text-sm text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', className)} {...props} />;
}

function EmptyContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot='empty-content' className={cn('flex w-full max-w-sm min-w-0 flex-col items-center gap-2', className)} {...props} />;
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };
