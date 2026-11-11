import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  allGalleryItems,
  galleryItems,
  USING_STOCK_PHOTOS,
  visibleGalleryFilters,
  type GalleryCategory,
} from '../data/gallery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { revealOnScroll } from '../lib/reveal'

export function GallerySection() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [filter, setFilter] = useState<GalleryCategory>('all')
  const [active, setActive] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (!root.current) return
    return revealOnScroll(root.current, reduced)
  }, [reduced])

  const filters = useMemo(() => visibleGalleryFilters(galleryItems), [])

  useEffect(() => {
    if (!filters.some((item) => item.id === filter)) setFilter('all')
  }, [filter, filters])

  const items = useMemo(
    () => (filter === 'all' ? allGalleryItems : galleryItems.filter((item) => item.category === filter)),
    [filter],
  )

  const close = () => setActive(null)
  const show = active !== null ? items[active] : null

  useEffect(() => {
    if (active === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') {
        setActive((value) => (value === null ? 0 : (value + 1) % items.length))
      }
      if (event.key === 'ArrowLeft') {
        setActive((value) => (value === null ? 0 : (value + items.length - 1) % items.length))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, items.length])

  return (
    <section ref={root} id="gallery" className="scroll-mt-24 bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p data-reveal className="text-[0.68rem] uppercase tracking-[0.38em] text-terracotta">
          04 — Gallery
        </p>
        <h2 data-reveal className="mt-4 font-display text-4xl sm:text-5xl">
          A table in pictures.
        </h2>
        {USING_STOCK_PHOTOS ? (
          <p className="mt-4 max-w-xl text-sm text-brown/60">
            Photos are representative. Original restaurant photos coming soon.
          </p>
        ) : null}

        <div className="no-scrollbar mt-8 flex w-full min-w-0 gap-2 overflow-x-auto pb-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] ${
                filter === item.id ? 'bg-espresso text-warm' : 'bg-warm text-brown/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="masonry mt-10">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-reveal
              className={`masonry-item group relative block w-full overflow-hidden ${
                item.featured ? '' : ''
              }`}
              onClick={() => setActive(index)}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                  item.featured ? 'aspect-[4/5]' : 'aspect-[4/3]'
                }`}
                loading="lazy"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/80 to-transparent p-4 text-left text-sm text-warm opacity-0 transition group-hover:opacity-100">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {show && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={show.title}
          onClick={close}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-warm"
            onClick={close}
            aria-label="Close image viewer"
          >
            <X />
          </button>
          <button
            type="button"
            className="absolute left-4 text-warm"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation()
              setActive((value) => (value === null ? 0 : (value + items.length - 1) % items.length))
            }}
          >
            <ChevronLeft size={32} />
          </button>
          <figure className="max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img src={show.src} alt={show.alt} className="max-h-[82vh] w-full object-contain" />
            <figcaption className="mt-3 text-center text-sm text-warm/80">{show.title}</figcaption>
          </figure>
          <button
            type="button"
            className="absolute right-4 text-warm"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation()
              setActive((value) => (value === null ? 0 : (value + 1) % items.length))
            }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  )
}
