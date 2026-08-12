# @restaurant/ui

Shared React component library + Tailwind v4 theme tokens for the restaurant-starter scaffold. Consumed by both the Astro app (`apps/web`) and the Storybook preview.

- **Tokens** — palette (bone, ink, deep, clay, gold, sage), display + sans font families, base typography — all live in `src/styles.css` under `@theme { … }`.
- **Components** — `Hero`, `Button`, `MenuList`, `OpeningHours`, `PressGrid`, `ContactForm`, `OpenTableEmbed`. Each ships with a story + test.
- **Storybook** — `pnpm storybook` from repo root, previews at http://localhost:6006.

## Using components from Astro pages

Astro renders React components server-side out of the box — pass props and go. **But there's one interop constraint to know about before you write `<Hero cta={<a>Reserve</a>} />`:**

### Props must be primitives, not JSX

Passing JSX from `.astro` to a React component as a `ReactNode` prop breaks with:

```
Error: Objects are not valid as a React child
(found: object with keys {htmlParts, expressions, error})
```

Astro's compiler produces an internal `HTMLString` object for inline JSX. React's server renderer receives that as the prop value and can't render it as children.

**Do this instead — expose primitives (`string`, `number`, `boolean`) and construct any JSX inside the component:**

```tsx
// packages/ui/src/components/Hero/Hero.tsx
export interface HeroProps {
  name: string;
  ctaLabel?: string;
  ctaHref?: string;
}
export function Hero({ name, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section>
      <h1>{name}</h1>
      {ctaLabel && ctaHref && (
        <a href={ctaHref}><Button>{ctaLabel}</Button></a>
      )}
    </section>
  );
}
```

```astro
<Hero name="Bar Gaditano" ctaLabel="Reserve a table" ctaHref="/contact" />
```

For genuinely rich content, use Astro `<slot />` (component receives it as `children`) or hydrate with `client:load` and pass JSX from a `.tsx` wrapper. Primitives are the cheapest boundary — reserve slot/hydration for genuinely interactive components.

## Tailwind v4 `@source` scan

`src/styles.css` declares `@source` globs for both this package's components and the consuming app so the JIT scans everything it needs:

```css
@source './**/*.{ts,tsx}';
@source '../../../apps/web/src/**/*.{astro,ts,tsx}';
```

If you add a new consumer package outside `apps/web`, extend the `@source` list — Tailwind auto-detection only walks the vite project root, which won't cover cross-package files.

## Storybook

Storybook has its own Vite instance separate from the Astro app, so the `@tailwindcss/vite` plugin is registered in `.storybook/main.ts` under `viteFinal`. Google Fonts are injected into the preview iframe head via `.storybook/preview.ts`. Component stories should use realistic props (Bar Gaditano fixture data works well).

## Adding a new component

1. `mkdir src/components/YourComponent`
2. Add `YourComponent.tsx`, `YourComponent.stories.tsx`, `YourComponent.test.tsx`, `index.ts`
3. Export from `src/index.ts`
4. `pnpm storybook` to preview, `pnpm test` for the vitest run
