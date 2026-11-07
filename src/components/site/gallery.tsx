import Image from "next/image"

import { ParallaxImage, Reveal } from "@/components/site/motion-primitives"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { gallery } from "@/lib/data"

/**
 * Editorial grid: a wide lead frame that "opens" (scale on a CSS view
 * timeline) as it reaches the centre of the screen, then pairs of frames
 * whose images drift slower than the page. Nothing moves on its own; all of
 * it is compositor-only and absent on the lite tier.
 */
export function Gallery() {
  const [lead, ...rest] = gallery
  return (
    <Section id="gallery" labelledBy="gallery-title">
      <SectionHeading id="gallery-title" index="04" kicker="Галерея" title="Атмосфера KURS" />
      <div className="lead-wrap mt-10 sm:mt-14">
        <figure className="lead relative aspect-[4/3] overflow-hidden rounded-lg border bg-card sm:aspect-[2049/975]">
          <div className="lead-i absolute inset-x-0 -top-[6%] h-[112%]">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              quality={90}
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2">
        {rest.map((img, i) => (
          <Reveal key={img.src} i={i % 2} className="min-w-0">
            <figure className="group/img">
              <ParallaxImage
                src={img.src}
                alt={img.alt}
                sizes="(min-width: 768px) 50vw, 100vw"
                amount={5}
                className="aspect-[2049/975] rounded-lg border bg-card"
                imageClassName="transition-opacity duration-700 ease-out group-hover/img:opacity-80"
              />
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
