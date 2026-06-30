import type { Menu, MenuItem, MenuSection } from '@restaurant/schemas';
import { cn } from '../../lib/cn';

export interface MenuListProps {
  menu: Menu;
  className?: string;
}

export function MenuList({ menu, className }: MenuListProps) {
  return (
    <article className={cn('mx-auto w-full max-w-3xl px-6 py-12', className)}>
      <header className="mb-10 text-center">
        <h2 className="text-4xl">{menu.title}</h2>
        {menu.available ? <p className="mt-2 text-sm text-(--color-ink)/70">{menu.available}</p> : null}
      </header>
      <div className="space-y-12">
        {menu.sections.map((section) => (
          <MenuSectionBlock key={section.title} section={section} />
        ))}
      </div>
    </article>
  );
}

function MenuSectionBlock({ section }: { section: MenuSection }) {
  return (
    <section>
      <h3 className="text-2xl mb-2">{section.title}</h3>
      {section.description ? (
        <p className="text-sm text-(--color-ink)/70 mb-4">{section.description}</p>
      ) : null}
      <ul className="divide-y divide-(--color-ink)/10">
        {section.items.map((item) => (
          <MenuItemRow key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <li className="py-4 flex items-start justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium">{item.name}</span>
          {item.allergens?.length ? (
            <span className="text-xs uppercase tracking-wide text-(--color-ink)/50">
              {item.allergens.join(', ')}
            </span>
          ) : null}
        </div>
        {item.description ? (
          <p className="text-sm text-(--color-ink)/70 mt-1">{item.description}</p>
        ) : null}
      </div>
      {item.price ? <span className="shrink-0 tabular-nums">{item.price}</span> : null}
    </li>
  );
}
