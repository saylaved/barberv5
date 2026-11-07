"use client"

import * as React from "react"
import Image from "next/image"
import { MenuIcon, XIcon } from "lucide-react"

import { BookButton } from "@/components/site/book-button"
import { Button } from "@/components/ui/button"
import { nav } from "@/lib/data"
import { cn } from "@/lib/utils"

export function Header() {
  const ref = React.useRef<HTMLElement>(null)
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState("")

  // Scroll state goes straight to data attributes (max once per frame):
  // hide on the way down, return on the way up. No React renders on scroll.
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = window.scrollY
    let raf = 0
    const apply = () => {
      raf = 0
      const y = window.scrollY
      el.dataset.scrolled = String(y > 8)
      if (Math.abs(y - last) < 6) return
      el.dataset.hidden = String(y > last && y > 320)
      last = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Which section is on stage (state changes only at section boundaries).
  React.useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.href.slice(1))).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header
      ref={ref}
      data-open={open}
      className="site-header fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[translate,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[open=true]:border-border data-[open=true]:bg-black data-[scrolled=true]:border-border data-[scrolled=true]:bg-black/95"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3 rounded-sm" aria-label="KURS Barbershop — на початок">
          <Image src="/img/logo.png" alt="" width={22} height={27} priority className="opacity-90" />
          <span translate="no" className="font-heading text-base font-semibold tracking-[0.3em]">
            KURS
          </span>
        </a>

        <nav aria-label="Основна навігація" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const current = active === item.href
              return (
                <li key={item.href} className="relative">
                  <a
                    href={item.href}
                    aria-current={current ? "location" : undefined}
                    className={cn(
                      "flex px-3 py-2 text-sm transition-colors duration-300 hover:text-foreground focus-visible:text-foreground",
                      current ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <span className="link-line">{item.label}</span>
                  </a>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute right-3 -bottom-px left-3 h-px origin-left bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      current ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <BookButton size="default" variant="outline" className="h-9 px-3.5 text-xs sm:px-4" />
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Мобільна навігація" className="border-t md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 pb-4 sm:px-6">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className="menu-item border-b last:border-b-0"
                style={{ "--i": i } as React.CSSProperties}
              >
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-14 items-center justify-between text-base transition-colors duration-300",
                    active === item.href ? "text-foreground" : "text-secondary-foreground"
                  )}
                >
                  {item.label}
                  <span aria-hidden className="font-heading text-xs text-zinc-600 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Reading progress — a hairline on a native scroll timeline (no JS). */}
      <div aria-hidden className="scroll-progress absolute inset-x-0 -bottom-px h-px origin-left bg-foreground/70" />
    </header>
  )
}
