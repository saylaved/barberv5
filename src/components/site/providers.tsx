import * as React from "react"

import { BookingProvider } from "@/components/site/booking/booking-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}
