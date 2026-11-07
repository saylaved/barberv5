import { BookButton, BookingOverlay } from "@/components/site/book-button"
import { CardLine, cardSurface } from "@/components/site/card-bits"
import { ParallaxImage, Reveal, RevealGroup, RevealItem } from "@/components/site/motion-primitives"
import { Reviews } from "@/components/site/reviews"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { barbers, type Barber } from "@/lib/data"
import { cn } from "@/lib/utils"

export function Team() {
  return (
    <Section id="team" labelledBy="team-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <SectionHeading id="team-title" index="03" kicker="Наша команда" title="Майстри KURS" />
        <Reveal as="p" className="max-w-md leading-relaxed text-pretty text-muted-foreground">
          Злагоджена команда: працюємо швидко, якісно й відповідаємо за результат. Кожна стрижка та гоління
          підкреслюють мужній силует, форму голови й риси обличчя.
        </Reveal>
      </div>
      <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        {barbers.map((b, i) => (
          <RevealItem key={b.id} i={i % 4} className="min-w-0">
            <BarberCard barber={b} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}

function BarberCard({ barber }: { barber: Barber }) {
  return (
    <Card data-cursor="Запис" className={cn(cardSurface, "min-w-0 gap-5 pt-0")}>
      <BookingOverlay barberId={barber.id} />
      <CardLine />
      <div className="pointer-events-none relative">
        <ParallaxImage
          src={barber.photo}
          alt={`Барбер ${barber.name}`}
          sizes="(min-width: 1280px) 340px, (min-width: 768px) 50vw, 100vw"
          amount={5}
          className="aspect-[4/5] border-b bg-secondary"
        />
        {/* Hover lift of the photo = fading a flat veil (opacity only, no filters). */}
        <div
          aria-hidden
          className="absolute inset-0 bg-black/15 transition-opacity duration-700 ease-out group-hover/card:opacity-0"
        />
        <Badge variant="outline" className="absolute top-4 left-4 border-zinc-700 bg-black">
          {barber.role}
        </Badge>
      </div>
      <CardHeader className="gap-1">
        <CardTitle className="text-xl font-semibold tracking-tight">{barber.name}</CardTitle>
        <CardDescription>{barber.experience}</CardDescription>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {barber.specialties.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="relative z-10 mt-auto">
        <Reviews reviews={barber.reviews} genitive={barber.genitive} />
      </CardContent>
      <CardFooter className="relative z-10 bg-transparent pt-5">
        <BookButton variant="outline" size="default" barberId={barber.id} className="h-11 w-full">
          Записатися до {barber.genitive}
        </BookButton>
      </CardFooter>
    </Card>
  )
}
