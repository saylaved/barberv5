import type { Metadata, Viewport } from "next"
import { Manrope, Unbounded } from "next/font/google"

import { Enhancements } from "@/components/site/enhancements"
import { Providers } from "@/components/site/providers"
import { REVEAL_SCRIPT, TIER_SCRIPT } from "@/lib/perf-scripts"
import "lenis/dist/lenis.css"
import "./globals.css"

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

// Only the weights the design uses (400 for numerals/labels, 600 for display).
const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "KURS Barbershop — круті укладки, рівні стрижки | Київ",
  description:
    "Барбершоп KURS у Києві: чоловічі, подовжені та дитячі стрижки, стрижка бороди, камуфлювання сивини. Онлайн-запис до барбера.",
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`dark ${sans.variable} ${display.variable} h-full antialiased`}
    >
      <head>
        {/* Motion tier — must run before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: TIER_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Перейти до змісту
        </a>
        <Providers>
          {children}
          <Enhancements />
        </Providers>
        {/* Scroll reveals — runs as soon as the HTML is parsed, before hydration. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
      </body>
    </html>
  )
}
