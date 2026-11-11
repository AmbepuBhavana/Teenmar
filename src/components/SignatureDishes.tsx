import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { formatPrice } from '../data/menu'
import { restaurant, USING_REPRESENTATIVE_PHOTOS } from '../data/restaurant'
import { IMG, signatureDishes, type SignatureDish } from '../data/signature'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { openMenuCategory } from '../lib/menuIntent'
import { registerGsap } from '../lib/reveal'

export function SignatureDishes() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [timerKey, setTimerKey] = useState(0)
  const [isHoveringDish, setIsHoveringDish] = useState(false)
  const dish = signatureDishes[index]

  useLayoutEffect(() => {
    if (!root.current || reduced) return
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.from('[data-stage]', {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  useEffect(() => {
    if (reduced || isHoveringDish) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % signatureDishes.length)
    }, 3000)
    return () => window.clearInterval(id)
  }, [reduced, timerKey, isHoveringDish])

  const select = (next: number) => {
    setIndex((next + signatureDishes.length) % signatureDishes.length)
    setTimerKey((key) => key + 1)
  }

  const findInMenu = () => {
    openMenuCategory(dish.menuCategory)
    document.getElementById('menu')?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <section ref={root} id="specialities" className="scroll-mt-24 bg-[#170b08] text-warm" aria-label="Signature dishes">
      <link rel="preload" as="image" href={IMG[signatureDishes[0].name]} />
      <div className="relative min-h-[100svh]">
        <div className="stage-glow pointer-events-none absolute inset-0" style={{ backgroundColor: dish.plateColor1 }} />
        <EmberField enabled={!reduced} />

        <div
          className="signature-dish-layout relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col gap-6 px-5 pt-[calc(110px+env(safe-area-inset-top))] pb-10 min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:items-center min-[900px]:gap-10 min-[900px]:px-8 min-[900px]:py-24 min-[900px]:pt-[calc(110px+env(safe-area-inset-top))]"
        >
          <div className="order-0 col-span-2 mx-auto mb-[22px] w-full max-w-7xl min-w-0">
            <div className="pt-7 text-center">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#C9A24B]">
                TEENMAAR TELUGU KITCHEN
              </p>
              <h2 className="mt-2 font-display text-[32px] leading-[1.1] font-bold italic text-[#FFF9F0] min-[900px]:text-[40px]">
                Our Specialties
              </h2>
              <div aria-hidden="true" className="mt-3 flex items-center justify-center gap-[10px]">
                <span className="h-px w-12 bg-[rgba(201,162,75,0.6)]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[#C9A24B]" />
                <span className="h-px w-12 bg-[rgba(201,162,75,0.6)]" />
              </div>
            </div>
            <div className="mt-[30px] flex min-w-0 items-center gap-[14px]">
              <span
                className="flex-none rounded-full border border-[#D9A441] bg-[rgba(217,164,65,.10)] px-[18px] py-[6px] font-display text-[17px] font-bold italic text-[#D9A441]"
              >
                Signature
              </span>
              <span
                aria-hidden="true"
                className="h-px min-w-0 flex-1 bg-[linear-gradient(90deg,#D9A441,transparent)]"
              />
              <span
                aria-live="polite"
                className="flex-none font-sans text-[13px] font-medium tracking-[.12em] text-[#cdb79f]"
              >
                {index + 1} / {signatureDishes.length}
              </span>
            </div>
            <p className="mt-2 mb-0 font-sans text-[14px] text-[#cdb79f]">
              Plates from the Teenmaar kitchen
            </p>
          </div>

          <div
            data-stage
            className="dish-photo-stage relative z-0 order-1 flex justify-center min-[900px]:order-2"
            onPointerEnter={() => setIsHoveringDish(true)}
            onPointerLeave={() => setIsHoveringDish(false)}
          >
            <BrassPlate
              key={dish.name}
              dish={dish}
              photo={IMG[dish.name]}
              reduced={reduced}
              priority={index === 0}
            />
          </div>

          <div data-stage className="relative z-10 order-2 min-w-0 pt-2 min-[900px]:order-1">
            <div key={dish.name} className={reduced ? undefined : 'copy-rise'}>
              <h2
                className="font-display text-4xl leading-tight font-bold break-words italic min-[900px]:text-[clamp(2.6rem,6vw,5rem)]"
                style={{ marginBottom: 18, marginTop: 0 }}
              >
                {dish.name}
              </h2>
              <p className="dish-description mt-5 max-w-[42ch] text-base leading-7 text-warm/80">{dish.description}</p>
              <div className="dish-price-row mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
                <p className="dish-price font-display text-[clamp(48px,5vw,84px)] leading-none text-gold">
                  {formatPrice(dish.price)}
                </p>
                <p className="dish-category pb-1 text-sm text-warm/75 sm:pb-2 sm:text-base">From {dish.menuCategory}</p>
              </div>
            </div>
            <div className="dish-actions mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={findInMenu}
                className="dish-menu-button inline-flex min-h-12 items-center rounded-full bg-telugu px-6 text-sm font-semibold text-warm"
              >
                Find it in the menu
              </button>
              <a
                href={restaurant.phones[0].href}
                className="dish-call-button inline-flex min-h-12 items-center rounded-full border border-gold/50 px-6 text-sm font-semibold text-warm"
              >
                Call to order
              </a>
            </div>
          </div>

          <div className="dish-thumbnail-carousel order-3 col-span-2 mx-auto flex w-full min-w-0 items-center gap-3 pt-2 pb-8">
            <button
              type="button"
              aria-label="Previous signature dish"
              onClick={() => select(index - 1)}
              className="dish-thumbnail-arrow inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <div
              className="dish-thumbnail-strip no-scrollbar flex min-w-0 flex-1 gap-3 overflow-x-auto py-3"
              role="group"
              aria-label="Choose a signature dish"
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  select(index + 1)
                }
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  select(index - 1)
                }
              }}
            >
              {signatureDishes.map((item, itemIndex) => {
                const active    = itemIndex === index
                const thumbSrc  = IMG[item.name]
                return (
                  <button
                    key={item.name}
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    onClick={() => select(itemIndex)}
                    className={`dish-thumbnail-button w-[4.75rem] shrink-0 text-center ${active ? 'scale-110' : ''}`}
                  >
                    <span
                      className={`dish-thumbnail-image mx-auto block h-14 w-14 ${
                        active ? 'shadow-[0_0_0_2px_#D9A441,0_0_16px_rgba(217,164,65,0.75)]' : ''
                      }`}
                      style={{
                        background: `radial-gradient(circle at 40% 35%, ${item.plateColor1}, ${item.plateColor2})`,
                      }}
                    >
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt=""
                          aria-hidden="true"
                          width={56}
                          height={56}
                          decoding="async"
                          loading="lazy"
                          className="h-full w-full object-contain"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : null}
                    </span>
                    <span className="dish-thumbnail-label mt-2 block text-[0.65rem] leading-tight text-warm/80">{item.name}</span>
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              aria-label="Next signature dish"
              onClick={() => select(index + 1)}
              className="dish-thumbnail-arrow inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {USING_REPRESENTATIVE_PHOTOS ? (
        <p className="mx-auto max-w-7xl px-5 pb-2 text-center text-sm text-warm/70 min-[900px]:px-8">
          Dish photos are representative. Original Teenmaar photos coming soon.
        </p>
      ) : null}
    </section>
  )
}

