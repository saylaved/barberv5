import { ClockIcon } from "lucide-react"

import { BookButton, BookingOverlay } from "@/components/site/book-button"
import { CardLine, cardSurface } from "@/components/site/card-bits"
import { RevealGroup, RevealItem, ScrollWords } from "@/components/site/motion-primitives"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRange, services } from "@/lib/data"

export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <SectionHeading id="services-title" index="02" kicker="Послуги" title="Ціни без сюрпризів" />
        <ScrollWords
          className="max-w-sm leading-relaxed text-pretty text-muted-foreground"
          text="Вартість залежить від рівня майстра та складності роботи. Миття голови вже входить у ціну чоловічої стрижки."
        />
      </div>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <RevealItem key={s.id} i={i % 3} className="min-w-0">
            <Card
              data-cursor="Обрати"
              className={`${cardSurface} gap-6 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(7)]`}
            >
              <BookingOverlay serviceId={s.id} />
              <CardLine />
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-xs text-zinc-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Badge variant="outline" className="text-muted-foreground">
                    <ClockIcon data-icon="inline-start" />
                    {s.duration}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg font-semibold tracking-tight sm:text-xl">{s.title}</CardTitle>
                <CardDescription className="leading-relaxed text-pretty">{s.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="font-heading text-2xl font-semibold tabular-nums sm:text-3xl">
                  {formatRange(s.priceFrom, s.priceTo)}
                </p>
              </CardContent>
              <CardFooter className="relative z-10 bg-transparent pt-6">
                <BookButton variant="outline" size="default" serviceId={s.id} className="h-11 w-full">
                  Обрати
                </BookButton>
              </CardFooter>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
