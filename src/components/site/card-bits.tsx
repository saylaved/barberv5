/** Flat matte card; hover = hairline firms up + a 2px lift. No scale, no glow. */
export const cardSurface =
  "relative h-full transition-[translate,border-color] duration-500 ease-out hover:border-zinc-700 hover:-translate-y-0.5"

/** Top hairline that draws itself left→right on card hover and leaves to the right. */
export function CardLine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px origin-right scale-x-0 bg-foreground transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:origin-left group-hover/card:scale-x-100"
    />
  )
}
