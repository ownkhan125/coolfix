# Styling rules

## Who controls what

- **CSS** (files in `styles/`) controls: theme colors, fonts, font sizes, shadows, border radius, glass and clay effects, responsive font sizes, keyframe animations.
- **Tailwind** controls: layout and one-off spacing — flex, grid, gap, padding, margin, width, position, display, and layout changes between screen sizes.
- Do NOT use Tailwind for theme colors, font sizes, shadows or border radius. Use a CSS class.
- Do NOT configure a Tailwind theme: no `@theme` block, no config extensions. Use default Tailwind utilities only.
- Avoid arbitrary values like `w-[437px]` or `text-[#2A2350]`. If needed, create a CSS class.
- Keep Tailwind class lists short (about 8 utilities max per element). If an element needs more, move the visual part into a CSS class.

## CSS files

- `styles/theme.css` — `:root` variables only (colors, font sizes, radius, shadows).
- `styles/base.css` — body background, base typography, headings.
- `styles/components.css` — reusable classes: `.glass-card`, `.clay-button`, `.clay-icon`, `.clay-badge`, `.clay-input`.
- `styles/responsive.css` — font size and spacing changes for the 3 screens.
- `app/globals.css` imports Tailwind first, then the files above in this order.
- Class names are kebab-case and descriptive (`.glass-card`, `.hero-title`).
- Put a one-line comment above each class saying where it is used.
- Every color and size comes from a variable in `theme.css`. No hard-coded hex values anywhere else.

## Design system

- Cards and containers: glassmorphism (`.glass-card`).
- Buttons, icons, badges, inputs: claymorphism (`.clay-*` classes).
- Colors for `theme.css`:
  - background `#F3EEFF`, text `#2A2350`, muted text `#6E668F`, white `#FFFFFF`
  - pink `#FF8FB1`, peach `#FFB38A` (main buttons, urgent)
  - sky `#8EC5FF`, lilac `#B9A6FF` (brand, cool)
  - mint `#7EE0C3` (booked / success), butter `#FFE08A` (highlights)
- Background: lavender base with soft radial gradient blobs (pink, sky, butter, lilac).
- Font weights: headings 800, body 500, buttons 700.

## Responsive: exactly 3 screens

- Mobile: default styles, no media query.
- Tablet: `@media (min-width: 768px)`
- Desktop: `@media (min-width: 1024px)`
- These are the only media queries in CSS, and they live in `styles/responsive.css`.
- For layout changes in JSX use only Tailwind `md:` (768px) and `lg:` (1024px), so CSS and Tailwind breakpoints match.

## Animation

- Motion for interactions (hover, tap, scroll reveal, chat messages).
- CSS `@keyframes` for infinite background loops (blobs).
- Animate only `transform` and `opacity`.
- Respect reduced motion: `useReducedMotion()` in Motion and `prefers-reduced-motion` in CSS.
