import { useLayoutEffect, useRef } from 'react'
import { images } from '../data/images'
import { restaurant } from '../data/restaurant'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { revealOnScroll } from '../lib/reveal'

export function RestaurantExperience() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (!root.current) return
    return revealOnScroll(root.current, reduced)
  }, [reduced])

  return (
    <section ref={root} className="relative overflow-hidden bg-maroon text-warm">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[360px]">
          <img
            src={images.tableSpread}
            alt="Shared table of Indian dishes styled for a gathering"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-espresso/35" />
        </div>
        <div className="px-5 py-16 md:px-12 md:py-24">
          <p data-reveal className="text-[0.68rem] uppercase tracking-[0.38em] text-gold">
            05 — The Kitchen
          </p>
          <h2 data-reveal className="mt-4 font-display text-4xl sm:text-5xl">
            Restaurant and takeaway, for every gathering.
          </h2>
          <p data-reveal className="mt-6 max-w-lg text-warm/75">
            Teenmaar Telugu Kitchen in Aushapur serves biryani, South Indian, North Indian,
            Mughlai, Chinese, seafood and desserts — for the table and for takeaway.
          </p>
          <ul data-reveal className="mt-8 flex flex-wrap gap-2">
            {restaurant.categories.map((category) => (
              <li
                key={category}
                className="rounded-full border border-gold/30 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-gold"
              >
                {category}
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-10 text-sm text-warm/70">
            Zomato delivery rating {restaurant.zomato.deliveryRating}/5 from{' '}
            {restaurant.zomato.deliveryRatingCount.toLocaleString('en-IN')} delivery ratings.
          </p>
        </div>
      </div>
    </section>
  )
}
