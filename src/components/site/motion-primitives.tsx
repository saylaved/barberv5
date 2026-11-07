import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

/*
 * Zero-JS motion primitives (server components).
 * They only emit markup + data attributes; all motion lives in globals.css
 * ("Motion" block) and runs on the compositor:
 * - reveals: CSS transitions flipped by one shared IntersectionObserver
 *   (the inline REVEAL_SCRIPT), spring 40/25 approximated with linear();
 * - scroll-linked effects: native CSS scroll-driven animations
 *   (animation-timeline: view()/scroll()), no scroll listeners at all.
 * On the lite tier, in browsers without scroll timelines, and before CSS
 * loads, everything renders static and fully visible.
 */

type Vars = React.CSSProperties & Record<`--${string}`, string | number>

/** Fade-in-up when scrolled into view. `i` staggers siblings (desktop only). */
export function Reveal({
  className,
  i,
  delay,
  as: Comp = "div",
  children,
}: {
  className?: string
  i?: number
  /** Extra delay, ms. */
  delay?: number
  as?: "div" | "li" | "p" | "header" | "figure"
  children: React.ReactNode
}) {
  const style: Vars | undefined =
    i || delay ? { ...(i ? { "--i": i } : {}), ...(delay ? { "--dd": `${delay}ms` } : {}) } : undefined
  return (
    <Comp className={className} data-reveal="up" style={style}>
      {children}
    </Comp>
  )
}

/** Plain grid wrapper (kept for API symmetry). */
export function RevealGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}

/** One staggered card inside a grid. */
export function RevealItem({ className, i, children }: { className?: string; i: number; children: React.ReactNode }) {
  return (
    <Reveal className={className} i={i}>
      {children}
    </Reveal>
  )
}

/**
 * Headline whose words rise one by one out of a hairline mask —
 * on first paint (`onLoad`, hero) or when scrolled into view.
 */
export function Words({
  text,
  as: Comp = "h2",
  id,
  className,
  onLoad = false,
  delay = 0,
}: {
  text: string
  as?: "h1" | "h2" | "p"
  id?: string
  className?: string
  onLoad?: boolean
  /** ms */
  delay?: number
}) {
  const words = text.split(" ")
  return (
    <Comp
      id={id}
      className={className}
      data-reveal={onLoad ? undefined : "words"}
      data-words={onLoad ? "load" : undefined}
      style={delay ? ({ "--dd": `${delay}ms` } as Vars) : undefined}
    >
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="w-m">
            <span className="w-i" style={{ "--i": i } as Vars}>
              {w}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </Comp>
  )
}

/**
 * Paragraph that "lights up" word by word while it travels through the
 * viewport — the read-along magazine effect. Pure CSS scroll timeline.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ")
  return (
    <p className={cn("sw", className)} style={{ "--step": `${(45 / words.length).toFixed(3)}%` } as Vars}>
      {words.map((w, i) => (
        <span key={i} style={{ "--i": i } as Vars}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  )
}

/** Image that drifts slower than the page inside its frame (CSS view timeline). */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  amount = 5,
  priority,
  quality = 90,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  imageClassName?: string
  /** % of the (114%-tall) inner layer; keep ≤ 6. */
  amount?: number
  priority?: boolean
  quality?: number
}) {
  return (
    <div className={cn("px relative overflow-hidden", className)}>
      <div className="px-i absolute inset-x-0 -top-[7%] h-[114%]" style={{ "--px": `${amount}%` } as Vars}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  )
}

/**
 * Number that counts up when its [data-reveal] ancestor appears.
 * CSS @property + counter(); the real value is always in the DOM for
 * screen readers, and shown as-is on the lite tier.
 */
export function CountUp({ to, from = 0, className }: { to: number; from?: number; className?: string }) {
  return (
    <span className={cn("tabular-nums", className)}>
      <span className="sr-only">{to}</span>
      <span aria-hidden className="count" style={{ "--to": to, "--from": from } as Vars} />
    </span>
  )
}
