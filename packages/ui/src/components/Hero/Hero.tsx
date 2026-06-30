import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface HeroProps {
  name: string;
  tagline?: string;
  imageUrl?: string;
  imageAlt?: string;
  cta?: ReactNode;
  className?: string;
}

export function Hero({ name, tagline, imageUrl, imageAlt, cta, className }: HeroProps) {
  return (
    <section className={cn('relative isolate overflow-hidden min-h-[70svh] flex items-end', className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt ?? ''}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          loading="eager"
        />
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10 bg-(--color-ink)" />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-6 pb-16 text-white">
        <h1 className="text-5xl sm:text-7xl font-normal">{name}</h1>
        {tagline ? <p className="mt-4 max-w-xl text-lg text-white/90">{tagline}</p> : null}
        {cta ? <div className="mt-8">{cta}</div> : null}
      </div>
    </section>
  );
}
