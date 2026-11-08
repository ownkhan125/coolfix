// Clay badge for short labels (styles in styles/components.css).
// variant: "mint" (default, e.g. "Booked"), "score" (butter lead score chip), "urgent" (warm pink),
// "sky" (AC service) or "lilac" (Fridge service).
export default function Badge({ children, variant = "mint" }) {
  let variantClass = "";
  if (variant === "score") variantClass = "clay-badge-score";
  if (variant === "urgent") variantClass = "clay-badge-urgent";
  if (variant === "sky") variantClass = "clay-badge-sky";
  if (variant === "lilac") variantClass = "clay-badge-lilac";

  return <span className={`clay-badge ${variantClass} inline-flex items-center gap-2 px-3 py-1`}>{children}</span>;
}
