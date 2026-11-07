import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Page section with the shared rhythm: px-4 on phones, generous air on
 * desktop (py-12 → py-20 → py-28) and a 7xl content column.
 * `.cv` = content-visibility:auto (when native scroll is used): off-screen
 * sections skip layout and paint entirely — the biggest win on weak phones.
 */
export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id: string
  labelledBy: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("cv py-12 sm:py-20 lg:py-28", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
