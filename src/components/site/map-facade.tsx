"use client"

import * as React from "react"
import { ArrowUpRightIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Google Maps embed on demand. The iframe alone pulls >1 MB of third-party
 * JS and keeps a weak phone busy for seconds, so the page ships a static
 * card; the live map loads only when someone asks for it.
 */
export function MapFacade({ src, title, address }: { src: string; title: string; address: string }) {
  const [live, setLive] = React.useState(false)
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`KURS Barbershop, ${address}`)}`

  if (live)
    return (
      <iframe
        title={title}
        src={src}
        referrerPolicy="no-referrer-when-downgrade"
        data-lenis-prevent
        className="size-full min-h-72 grayscale invert-[0.92] hue-rotate-180 sm:min-h-96"
      />
    )

  return (
    <div className="flex size-full min-h-72 flex-col items-center justify-center gap-6 bg-card p-6 text-center sm:min-h-96">
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full border text-muted-foreground"
      >
        <MapPinIcon className="size-5" />
      </span>
      <p className="max-w-xs text-pretty text-secondary-foreground">{address}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="outline" className="h-11 px-5" onClick={() => setLive(true)}>
          Показати мапу
        </Button>
        <Button asChild variant="ghost" className="h-11 px-5 text-muted-foreground">
          <a href={href} target="_blank" rel="noopener noreferrer">
            Відкрити в Google Maps
            <ArrowUpRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </div>
  )
}
