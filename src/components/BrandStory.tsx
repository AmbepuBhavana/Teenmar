import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import {
  PLACE_DIRECTIONS_URL,
  PLACE_PHONE_HREF,
  PLACE_TEXT,
  PLACE_TITLE,
  STORY_IMAGE,
  STORY_INSET,
  storyCopy,
  storyTour,
  USING_REPRESENTATIVE_PHOTOS,
} from '../data/restaurant'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { revealOnScroll } from '../lib/reveal'

export function BrandStory() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (!root.current) return
    return revealOnScroll(root.current, reduced)
  }, [reduced])

  return (
    <section
      ref={root}
      id="story"
      className="scroll-mt-24 bg-ivory"
      style={{ padding: 'clamp(40px, 8vw, 56px) 5vw' }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
        }}
        className="grid grid-cols-1 items-start gap-8 min-[801px]:grid-cols-[5fr_7fr] min-[801px]:items-center min-[801px]:gap-11"
      >

        {/* ── Left column: copy ── */}
        <div data-reveal style={{ minWidth: 0 }}>

          {/* Eyebrow */}
          <p className="font-sans text-sm font-medium text-telugu">
            {storyCopy.eyebrow}
          </p>

          {/* Headline — exactly 2 lines */}
          <h2
            className="font-display text-brown"
            style={{
              fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)',
              lineHeight: 1.1,
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            {storyCopy.headline[0]}
            <br />
            <span className="italic text-telugu">{storyCopy.headline[1]}</span>
          </h2>

          {/* Body paragraph */}
          <p
            className="font-sans text-brown/80"
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              maxWidth: '46ch',
              marginBottom: 12,
            }}
          >
            {storyCopy.body}
          </p>

          {/* Telugu tagline — directly under body, minimal gap */}
          <p
            lang="te"
            className="font-telugu font-medium text-telugu"
            style={{ fontSize: '1.1rem', marginTop: 10 }}
          >
            తెలుగు వంటకాలు · ఆధునిక ఆతిథ్యం
          </p>

          {/* ── Place block — close to the tagline ── */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 16,
              borderTop: '1px solid #c9a24a',
            }}
          >
            <h3
              className="font-display italic text-brown"
              style={{ fontSize: '1.5rem', lineHeight: 1.2, marginBottom: 8 }}
            >
              {PLACE_TITLE}
            </h3>

            <p
              className="font-sans text-brown/80"
              style={{ fontSize: '0.95rem', lineHeight: 1.55, maxWidth: '46ch' }}
            >
              {PLACE_TEXT}
            </p>

            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
              <a
                href={PLACE_DIRECTIONS_URL}
                target="_blank"
                rel="noopener"
                className="font-sans text-telugu underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
                style={{ fontSize: '0.95rem' }}
              >
                Get directions
              </a>
              <a
                href={PLACE_PHONE_HREF}
                className="font-sans text-telugu underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
                style={{ fontSize: '0.95rem' }}
              >
                Call the restaurant
              </a>
            </div>
          </div>
        </div>

        {/* ── Right column: images ── */}
        <div
          data-reveal
          style={{ minWidth: 0 }}
          className="mt-8 min-[801px]:mt-0"
        >
          {/*
            Relative wrapper.
            margin-bottom: 6% gives the absolutely-positioned inset
            room below the main photo so it doesn't collide with the
            next section.
            overflow: visible so the inset can bleed outside.
          */}
          <div style={{ position: 'relative', marginBottom: '6%' }}>

            {/* Main building photo — full 4/3 frame, no crop */}
            <img
              src={STORY_IMAGE.src}
              alt={STORY_IMAGE.alt}
              width={STORY_IMAGE.width}
              height={STORY_IMAGE.height}
              loading="lazy"
              className={reduced ? '' : 'story-img-hover'}
              style={{
                width: '100%',
                aspectRatio: '4/3',
                objectFit: 'cover',
                borderRadius: 20,
                display: 'block',
                boxShadow: '14px 14px 0 #c9a24a44, 0 24px 50px #0004',
                transition: reduced ? 'none' : 'transform .5s ease',
              }}
            />

            {/*
              Inset corner photo.
              width: 32%; left: -7%; bottom: -9% (desktop).
              On mobile (≤800px) it is larger and fully inside the main image.
            */}
            <img
              src={STORY_INSET.src}
              alt={STORY_INSET.alt}
              loading="lazy"
              style={{
                objectPosition: STORY_INSET.focus,
                position: 'absolute',
                width: '32%',
                aspectRatio: '1',
                objectFit: 'cover',
                borderRadius: 16,
                border: '6px solid #f7f1e8',
                boxShadow: '0 12px 30px #0004',
                bottom: '-9%',
              }}
              className="story-inset-pos max-[800px]:!left-[4%] max-[800px]:!bottom-[-6%] max-[800px]:!w-[40%]"
            />
          </div>

          {/* Representative-photo notice */}
          {USING_REPRESENTATIVE_PHOTOS && (
            <p className="font-sans text-sm text-brown/50" style={{ marginTop: 8 }}>
              Photos are representative.
            </p>
          )}
        </div>
      </div>

      {/* ── Video block ── */}
      <StoryTour />
    </section>
  )
}


