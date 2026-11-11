import { MapPin, Phone, Globe, ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { ZOMATO_URL, restaurant, WHATSAPP_NUMBER } from '../data/restaurant'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { revealOnScroll } from '../lib/reveal'

export function ContactSection() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const whatsappNumber = WHATSAPP_NUMBER.replace(/\D/g, '')
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : ''

  useLayoutEffect(() => {
    if (!root.current) return
    return revealOnScroll(root.current, reduced)
  }, [reduced])

  return (
    <section ref={root} id="contact" className="scroll-mt-24 bg-ivory py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <p data-reveal className="text-[0.68rem] uppercase tracking-[0.38em] text-terracotta">
            06 — Contact
          </p>
          <h2 data-reveal className="mt-4 font-display text-4xl sm:text-5xl">
            {restaurant.name}
          </h2>
          <p data-reveal className="mt-3 text-brown/60">
            {restaurant.type} · Maintained by {restaurant.maintainedBy}
          </p>

          <address data-reveal className="mt-10 not-italic">
            <p className="flex items-start gap-3 text-lg leading-8">
              <MapPin className="mt-1 shrink-0 text-telugu" size={18} aria-hidden="true" />
              {restaurant.address.formatted}
            </p>
          </address>

          <div data-reveal className="mt-8 space-y-3">
            {restaurant.phones.map((phone) => (
              <a
                key={phone.number}
                href={phone.href}
                className="flex items-center gap-3 text-xl font-medium text-brown hover:text-telugu"
              >
                <Phone size={18} className="text-telugu" aria-hidden="true" />
                {phone.number}
              </a>
            ))}
            <a
              href={restaurant.website}
              className="flex items-center gap-3 text-brown/80 hover:text-telugu"
            >
              <Globe size={18} className="text-telugu" aria-hidden="true" />
              www.teenmaartelugukitchen.com
            </a>
          </div>

          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            <a
              href={restaurant.phones[0].href}
              className="inline-flex min-h-12 items-center rounded-full bg-telugu px-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-warm"
            >
              Call Restaurant 1
            </a>
            <a
              href={restaurant.phones[1].href}
              className="inline-flex min-h-12 items-center rounded-full border border-brown/20 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-brown"
            >
              Call Restaurant 2
            </a>
            <a
              href={restaurant.maps.directions}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-warm"
            >
              Get Directions <ArrowUpRight size={14} />
            </a>
            <a
              href="#menu"
              className="inline-flex min-h-12 items-center rounded-full border border-terracotta px-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-terracotta"
            >
              Explore Menu
            </a>
          </div>

          <div data-reveal className="mt-10">
            <p className="text-xs uppercase tracking-[0.22em] text-brown/45">Social</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <a href={restaurant.social.facebook.href} target="_blank" rel="noreferrer" className="hover:text-telugu">
                Facebook
              </a>
              <a href={restaurant.social.instagram.href} target="_blank" rel="noreferrer" className="hover:text-telugu">
                {restaurant.social.instagram.label}
              </a>
              <a href={restaurant.social.x.href} target="_blank" rel="noreferrer" className="hover:text-telugu">
                {restaurant.social.x.label}
              </a>
            </div>
          </div>

          <p data-reveal className="mt-10 max-w-md text-sm text-brown/65">
            For a restaurant enquiry, call either number above.
          </p>
          <a
            href={ZOMATO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-telugu underline"
          >
            Order on Zomato
          </a>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#25D366] px-5 text-[0.72rem] font-semibold tracking-[0.16em] text-warm uppercase"
            >
              WhatsApp
            </a>
          ) : null}
        </div>

        <div data-reveal className="min-h-[420px] overflow-hidden border border-brown/10 bg-warm">
          <iframe
            title="Map of Teenmaar Telugu Kitchen, Aushapur"
            src={restaurant.maps.embed}
            className="h-full min-h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