function BrassPlate({
  dish,
  photo,
  reduced,
  priority,
}: {
  dish: SignatureDish
  photo?: string
  reduced: boolean
  priority: boolean
}) {
  const [failed, setFailed]   = useState(false)
  const [ready, setReady]     = useState(false)

  const showPhoto = Boolean(photo) && !failed && ready

  return (
    <div
      data-dish-photo-frame
      className={`relative mx-auto mb-6 aspect-square w-[min(78vw,360px)] shrink-0 overflow-visible isolate min-[900px]:mb-0 min-[900px]:w-[min(40vw,540px)] ${reduced ? '' : 'plate-enter'}`}
      aria-hidden={showPhoto ? undefined : true}
    >
      <div data-plate-shadow className="absolute inset-[8%] rounded-full bg-black/50 blur-2xl" aria-hidden="true" />

      <div data-plate-rim className="plate-rim absolute inset-0 rounded-full" aria-hidden="true" />

      <div data-plate-well className="plate-well absolute inset-[7%] rounded-full" aria-hidden="true" />

      <div
        data-plate-food
        className={`plate-food absolute inset-[11%] overflow-hidden rounded-full transition-opacity duration-[400ms] ${
          showPhoto ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 42% 38%, ${dish.plateColor1}, ${dish.plateColor2} 74%)`,
        }}
      >
        <div className="plate-grain absolute inset-0 rounded-full" style={{ opacity: dish.grain }} />
        <div className="plate-garnish absolute inset-0 rounded-full" />
      </div>

      {photo && !failed ? (
        <div data-dish-photo className="absolute inset-[11%] overflow-hidden rounded-full" aria-hidden={!ready}>
          <img
            src={photo}
            alt={`${dish.name} served in a brass vessel`}
            decoding="async"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            onLoad={() => setReady(true)}
            onError={() => setFailed(true)}
            className="dish-photo-image absolute inset-0 h-full w-full object-contain"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : null}

      <span className="steam steam-a" />
      <span className="steam steam-b" />
      <span className="steam steam-c" />
    </div>
  )
}

function EmberField({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const context = canvas.getContext('2d')
    if (!context) return

    const colors = ['#F28A19', '#D9A441', '#B74419', '#F7C56A']
    type Ember = {
      x: number
      y: number
      r: number
      speed: number
      drift: number
      phase: number
      alpha: number
      color: string
    }

    let embers: Ember[] = []
    let frame = 0
    let raf = 0

    const spawn = (width: number, height: number, anywhere = false): Ember => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 8,
      r: 1 + Math.random() * 2.2,
      speed: 0.28 + Math.random() * 0.75,
      drift: 0.35 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.55,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#F28A19',
    })

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      embers = Array.from({ length: 48 }, () => spawn(width, height, true))
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(parent)

    const tick = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)
      frame += 1
      for (const ember of embers) {
        ember.y -= ember.speed
        ember.x += Math.sin(frame / 42 + ember.phase) * ember.drift * 0.35
        const fade = ember.y < height * 0.22 ? Math.max(0, ember.y / (height * 0.22)) : 1
        context.globalAlpha = ember.alpha * fade
        context.fillStyle = ember.color
        context.beginPath()
        context.arc(ember.x, ember.y, ember.r, 0, Math.PI * 2)
        context.fill()
        if (ember.y < -12) Object.assign(ember, spawn(width, height))
      }
      context.globalAlpha = 1
      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [enabled])

  if (!enabled) return null
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
}
