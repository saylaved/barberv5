import type * as React from "react"
import Image from "next/image"
import { ArrowDownIcon } from "lucide-react"

import { BookButton } from "@/components/site/book-button"
import { Words } from "@/components/site/motion-primitives"
import { contacts } from "@/lib/data"

type Vars = React.CSSProperties & Record<`--${string}`, string>

/**
 * Server-rendered hero. Entrance = CSS animations that start on first paint
 * (no hydration wait). Scroll = native view timeline: the background drifts
 * slower than the page, the copy lifts away and fades. The photo is
 * greyscale on disk (no CSS filters) under a flat black veil.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="hero relative isolate flex min-h-[100svh] items-end overflow-hidden bg-background"
    >
      <div aria-hidden className="hero-bg absolute inset-0 -z-10">
        <Image
          src="/img/masters-hero.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="load-fade object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="hero-content mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-28 pb-12 sm:gap-10 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <p className="load-up flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.3em] text-muted-foreground uppercase">
          <span aria-hidden className="load-line h-px w-8 origin-left bg-zinc-600" style={{ "--dd": "300ms" } as Vars} />
          Барбершоп · {contacts.city} · з 2020
        </p>

        <Words
          as="h1"
          id="hero-title"
          text="Круті укладки, рівні стрижки"
          onLoad
          delay={250}
          className="max-w-5xl font-heading text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        />

        <div className="relative flex flex-col gap-8 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <span
            aria-hidden
            className="load-line absolute inset-x-0 top-0 h-px origin-left bg-border"
            style={{ "--dd": "600ms", "--dur": "1600ms" } as Vars}
          />
          <p
            className="load-up max-w-md text-base text-pretty text-muted-foreground sm:text-lg"
            style={{ "--dd": "700ms" } as Vars}
          >
            Місце, яке об’єднує однодумців. Від стрижки — до нового, якісного життя.
          </p>
          <div
            className="load-up flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
            style={{ "--dd": "820ms" } as Vars}
          >
            <div data-magnetic className="inline-flex w-full sm:w-auto">
              <BookButton className="w-full sm:w-auto" />
            </div>
            <a
              href="#services"
              className="group/scroll flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <span className="link-line">Послуги та ціни</span>
              <ArrowDownIcon
                aria-hidden
                className="size-4 transition-transform duration-500 ease-out group-hover/scroll:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
