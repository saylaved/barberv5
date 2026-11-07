/**
 * Fallback for browsers without CSS scroll-driven animations (Firefox,
 * Safari < 26). Mirrors the `animation-timeline` rules in globals.css:
 * hero drift, parallax frames, gallery lead, read-along words, progress bar.
 *
 * Cheap by design: only elements currently in the viewport (tracked by an
 * IntersectionObserver) are touched; one rAF per scroll burst; writes only
 * `translate` / `scale` / `opacity` (compositor properties).
 */
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function startScrollFallback(): () => void {
  const html = document.documentElement
  const visible = new Set<Element>()
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      schedule()
    },
    { rootMargin: "10% 0px 10% 0px" }
  )
  const roots = document.querySelectorAll(".hero, .px, .lead-wrap, .sw")
  roots.forEach((el) => io.observe(el))

  const progress = document.querySelector<HTMLElement>(".scroll-progress")
  if (progress) progress.style.display = "block"

  const update = () => {
    raf = 0
    if (html.dataset.perf !== "full") return
    const vh = window.innerHeight

    if (progress) {
      const max = document.documentElement.scrollHeight - vh
      progress.style.scale = `${max > 0 ? clamp(window.scrollY / max) : 0} 1`
    }

    for (const el of visible) {
      const r = el.getBoundingClientRect()
      const cover = clamp((vh - r.top) / (vh + r.height))

      if (el.classList.contains("hero")) {
        const exit = clamp((vh - r.bottom) / Math.min(r.height, vh))
        const bg = el.querySelector<HTMLElement>(".hero-bg")
        const content = el.querySelector<HTMLElement>(".hero-content")
        if (bg) {
          bg.style.translate = `0 ${(exit * 18).toFixed(2)}%`
          bg.style.scale = String((1 + exit * 0.08).toFixed(4))
        }
        if (content) {
          const q = clamp(exit / 0.7)
          content.style.translate = `0 ${(-90 * q).toFixed(1)}px`
          content.style.opacity = String((1 - q).toFixed(3))
        }
      } else if (el.classList.contains("px")) {
        const inner = el.querySelector<HTMLElement>(".px-i")
        if (inner) {
          const a = parseFloat(inner.style.getPropertyValue("--px")) || 6
          inner.style.translate = `0 ${(-a + 2 * a * cover).toFixed(2)}%`
        }
      } else if (el.classList.contains("lead-wrap")) {
        const lead = el.querySelector<HTMLElement>(".lead")
        const inner = el.querySelector<HTMLElement>(".lead-i")
        if (lead) lead.style.scale = String((0.94 + 0.06 * clamp(cover / 0.5)).toFixed(4))
        if (inner) {
          inner.style.translate = `0 ${(-6 + 12 * cover).toFixed(2)}%`
          inner.style.scale = String((1 + 0.04 * clamp(1 - cover / 0.5)).toFixed(4))
        }
      } else if (el.classList.contains("sw")) {
        const step = (parseFloat((el as HTMLElement).style.getPropertyValue("--step")) || 3) / 100
        const words = el.children
        for (let i = 0; i < words.length; i++) {
          const start = 0.08 + i * step
          const o = 0.18 + 0.82 * clamp((cover - start) / step)
          ;(words[i] as HTMLElement).style.opacity = o.toFixed(3)
        }
      }
    }
  }

  let raf = 0
  function schedule() {
    if (!raf) raf = requestAnimationFrame(update)
  }
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule, { passive: true })
  schedule()

  return () => {
    io.disconnect()
    cancelAnimationFrame(raf)
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
  }
}
