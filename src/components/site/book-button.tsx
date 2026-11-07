"use client"

import * as React from "react"
import { ArrowUpRightIcon } from "lucide-react"

import { preloadBooking, useBooking } from "@/components/site/booking/booking-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Booking CTA.
 * Hover: a flat fill sweeps in from the left (transform only) and the label
 * flips colour as it passes. No blend modes, no glow.
 * Hover / focus / touch also warms the lazily-loaded booking wizard.
 */
export function BookButton({
  className,
  size = "lg",
  barberId,
  serviceId,
  children = "Записатися",
  variant = "solid",
}: {
  className?: string
  size?: "lg" | "default"
  barberId?: string
  serviceId?: string
  children?: React.ReactNode
  variant?: "solid" | "outline"
}) {
  const { openBooking } = useBooking()
  const outline = variant === "outline"

  return (
    <Button
      type="button"
      size={size}
      variant={outline ? "outline" : "default"}
      aria-haspopup="dialog"
      onClick={() => openBooking({ barberId, serviceId })}
      onPointerEnter={preloadBooking}
      onFocus={preloadBooking}
      onTouchStart={preloadBooking}
      className={cn(
        "group/book relative isolate overflow-hidden font-medium tracking-wide",
        outline ? "hover:border-foreground hover:bg-transparent" : "border-foreground hover:bg-primary",
        size === "lg" && "h-12 px-6 text-sm",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 origin-right scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/book:origin-left group-hover/book:scale-x-100",
          outline ? "bg-white" : "bg-black"
        )}
      />
      <span
        className={cn(
          "relative flex items-center gap-1.5 transition-colors duration-300 group-hover/book:delay-150",
          outline ? "text-foreground group-hover/book:text-black" : "text-primary-foreground group-hover/book:text-white"
        )}
      >
        {children}
        <ArrowUpRightIcon
          aria-hidden
          className="size-4 transition-transform duration-500 ease-out group-hover/book:translate-x-0.5 group-hover/book:-translate-y-0.5"
        />
      </span>
    </Button>
  )
}

/**
 * Invisible full-card click target (mouse convenience). Keyboard and screen
 * reader users reach the same action through the card's real button.
 */
export function BookingOverlay({ barberId, serviceId }: { barberId?: string; serviceId?: string }) {
  const { openBooking } = useBooking()
  return (
    <div
      aria-hidden
      className="absolute inset-0 cursor-pointer"
      onPointerEnter={preloadBooking}
      onClick={() => openBooking({ barberId, serviceId })}
    />
  )
}
