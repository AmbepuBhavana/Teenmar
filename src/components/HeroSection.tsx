import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'
import { images } from '../data/images'
import { REGIONS, restaurant } from '../data/restaurant'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { registerGsap } from '../lib/reveal'

export function HeroSection() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (!root.current || reduced) return
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-hero-image]', { scale: 1.06 }, { scale: 1, duration: 1.8, ease: 'power2.out' })
      gsap.fromTo(
        '[data-hero-regions]',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.45, ease: 'power2.out' },
      )
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={root}
      id="home"
      className="relative min-h-[calc(100svh-var(--top-bar-height,100px))] scroll-mt-[var(--top-bar-height,100px)] overflow-x-clip bg-espresso text-warm min-[900px]:min-h-[100svh] min-[900px]:scroll-mt-0"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" data-hero-image>
          <img
            src={images.heroBackground}
            alt="Telugu dishes arranged on a dark tabletop with candles and herbs"
            className="h-full w-full object-cover object-center"
            style={{ height: '100%' }}
            fetchPriority="high"
          />
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(33,19,15,0.78)_0%,rgba(33,19,15,0.42)_42%,rgba(33,19,15,0.18)_100%)] min-[900px]:block" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(33,19,15,0.55)_0%,transparent_32%,rgba(33,19,15,0.62)_100%)] min-[900px]:block" />
          <div className="grain hidden min-[900px]:block" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-[linear-gradient(to_top,rgba(23,11,8,.75),transparent)] min-[900px]:hidden" />

      <div className="pointer-events-none absolute inset-4 border border-gold/20 md:inset-6" />

      <div className="relative mx-auto flex min-h-[calc(100svh-var(--top-bar-height,100px))] max-w-7xl flex-col justify-center px-5 pt-10 pb-10 min-[900px]:min-h-[100svh] min-[900px]:px-8 min-[900px]:pt-32 min-[900px]:pb-24">
        <p
          data-hero-kicker
          className="mb-6 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-gold sm:tracking-[0.42em]"
        >
          <span className="h-px w-10 bg-gold" />
          The Telugu Fire
        </p>

        <h1 className="max-w-full [overflow-wrap:anywhere] font-display text-[clamp(44px,7vw,92px)] leading-[0.98] font-semibold tracking-tight text-warm drop-shadow-[0_8px_24px_rgba(33,19,15,0.55)]">
          <span className="block">The Art of</span>
          <span className="block italic text-gold">Telugu Flavour.</span>
        </h1>

        <div
          data-hero-regions
          role="group"
          aria-label="Telangana, Andhra and Rayalaseema"
          className="mt-[18px] flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-[6px] border-y border-[#D9A441]/[0.45] py-[10px]"
        >
          {REGIONS.map((region, index) => (
            <span key={region} className="contents">
              <span className="whitespace-nowrap font-display text-[clamp(16px,4.4vw,20px)] font-medium italic text-[#F1E3D0] [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">
                {region}
              </span>
              {index < REGIONS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="h-[6px] w-[6px] flex-none rotate-45 bg-[#D9A441]"
                />
              ) : null}
            </span>
          ))}
        </div>

        <p
          data-hero-copy
          className="mt-4 max-w-md text-base leading-relaxed text-warm/90 md:text-lg"
        >
          Rooted in tradition. Rich in flavour. Made for every gathering.
        </p>

        <p data-hero-copy className="mt-3 font-telugu text-lg text-warm/70">
          తెలుగు రుచి
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 max-[399px]:flex-col max-[399px]:items-start">
          <a
            data-hero-cta
            href="#menu"
            className="inline-flex min-h-12 items-center rounded-full bg-telugu px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-warm transition hover:bg-maroon max-[399px]:w-full max-[399px]:max-w-[320px] max-[399px]:justify-center sm:px-6 sm:tracking-[0.18em]"
            onClick={(event) => {
              const menu = document.getElementById('menu')
              if (!menu) return
              event.preventDefault()
              menu.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
              history.pushState(null, '', '#menu')
            }}
          >
            Explore Our Menu
          </a>
          <a
            data-hero-cta
            href={restaurant.phones[0].href}
            className="inline-flex min-h-12 items-center rounded-full border border-[#D9A441] bg-[rgba(23,11,8,.6)] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-warm transition hover:border-gold hover:text-gold max-[399px]:w-full max-[399px]:max-w-[320px] max-[399px]:justify-center sm:px-6 sm:tracking-[0.18em]"
          >
            Call to Order
          </a>
        </div>

        <a
          href="#story"
          className="mt-8 hidden w-fit items-center gap-2 rounded-full bg-[rgba(23,11,8,.6)] px-4 py-2 text-[0.65rem] uppercase tracking-[0.28em] text-warm/70 min-[900px]:absolute min-[900px]:bottom-8 min-[900px]:left-8 min-[900px]:mt-0 min-[900px]:inline-flex"
        >
          Scroll
          <ChevronDown size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