/* ─────────────────────────────────────────────────────────────────────────────
   StoryTour
   Muted autoplay loop with:
   • Near-viewport source loading (~300 px rootMargin, threshold 0)
   • Play / pause via IntersectionObserver (threshold 0.35)
   • Pause on tab hide (visibilitychange)
   • Sound toggle button (bottom-right, 44 px, espresso bg, gold icon)
   • Play / Pause button (bottom-left, same style)
   • prefers-reduced-motion: poster + native controls, no autoplay / loop
   • Autoplay-blocked / load-error: poster overlay + centred play button
───────────────────────────────────────────────────────────────────────────── */
function StoryTour() {
  const reduced = usePrefersReducedMotion()
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  /** True once we write the src — deferred until the frame is ~300 px away. */
  const [loaded, setLoaded] = useState(false)
  /** Mirrors the video's playing state for the Pause / Play button UI. */
  const [playing, setPlaying] = useState(false)
  /** Mirrors video.muted — starts true (required for autoplay). */
  const [muted, setMuted] = useState(true)
  /** Set when autoplay is blocked by the browser or the video fails to load. */
  const [failed, setFailed] = useState(false)

  /* ── Step 1: Load source when block enters ~300 px proximity ── */
  useEffect(() => {
    const node = frame.current
    if (!node) return

    // In reduced-motion mode we show native controls straight away.
    if (reduced) {
      setLoaded(true)
      return
    }

    if (!('IntersectionObserver' in window)) {
      setLoaded(true)
      return
    }

    const nearObs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoaded(true)
          nearObs.disconnect()
        }
      },
      { rootMargin: '300px 0px', threshold: 0 },
    )
    nearObs.observe(node)
    return () => nearObs.disconnect()
  }, [reduced])

  /* ── Step 2: Play while ≥35 % visible; pause otherwise ── */
  useEffect(() => {
    // Reduced-motion: never autoplay.
    if (reduced || !loaded) return

    const node = frame.current
    const v = video.current
    if (!node || !v) return

    const playObs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          v.play()
            .then(() => setPlaying(true))
            .catch(() => setFailed(true))
        } else {
          v.pause()
          setPlaying(false)
        }
      },
      { threshold: 0.35 },
    )
    playObs.observe(node)

    /* Pause when the user switches tabs or minimises the browser. */
    const onVisChange = () => {
      if (document.hidden) {
        v.pause()
        setPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', onVisChange)

    return () => {
      playObs.disconnect()
      document.removeEventListener('visibilitychange', onVisChange)
    }
  }, [reduced, loaded])

  /* ── Controls ── */
  const togglePlay = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
    // playing state is kept in sync via onPlay / onPause handlers on <video>.
  }

  const toggleMuted = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  /* ── Reduced-motion variant: poster + native browser controls ── */
  if (reduced) {
    return (
      <div data-reveal className="mx-[-5vw] mt-12 px-3 sm:mx-auto sm:mt-16 sm:max-w-[1000px] sm:px-5 lg:mt-20">
        <h3 className="text-center font-display text-[clamp(32px,4vw,48px)] italic text-brown">
          {storyTour.heading}
        </h3>
        <div
          ref={frame}
          className="mt-6 overflow-hidden rounded-[24px] bg-black shadow-[0_22px_50px_rgba(45,27,22,0.18)]"
        >
          {/* No autoPlay, no loop — user drives playback via native controls. */}
          <video
            ref={video}
            controls
            playsInline
            preload="metadata"
            poster={storyTour.poster}
            src={loaded ? storyTour.src : undefined}
            className="aspect-video w-full object-cover"
          >
            Your browser can&apos;t play this video.{' '}
            <a href={storyTour.src}>Watch the video</a>
          </video>
        </div>
        <p className="mt-3 text-center font-sans text-sm text-brown/50">{storyTour.caption}</p>
      </div>
    )
  }

  /* ── Normal variant: muted autoplay loop with custom controls ── */
  return (
    <div data-reveal className="mx-[-5vw] mt-12 px-3 sm:mx-auto sm:mt-16 sm:max-w-[1000px] sm:px-5 lg:mt-20">
      <h3 className="text-center font-display text-[clamp(32px,4vw,48px)] italic text-brown">
        {storyTour.heading}
      </h3>

      {/* 16:9 frame — 24 px radius, black background, soft shadow */}
      <div
        ref={frame}
        className="relative mt-6 overflow-hidden rounded-[24px] bg-black shadow-[0_22px_50px_rgba(45,27,22,0.18)]"
      >
        {/*
          muted      — required for autoplay in all browsers.
          playsInline — required for iOS Safari (prevents fullscreen takeover).
          loop       — seamless repeat.
          autoPlay   — browser attempts play on mount; IntersectionObserver
                       overrides to pause when off-screen.
          preload="metadata" — only fetches duration/dimensions until src is set.
          src        — deferred until loaded=true (near-viewport detection above).
          onPlay / onPause — keep the React playing state in sync with the DOM.
          onError    — surfaces load failures so the fallback overlay appears.
        */}
        <video
          ref={video}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={storyTour.poster}
          src={loaded ? storyTour.src : undefined}
          className="aspect-video w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />

        {/* ── Fallback overlay — autoplay blocked or video failed to load ── */}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 p-6 text-center">
            {/* Large centred play button — clicking retries play() */}
            <button
              onClick={() => {
                video.current
                  ?.play()
                  .then(() => {
                    setFailed(false)
                    setPlaying(true)
                  })
                  .catch(() => {})
              }}
              aria-label="Play video"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-telugu text-white transition-opacity hover:opacity-80"
            >
              <Play size={28} className="translate-x-0.5" />
            </button>
            <p className="font-sans text-sm text-white/75">
              Your browser can&apos;t play this video.{' '}
              <a
                href={storyTour.src}
                className="underline underline-offset-2"
              >
                Watch the video
              </a>
            </p>
          </div>
        )}

        {/* ── Custom controls — hidden while fallback overlay is shown ── */}
        {!failed && (
          <>
            {/*
              Play / Pause button — bottom-left.
              44 px target (h-11 w-11), semi-transparent espresso bg,
              gold icon, aria-label matches visible state.
            */}
            <button
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
              className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-espresso/70 text-gold shadow-sm backdrop-blur-sm transition-opacity hover:opacity-80"
            >
              {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
            </button>

            {/*
              Sound toggle button — bottom-right.
              aria-pressed reflects whether sound is ON (i.e. not muted).
              Clicking toggles video.muted and keeps the video playing.
            */}
            <button
              onClick={toggleMuted}
              aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
              aria-pressed={!muted}
              className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-espresso/70 text-gold shadow-sm backdrop-blur-sm transition-opacity hover:opacity-80"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </>
        )}
      </div>

      {/* Muted small caption */}
      <p className="mt-3 text-center font-sans text-sm text-brown/50">{storyTour.caption}</p>
    </div>
  )
}
