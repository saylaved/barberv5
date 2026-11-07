"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { preloadBooking } from "@/components/site/booking/booking-provider"

/** Code-split: downloaded only on desktops with a mouse. */
const Cursor = dynamic(() => import("@/components/site/cursor").then((m) => m.Cursor), { ssr: false })

const DESKTOP = "(hover: hover) and (pointer: fine)"

function subscribe(onChange: () => void) {
  const a = window.matchMedia(DESKTOP)
  a.addEventListener("change", onChange)
  return () => {
    a.removeEventListener("change", onChange)
  }
}

/** Any computer with a mouse (unless forced to the lite tier). */
function desktopFx() {
  return window.matchMedia(DESKTOP).matches && document.documentElement.dataset.perf !== "lite"
}

/**
 * Progressive enhancements, mounted once at the end of the page:
 * - re-observes reveal targets rendered after the inline bootstrap script;
 * - touch devices only: frame-budget guard — if the first scroll runs well
 *   below 30 fps (p75 > 45 ms) the page drops to the static lite tier;
 * - JS fallback for scroll-linked effects where CSS scroll timelines are
 *   missing (Firefox, older Safari);
 * - idle prefetch of the booking wizard (skipped with Data Saver);
 * - desktop with a mouse: Lenis smooth scroll, magnetic CTAs, custom cursor.
 */
export function Enhancements() {
  const desktop = React.useSyncExternalStore(subscribe, desktopFx, () => false)

  React.useEffect(() => {
    const io = (window as Window & { __kursIO?: IntersectionObserver }).__kursIO
    if (io) document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el))
  }, [])

  React.useEffect(() => {
    const html = document.documentElement
    if (html.dataset.perf !== "full") return
    let cancelled = false
    let stopFallback: (() => void) | undefined
    let raf = 0

    if (!CSS.supports("animation-timeline: view()")) {
      import("@/lib/scroll-fallback").then((m) => {
        if (!cancelled) stopFallback = m.startScrollFallback()
      })
    }

    // Frame-budget guard (touch devices only — desktops keep everything).
    const onFirstScroll = () => {
      let last = 0
      const frames: number[] = []
      const sample = (t: number) => {
        if (last) frames.push(t - last)
        last = t
        if (frames.length < 90) {
          raf = requestAnimationFrame(sample)
          return
        }
        raf = 0
        frames.sort((a, b) => a - b)
        if (frames[Math.floor(frames.length * 0.75)] > 45) html.dataset.perf = "lite"
      }
      raf = requestAnimationFrame(sample)
    }
    const touch = window.matchMedia("(pointer: coarse)").matches
    if (touch) window.addEventListener("scroll", onFirstScroll, { passive: true, once: true })

    // Warm the booking chunk while the user reads.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    const timer = saveData
      ? 0
      : window.setTimeout(() => {
          if ("requestIdleCallback" in window) window.requestIdleCallback(() => void preloadBooking())
          else void preloadBooking()
        }, 3000)

    return () => {
      cancelled = true
      stopFallback?.()
      window.removeEventListener("scroll", onFirstScroll)
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    if (!desktop) return
    let cancelled = false
    let stopScroll: (() => void) | undefined
    let stopMagnetic: (() => void) | undefined

    import("@/lib/smooth-scroll")
      .then((m) => m.startSmoothScroll())
      .then((stop) => {
        if (cancelled) stop()
        else stopScroll = stop
      })
    import("@/lib/magnetic").then((m) => {
      if (!cancelled) stopMagnetic = m.attachMagnetic()
    })

    return () => {
      cancelled = true
      stopScroll?.()
      stopMagnetic?.()
    }
  }, [desktop])

  return desktop ? <Cursor /> : null
}
