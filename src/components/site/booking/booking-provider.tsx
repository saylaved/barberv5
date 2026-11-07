"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { Spinner } from "@/components/ui/spinner"

type OpenOptions = { barberId?: string; serviceId?: string }

type BookingContextValue = {
  openBooking: (options?: OpenOptions) => void
}

const BookingContext = React.createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = React.useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>")
  return ctx
}

/**
 * The booking wizard (Dialog, calendar, date-fns, motion) is a separate chunk:
 * it is not downloaded with the page. It is warmed on hover/focus/touch of a
 * booking button and on idle (full tier), and loaded at the latest on click.
 */
export const preloadBooking = () => import("@/components/site/booking/booking-dialog")

const BookingDialog = dynamic(() => preloadBooking().then((m) => m.BookingDialog), {
  ssr: false,
  loading: BookingLoading,
})

function BookingLoading() {
  return (
    <div role="status" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <Spinner className="size-5" />
      <span className="sr-only">Завантаження форми запису…</span>
    </div>
  )
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [preset, setPreset] = React.useState<OpenOptions>({})
  // Remount the wizard on every open so it always starts clean.
  const [session, setSession] = React.useState(0)

  const openBooking = React.useCallback((options: OpenOptions = {}) => {
    setPreset(options)
    setSession((s) => s + 1)
    setOpen(true)
  }, [])

  const value = React.useMemo(() => ({ openBooking }), [openBooking])

  return (
    <BookingContext.Provider value={value}>
      {children}
      {session > 0 && <BookingDialog key={session} open={open} onOpenChange={setOpen} preset={preset} />}
    </BookingContext.Provider>
  )
}
