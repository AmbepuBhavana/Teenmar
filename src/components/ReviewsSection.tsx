import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { GOOGLE_RATING, MENTIONS, REVIEWS } from '../data/reviews'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const filledStars = Math.floor(GOOGLE_RATING.score)
const scoreLabel = GOOGLE_RATING.score.toFixed(1)
const countLabel = GOOGLE_RATING.count.toLocaleString('en-US')

export function ReviewsSection() {
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = () => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setProgress(max <= 1 ? 1 : track.scrollLeft / max)
    setEdges({
      start: track.scrollLeft <= 1,
      end: max <= 1 || track.scrollLeft >= max - 1,
    })
  }

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    measure()
    const observer = new ResizeObserver(() => measure())
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  const scrollTrack = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    const destination = Math.max(0, Math.min(max, track.scrollLeft + direction * track.clientWidth * 0.85))
    track.scrollTo({ left: destination, behavior: 'auto' })
    measure()
  }

  return (
    <section className="relative overflow-hidden bg-[#170b08] text-warm" aria-labelledby="google-reviews-heading">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 18% 40%, rgba(87, 16, 11, 0.95) 0%, rgba(23, 11, 8, 0) 58%)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-[340px_minmax(0,1fr)] md:py-24 lg:px-8">
        <div className="min-w-0">
          <h2 id="google-reviews-heading" className="font-display text-[clamp(36px,4vw,56px)] leading-[1.05] italic">
            What guests say on Google.
          </h2>
          <div className="mt-6 flex flex-wrap items-end gap-4">
            <p className="font-display text-[clamp(72px,8vw,104px)] leading-none font-bold text-gold">{scoreLabel}</p>
            <div className="flex gap-1 pb-3" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={18}
                  className={index < filledStars ? 'fill-gold text-gold' : 'fill-gold/20 text-gold/35'}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-warm/80">
            Rated {scoreLabel} from {countLabel} Google reviews
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {MENTIONS.map((mention) => (
              <li
                key={mention.label}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-sm text-warm"
              >
                {mention.label}
                <span className="font-semibold text-gold">{mention.n}</span>
              </li>
            ))}
          </ul>
          <a
            href={GOOGLE_RATING.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center rounded-full border border-gold px-5 text-sm font-semibold text-gold"
          >
            Read all reviews on Google
          </a>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex justify-end gap-3">
            <button
              type="button"
              aria-label="Previous reviews"
              disabled={edges.start}
              onClick={() => scrollTrack(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold disabled:opacity-35"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              disabled={edges.end}
              onClick={() => scrollTrack(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold disabled:opacity-35"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
          <div
            ref={trackRef}
            onScroll={measure}
            tabIndex={0}
            aria-label="Google review excerpts"
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain"
          >
            {REVIEWS.map((review) => (
              <article
                key={review.name}
                className="flex w-[72vw] shrink-0 snap-start flex-col rounded-3xl bg-[#241410] p-6 md:w-[clamp(260px,26vw,330px)]"
              >
                <span className="font-display text-6xl leading-none text-gold" aria-hidden="true">
                  “
                </span>
                <p className="mt-3 flex-1 text-sm leading-6 text-warm/90">{review.text}</p>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-terracotta font-display text-lg font-bold text-espresso"
                    aria-hidden="true"
                  >
                    {review.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-warm">{review.name}</span>
                    <span className="block text-xs text-warm/65">Google review</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 h-[3px] bg-warm/15" aria-hidden="true">
            <div
              className="h-full bg-gold"
              style={{ width: `${progress * 100}%`, transition: reduced ? 'none' : undefined }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
