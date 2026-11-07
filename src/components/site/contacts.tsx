import type * as React from "react"
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { BookButton } from "@/components/site/book-button"
import { MapFacade } from "@/components/site/map-facade"
import { Reveal } from "@/components/site/motion-primitives"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"
import { contacts } from "@/lib/data"

/** Static faint underline + a white hairline that sweeps over it on hover. */
const link = "link-line border-b border-zinc-800 pb-0.5 transition-colors duration-300 hover:text-foreground"

export function Contacts() {
  const address = `м. ${contacts.city}, ${contacts.address}`
  return (
    <Section id="contacts" labelledBy="contacts-title" className="pb-0 sm:pb-0 lg:pb-0">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-w-0 flex-col gap-8 sm:gap-10">
          <SectionHeading id="contacts-title" index="05" kicker="Контакти" title="Будь в курсі" />
          <Reveal>
            <address className="flex flex-col gap-6 not-italic">
              <ContactRow icon={<MapPinIcon />} label="Адреса">
                {address}
              </ContactRow>
              <ContactRow icon={<ClockIcon />} label="Час роботи">
                <span className="tabular-nums">Щодня, {contacts.hours}</span>
              </ContactRow>
              <ContactRow icon={<PhoneIcon />} label="Телефон">
                <span className="flex flex-col items-start gap-1.5">
                  {contacts.phones.map((p) => (
                    <a key={p.href} href={p.href} className={`${link} tabular-nums`}>
                      {p.label}
                    </a>
                  ))}
                </span>
              </ContactRow>
              <ContactRow icon={<MailIcon />} label="Пошта">
                <a href={`mailto:${contacts.email}`} className={`${link} break-all`}>
                  {contacts.email}
                </a>
              </ContactRow>
            </address>
          </Reveal>
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center">
            <div data-magnetic className="inline-flex w-full sm:w-auto">
              <BookButton className="w-full sm:w-auto" />
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {contacts.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    translate="no"
                    className="link-line transition-colors duration-300 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="min-h-72 overflow-hidden rounded-lg border sm:min-h-96">
          <MapFacade src={contacts.mapEmbed} title={`Мапа: KURS Barbershop, ${contacts.address}`} address={address} />
        </Reveal>
      </div>

      <footer className="mt-16 border-t sm:mt-24">
        <div className="flex flex-col gap-3 pt-8 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© KURS Barbershop, з 2020 року. Підписуйтеся на нас — будьте в курсі.</p>
          <p>Навчання для барберів — деталі за телефоном.</p>
        </div>
        <Wordmark />
      </footer>
    </Section>
  )
}

/** Oversized closing wordmark: letters rise out of the floor one by one (CSS). */
function Wordmark() {
  return (
    <p
      aria-hidden
      translate="no"
      data-reveal="letters"
      className="mt-10 flex justify-between overflow-hidden pb-4 font-heading text-[clamp(4.5rem,25vw,23rem)] leading-[0.82] font-semibold text-zinc-900 select-none sm:mt-16"
    >
      {"KURS".split("").map((l, i) => (
        <span key={i} className="inline-block" style={{ "--i": i } as React.CSSProperties}>
          {l}
        </span>
      ))}
    </p>
  )
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span
        aria-hidden
        className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border text-muted-foreground [&_svg]:size-4"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-[0.6875rem] tracking-[0.3em] text-muted-foreground uppercase">{label}</span>
        <span className="text-base sm:text-lg">{children}</span>
      </div>
    </div>
  )
}
