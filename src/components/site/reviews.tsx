"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, QuoteIcon, StarIcon } from "lucide-react"

import type { Review } from "@/lib/data"
import { cn } from "@/lib/utils"

/**
 * Review slider on native CSS scroll-snap: the browser does the swipe physics
 * (no carousel library, no touch listeners). JS only reads the index — once
 * per frame at most, and React re-renders only when the index changes.
 */
export function Reviews({ reviews, genitive }: { reviews: Review[]; genitive: string }) {
  const track = React.useRef<HTMLDivElement>(null)
  const [current, setCurrent] = React.useState(0)
  const count = reviews.length

  React.useEffect(() => {
    const el = track.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setCurrent(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
      })
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const go = (i: number) => {
    const el = track.current
    if (!el) return
    const n = (i + count) % count
    const smooth = document.documentElement.dataset.perf === "full"
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? "smooth" : "auto" })
  }

  return (
    <div data-cursor="Гортати" className="relative flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div
        ref={track}
        role="group"
        aria-roledescription="карусель"
        aria-label={`Відгуки про роботу ${genitive}`}
        tabIndex={0}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-sm [scrollbar-width:none] focus-visible:outline-1 focus-visible:outline-offset-4 [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <figure
            key={i}
            aria-roledescription="слайд"
            aria-label={`${i + 1} з ${count}`}
            className="flex w-full shrink-0 snap-start flex-col gap-3"
          >
            <QuoteIcon aria-hidden className="size-4 text-zinc-600" />
            <blockquote className="min-h-[4.5rem] text-sm leading-relaxed text-pretty text-secondary-foreground">
              {r.text}
            </blockquote>
            <figcaption className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{r.author}</span>
              <span className="flex items-center gap-0.5" role="img" aria-label={`Оцінка ${r.rating} з 5`}>
                {Array.from({ length: r.rating }).map((_, s) => (
                  <StarIcon key={s} aria-hidden className="size-3 fill-foreground text-foreground" />
                ))}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Відгук ${i + 1} з ${count}`}
              aria-current={current === i || undefined}
              className="flex h-8 items-center rounded-sm px-0.5"
            >
              <span
                className={cn(
                  "block h-px w-6 origin-left transition-[scale,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  current === i ? "scale-x-100 bg-foreground" : "scale-x-50 bg-zinc-700"
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 font-heading text-[0.625rem] text-zinc-500 tabular-nums" aria-hidden>
            {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <ArrowButton dir="prev" onClick={() => go(current - 1)} />
          <ArrowButton dir="next" onClick={() => go(current + 1)} />
        </div>
      </div>
    </div>
  )
}

/** Arrow with a hairline that draws in from the left under it on hover. */
function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const Icon = dir === "prev" ? ArrowLeftIcon : ArrowRightIcon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Попередній відгук" : "Наступний відгук"}
      className="group/arrow relative flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
    >
      <Icon
        aria-hidden
        className={cn(
          "size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          dir === "prev" ? "group-hover/arrow:-translate-x-0.5" : "group-hover/arrow:translate-x-0.5"
        )}
      />
      <span
        aria-hidden
        className="absolute inset-x-2 bottom-1 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/arrow:origin-left group-hover/arrow:scale-x-100"
      />
    </button>
  )
}
