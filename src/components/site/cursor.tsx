"use client"

import * as React from "react"

/**
 * Desktop micro-cursor — a precise dot plus an inverted ring that trails it.
 *
 * Performance contract
 * - Zero React renders after mount: no state, no context, no motion values.
 *   Pointer coordinates live in plain closure variables.
 * - One write path: a single requestAnimationFrame loop writes four CSS custom
 *   properties (--cx/--cy dot, --rx/--ry ring) on the container. The layers
 *   consume them only through `transform: translate3d()` on their own
 *   `will-change: transform` compositor layers, inside a `contain: strict`
 *   box — so movement never triggers layout or paint of the page.
 * - The loop sleeps: it starts on the first pointermove and cancels itself as
 *   soon as the ring has settled. A still mouse costs 0 frames.
 * - Hit-testing is incremental: work happens only when the element under the
 *   pointer changes (or once per frame while the page scrolls under it).
 * - Mode changes (hover / magnet / label) flip one data attribute; the size
 *   morph is a CSS transition of `transform: scale()` — GPU only.
 * - Touch devices: listeners are never attached
 *   (and are torn down live if the media query flips); CSS keeps the layer
 *   at display:none even before hydration.
 *
 * Markup hooks: any a / button / label → magnet; `data-cursor="Текст"` on a
 * container → filled disc with that micro-label.
 */
export function Cursor() {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    let teardown: (() => void) | null = null

    const sync = () => {
      const on = fine.matches
      if (on && !teardown) teardown = attach(root)
      else if (!on && teardown) {
        teardown()
        teardown = null
      }
    }
    sync()
    fine.addEventListener("change", sync)
    return () => {
      fine.removeEventListener("change", sync)
      teardown?.()
    }
  }, [])

  return (
    <div ref={ref} aria-hidden className="kc" data-mode="default">
      <div className="kc-ring">
        <div className="kc-shape">
          <span className="kc-fill" />
        </div>
        <span className="kc-label" />
      </div>
      <div className="kc-dot">
        <span className="kc-dot-i" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

type Mode = "default" | "hover" | "magnet" | "label"

const TARGETS = "a, button, [role='button'], label, [data-cursor]"
const INTERACTIVE = "a, button, [role='button'], label"
/** Ring base size is 56px in CSS; these are scale factors of it. */
const SCALE = { default: 34 / 56, hover: 54 / 56, label: 92 / 56 }
const FOLLOW = 0.2 // ring catch-up per 60 Hz frame (frame-rate independent)
const LEAN = 0.16 // how far the ring leans off a magnet's centre toward the pointer

function attach(root: HTMLDivElement) {
  const html = document.documentElement
  const body = document.body
  const label = root.querySelector<HTMLElement>(".kc-label")!
  const style = root.style

  // Pointer (dot) and ring positions, plus the ring's target.
  let px = -100
  let py = -100
  let rx = -100
  let ry = -100
  let tx = -100
  let ty = -100

  let raf = 0
  let last = 0
  let mode: Mode = "default"
  let target: Element | null = null
  let hit: Element | null = null
  let rect: DOMRect | null = null
  let scrolled = false
  let visible = false
  let locked = body.hasAttribute("data-scroll-locked")

  const write = () => {
    style.setProperty("--cx", `${px}px`)
    style.setProperty("--cy", `${py}px`)
    style.setProperty("--rx", `${rx.toFixed(2)}px`)
    style.setProperty("--ry", `${ry.toFixed(2)}px`)
  }

  const setVisible = (v: boolean) => {
    if (v === visible) return
    visible = v
    root.dataset.visible = String(v)
  }

  const setMode = (next: Mode, scale: number, text = "") => {
    if (next !== mode) {
      mode = next
      root.dataset.mode = next
    }
    style.setProperty("--s", scale.toFixed(3))
    if (label.textContent !== text) label.textContent = text
  }

  /** Runs only when the element under the pointer changes. */
  const resolve = (el: Element | null) => {
    target = el
    if (!el || el.tagName === "IFRAME") {
      setVisible(false)
      return
    }
    setVisible(true)
    const next = el.closest(TARGETS)
    if (next === hit) return
    hit = next
    rect = null

    if (!hit) return setMode("default", SCALE.default)
    if (hit.matches(INTERACTIVE)) {
      rect = hit.getBoundingClientRect()
      if (rect.width <= 480 && rect.height <= 120) {
        const s = Math.min(1.5, Math.max(0.8, (rect.height + 18) / 56))
        return setMode("magnet", s)
      }
      rect = null
      return setMode("hover", SCALE.hover)
    }
    const host = hit.closest<HTMLElement>("[data-cursor]")
    if (host?.dataset.cursor) return setMode("label", SCALE.label, host.dataset.cursor)
    setMode("default", SCALE.default)
  }

  const frame = (t: number) => {
    const dt = last ? Math.min(64, t - last) : 16.67
    last = t

    // Page moved under a still pointer: one hit-test + rect read per frame.
    if (scrolled) {
      scrolled = false
      const el = document.elementFromPoint(px, py)
      if (el !== target) resolve(el)
      else if (hit && mode === "magnet") rect = hit.getBoundingClientRect()
    }

    if (mode === "magnet" && rect) {
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      tx = cx + (px - cx) * LEAN
      ty = cy + (py - cy) * LEAN
    } else {
      tx = px
      ty = py
    }

    const k = 1 - Math.pow(1 - FOLLOW, dt / 16.67)
    rx += (tx - rx) * k
    ry += (ty - ry) * k

    if (Math.abs(tx - rx) + Math.abs(ty - ry) < 0.1) {
      rx = tx
      ry = ty
      write()
      raf = 0
      last = 0
      return // settled: the loop sleeps until the next pointermove/scroll
    }
    write()
    raf = requestAnimationFrame(frame)
  }

  const wake = () => {
    if (!raf) raf = requestAnimationFrame(frame)
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || locked) return
    px = e.clientX
    py = e.clientY
    if (!visible && rx < 0) {
      rx = px // first contact: appear in place instead of flying in
      ry = py
    }
    if (e.target !== target) resolve(e.target as Element)
    else setVisible(true)
    wake()
  }
  const onScroll = () => {
    if (!visible || locked) return
    scrolled = true
    wake()
  }
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") root.dataset.pressed = "true"
  }
  const onUp = () => delete root.dataset.pressed
  const onLeave = () => setVisible(false)

  // Radix dialogs lock <body>; the native cursor returns for form fields.
  const lockObserver = new MutationObserver(() => {
    locked = body.hasAttribute("data-scroll-locked")
    html.classList.toggle("custom-cursor", !locked)
    if (locked) {
      setVisible(false)
      target = hit = null
    }
  })
  lockObserver.observe(body, { attributes: true, attributeFilter: ["data-scroll-locked"] })

  html.classList.toggle("custom-cursor", !locked)
  setMode("default", SCALE.default)
  window.addEventListener("pointermove", onMove, { passive: true })
  window.addEventListener("pointerdown", onDown, { passive: true })
  window.addEventListener("pointerup", onUp, { passive: true })
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("blur", onLeave)
  html.addEventListener("pointerleave", onLeave)

  return () => {
    cancelAnimationFrame(raf)
    lockObserver.disconnect()
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerdown", onDown)
    window.removeEventListener("pointerup", onUp)
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("blur", onLeave)
    html.removeEventListener("pointerleave", onLeave)
    html.classList.remove("custom-cursor")
    delete root.dataset.visible
    delete root.dataset.pressed
    root.dataset.mode = "default"
    label.textContent = ""
  }
}
