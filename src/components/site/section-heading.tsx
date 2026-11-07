import { Reveal, Words } from "@/components/site/motion-primitives"

export function SectionHeading({
  index,
  kicker,
  title,
  id,
}: {
  index: string
  kicker: string
  title: string
  id: string
}) {
  return (
    <header className="flex min-w-0 flex-col gap-4 sm:gap-5">
      <Reveal
        as="p"
        className="flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.3em] text-muted-foreground uppercase"
      >
        <span className="font-heading text-foreground tabular-nums">{index}</span>
        <span aria-hidden className="h-px w-8 bg-zinc-800" />
        {kicker}
      </Reveal>
      <Words
        id={id}
        text={title}
        className="font-heading text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-4xl md:text-6xl lg:text-7xl"
      />
    </header>
  )
}
