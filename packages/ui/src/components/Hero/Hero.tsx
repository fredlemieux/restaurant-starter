import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface HeroProps {
  name: string;
  tagline?: string;
  imageUrl?: string;
  imageAlt?: string;
  cta?: ReactNode;
  eyebrow?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function Hero({
  name,
  tagline,
  imageUrl,
  imageAlt,
  cta,
  eyebrow,
  align = 'left',
  className,
}: HeroProps) {
  return (
    <section className={cn('relative flex min-h-[85svh] items-end overflow-hidden', className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt ?? ''}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : (
        <div aria-hidden className="from-deep via-ink to-deep absolute inset-0 bg-gradient-to-br" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"
      />
      <div
        className={cn(
          'text-bone relative mx-auto w-full max-w-6xl px-6 pb-24 pt-40',
          align === 'center' && 'text-center',
        )}
      >
        {eyebrow ? (
          <p className="text-gold mb-5 text-xs uppercase tracking-[0.35em]">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-6xl font-light leading-[0.95] sm:text-7xl md:text-8xl">
          {name}
        </h1>
        {tagline ? (
          <p
            className={cn(
              'text-bone/85 mt-6 max-w-xl text-lg font-light',
              align === 'center' && 'mx-auto',
            )}
          >
            {tagline}
          </p>
        ) : null}
        {cta ? (
          <div className={cn('mt-10', align === 'center' && 'flex justify-center')}>{cta}</div>
        ) : null}
      </div>
    </section>
  );
}
