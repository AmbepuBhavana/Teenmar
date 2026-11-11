import { ArrowUp } from 'lucide-react'
import { ZOMATO_URL, restaurant } from '../data/restaurant'
import { BrandMark } from './BrandMark'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-espresso text-warm">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <BrandMark />
          <p className="mt-6 max-w-sm text-sm leading-6 text-warm/65">
            {restaurant.name}. Maintained by {restaurant.maintainedBy}.
          </p>
          <p className="mt-4 text-sm text-warm/55">{restaurant.address.formatted}</p>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-gold">Navigate</p>
          <ul className="mt-4 space-y-2">
            {restaurant.nav.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="text-sm text-warm/75 hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#menu" className="text-sm text-warm/75 hover:text-gold">
                Menu shortcut
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-gold">Order</p>
          <ul className="mt-4 space-y-2 text-sm">
            {restaurant.phones.map((phone) => (
              <li key={phone.number}>
                <a href={phone.href} className="text-warm/75 hover:text-gold">
                  {phone.number}
                </a>
              </li>
            ))}
            <li>
              <a href={ZOMATO_URL} target="_blank" rel="noopener noreferrer" className="text-warm/75 hover:text-gold">
                Order on Zomato
              </a>
            </li>
            <li>
              <a href={restaurant.maps.directions} target="_blank" rel="noreferrer" className="hover:text-gold">
                Get Directions
              </a>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-warm/75">
            <a href={restaurant.social.facebook.href} target="_blank" rel="noreferrer" className="hover:text-gold">
              {restaurant.social.facebook.label}
            </a>
            <a href={restaurant.social.instagram.href} target="_blank" rel="noreferrer" className="hover:text-gold">
              {restaurant.social.instagram.label}
            </a>
            <a href={restaurant.social.x.href} target="_blank" rel="noreferrer" className="hover:text-gold">
              {restaurant.social.x.label}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-warm/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
          <p className="text-xs text-warm/45">
            © {year} {restaurant.name}. All rights reserved.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gold"
            onClick={() => {
              const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
            }}
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
