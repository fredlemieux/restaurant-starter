import type { PressMention } from '@restaurant/schemas';
import { cn } from '../../lib/cn';

export interface PressGridProps {
  items: PressMention[];
  className?: string;
}

export function PressGrid({ items, className }: PressGridProps) {
  return (
    <section className={cn('mx-auto w-full max-w-5xl px-6 py-12', className)} aria-label="Press">
      <h2 className="text-4xl text-center mb-8">In the press</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PressCard key={item._id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function PressCard({ item }: { item: PressMention }) {
  return (
    <li className="rounded-lg border border-ink/10 bg-white p-6">
      <p className="font-display text-2xl mb-3">“{item.quote}”</p>
      <p className="text-sm text-ink/70">
        <span className="font-medium">{item.publication}</span>
        {item.author ? <> · {item.author}</> : null}
      </p>
      {item.url ? (
        <a href={item.url} className="mt-4 inline-block text-sm underline" target="_blank" rel="noreferrer noopener">
          Read article
        </a>
      ) : null}
    </li>
  );
}
