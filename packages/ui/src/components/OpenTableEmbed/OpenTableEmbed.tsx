import { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';

export interface OpenTableEmbedProps {
  rid: string;
  domain?: 'com' | 'co.uk';
  theme?: 'standard' | 'tall' | 'wide' | 'button';
  iframe?: boolean;
  lang?: string;
  newTab?: boolean;
  className?: string;
}

export function OpenTableEmbed({
  rid,
  domain = 'co.uk',
  theme = 'standard',
  iframe = true,
  lang = 'en-GB',
  newTab = false,
  className,
}: OpenTableEmbedProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const params = new URLSearchParams({
      rid,
      type: 'standard',
      theme,
      iframe: String(iframe),
      domain,
      lang,
      newtab: String(newTab),
    });

    const script = document.createElement('script');
    script.src = `https://www.opentable.${domain}/widget/reservation/loader?${params.toString()}`;
    script.async = true;
    mountRef.current.appendChild(script);

    const node = mountRef.current;
    return () => {
      node.innerHTML = '';
    };
  }, [rid, domain, theme, iframe, lang, newTab]);

  return (
    <div
      ref={mountRef}
      data-testid="opentable-embed"
      aria-label="Reserve a table via OpenTable"
      className={cn('w-full max-w-md mx-auto', className)}
    />
  );
}
