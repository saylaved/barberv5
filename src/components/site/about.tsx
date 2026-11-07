import { CountUp, ParallaxImage, Reveal, ScrollWords } from "@/components/site/motion-primitives"
import { Section } from "@/components/site/section"
import { SectionHeading } from "@/components/site/section-heading"

const STATS = [
  { value: 2020, from: 2000, label: "рік заснування" },
  { value: 6, from: 0, label: "послуг для вашого стилю" },
  { value: 11, from: 0, label: "годин щодня для вас" },
]

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex min-w-0 flex-col gap-8 sm:gap-10 lg:col-span-7">
          <SectionHeading id="about-title" index="01" kicker="Про нас" title="Новий курс — від стрижки" />
          <ScrollWords
            className="text-xl leading-snug font-medium text-pretty sm:text-2xl lg:text-3xl"
            text="Барбершоп KURS — місце, яке об’єднує однодумців. Нас надихають природа, мистецтво, екстрим, подорожі та активні, цілеспрямовані люди."
          />
          <ScrollWords
            className="max-w-xl leading-relaxed text-pretty text-muted-foreground"
            text="Ми — команда майстрів своєї справи: постійно вдосконалюємося, навчаємося, розвиваємося й підтримуємо одне одного. Ми оточуємо себе сильними й вільними духом людьми та будуємо простір, у якому змінюється життя і прокладається новий КУРС — від стрижки до нового, якісного життя."
          />
          <dl className="grid grid-cols-3 gap-4 border-t pt-8 sm:gap-8">
            {STATS.map((s, i) => (
              <Reveal key={s.label} i={i} className="flex min-w-0 flex-col gap-1.5">
                <dt className="order-2 text-xs leading-snug text-muted-foreground sm:text-sm">{s.label}</dt>
                <dd className="order-1 font-heading text-2xl font-semibold sm:text-4xl lg:text-5xl">
                  <CountUp to={s.value} from={s.from} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal as="figure" className="flex flex-col gap-4 lg:col-span-5 lg:pt-24">
          <ParallaxImage
            src="/img/school_photo.jpg"
            alt="Майстри KURS за роботою в барбершопі"
            sizes="(min-width: 1024px) 45vw, 100vw"
            amount={5}
            className="aspect-[4/5] rounded-lg border bg-card"
          />
          <figcaption className="text-[0.6875rem] tracking-[0.3em] text-muted-foreground uppercase">
            Стиль · характер · деталі
          </figcaption>
        </Reveal>
      </div>
    </Section>
  )
}
