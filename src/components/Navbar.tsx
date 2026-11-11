import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { restaurant, WHATSAPP_NUMBER } from '../data/restaurant'
import { BrandMark } from './BrandMark'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const [topBarHeight, setTopBarHeight] = useState(0)
  const header = useRef<HTMLElement>(null)
  const mobileTabs = useRef<HTMLElement>(null)
  const whatsappNumber = WHATSAPP_NUMBER.replace(/\D/g, '')
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : ''

  useEffect(() => {
    const node = header.current
    if (!node) return
    const root = document.documentElement
    const previousScrollPadding = root.style.getPropertyValue('scroll-padding-top')
    const previousScrollPaddingPriority = root.style.getPropertyPriority('scroll-padding-top')
    const sections = restaurant.nav
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null)
    const previousScrollMargins = new Map(sections.map((section) => [section, section.style.scrollMarginTop]))

    const updateHeight = () => {
      const height = Math.ceil(node.getBoundingClientRect().height)
      setTopBarHeight(height)
      document.documentElement.style.setProperty('--top-bar-height', `${height}px`)
      root.style.setProperty('scroll-padding-top', '0px')
      sections.forEach((section) => {
        section.style.scrollMarginTop = `${height}px`
      })
    }

    updateHeight()
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(node)
    return () => {
      resizeObserver.disconnect()
      root.style.removeProperty('--top-bar-height')
      if (previousScrollPadding) {
        root.style.setProperty('scroll-padding-top', previousScrollPadding, previousScrollPaddingPriority)
      } else {
        root.style.removeProperty('scroll-padding-top')
      }
      previousScrollMargins.forEach((margin, section) => {
        section.style.scrollMarginTop = margin
      })
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = restaurant.nav
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null)
    if (!sections.length) return

    const updateActiveSection = () => {
      const line = topBarHeight + 8
      const current = sections
        .filter((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top <= line && rect.bottom > line
        })
        .sort(
          (left, right) =>
            left.getBoundingClientRect().top - right.getBoundingClientRect().top,
        )
        .at(-1)
      const next = sections
        .filter((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top > line && rect.top < window.innerHeight
        })
        .sort(
          (left, right) =>
            left.getBoundingClientRect().top - right.getBoundingClientRect().top,
        )[0]
      const activeSection = current ?? next
      if (activeSection) setActiveId(activeSection.id)
    }

    const observer = new IntersectionObserver(
      updateActiveSection,
      { rootMargin: `-${topBarHeight}px 0px -65% 0px`, threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [topBarHeight])

  useEffect(() => {
    const nav = mobileTabs.current
    if (!nav) return
    const activeTab = nav.querySelector<HTMLElement>(`[data-nav-id="${activeId}"]`)
    if (!activeTab) return
    const navRect = nav.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()
    const left = tabRect.left - navRect.left + nav.scrollLeft
    const right = left + tabRect.width
    if (left < nav.scrollLeft) {
      nav.scrollTo({ left, behavior: 'smooth' })
    } else if (right > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: right - nav.clientWidth, behavior: 'smooth' })
    }
  }, [activeId])

  const scrollTo = (id: string, href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
    history.pushState(null, '', href)
    setActiveId(id)
  }

  return (
    <header
      id="top"
      ref={header}
      className={`sticky top-0 z-30 border-b border-[#d9a441]/[0.28] bg-[#170b08] min-[900px]:fixed min-[900px]:inset-x-0 min-[900px]:top-0 ${
        scrolled
          ? 'min-[900px]:border-[#d9a441]/[0.28] min-[900px]:bg-[#170b08]'
          : 'min-[900px]:border-transparent min-[900px]:bg-[linear-gradient(to_bottom,rgba(23,11,8,.5),rgba(23,11,8,.15)_65%,transparent)]'
      }`}
    >
      <div className="flex items-center justify-between gap-[10px] px-[14px] pt-[calc(8px+env(safe-area-inset-top))] pb-2 min-[900px]:mx-auto min-[900px]:max-w-7xl min-[900px]:gap-4 min-[900px]:px-8 min-[900px]:py-4">
        <BrandMark
          className="min-w-0 shrink-0 gap-[10px] [&_span]:whitespace-nowrap"
          imageClassName="h-11 w-11"
          href="#top"
          wordmarkClassName="text-[17px] font-bold tracking-[0.06em] [text-shadow:0_1px_3px_rgba(0,0,0,.9),0_0_12px_rgba(0,0,0,.7)]"
          subtitleClassName="text-[10px] font-medium tracking-[0.2em]"
          showImage
        />

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 min-[900px]:flex xl:gap-4" aria-label="Primary">
          {restaurant.nav.map((item) => (
            <a
              key={item.id}
              data-nav-id={item.id}
              href={item.href}
              aria-current={activeId === item.id ? 'page' : undefined}
              onClick={scrollTo(item.id, item.href)}
              className={`whitespace-nowrap text-[0.68rem] font-medium uppercase tracking-[0.12em] transition-colors hover:text-gold xl:text-[0.72rem] xl:tracking-[0.18em] ${
                activeId === item.id ? 'text-gold' : 'text-warm/80'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 flex-col items-end gap-1 min-[900px]:flex">
          <div className="flex items-center gap-2">
            <a
              href="#order"
              onClick={scrollTo('order', '#order')}
              className="inline-flex items-center rounded-full bg-telugu px-4 py-2 text-[0.72rem] font-semibold whitespace-nowrap text-warm"
            >
              Order online
            </a>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat on WhatsApp at ${restaurant.phones[0].number}`}
                className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-2 text-[0.72rem] font-semibold whitespace-nowrap text-white"
              >
                <MessageCircle size={14} aria-hidden="true" />
                WhatsApp
              </a>
            ) : null}
            <a
              href={restaurant.phones[0].href}
              className="inline-flex items-center rounded-full border border-gold/50 px-4 py-2 text-[0.72rem] font-semibold whitespace-nowrap text-gold"
            >
              Call
            </a>
          </div>
          <span className="text-[0.65rem] text-warm/75">11:30 AM – 11:30 PM</span>
        </div>

        <a
          href="#order"
          onClick={scrollTo('order', '#order')}
          className="inline-flex shrink-0 items-center rounded-full bg-[#85170D] px-[14px] py-[9px] text-[13px] font-semibold whitespace-nowrap text-warm min-[900px]:hidden"
        >
          Order online
        </a>
      </div>

      <nav
        ref={mobileTabs}
        className="no-scrollbar flex overflow-x-auto px-2 min-[900px]:hidden"
        aria-label="Main"
      >
        {restaurant.nav.map((item) => (
          <a
            key={item.id}
            data-nav-id={item.id}
            href={item.href}
            aria-current={activeId === item.id ? 'page' : undefined}
            onClick={scrollTo(item.id, item.href)}
            className={`flex-none border-b-2 px-[11px] pt-3 pb-[11px] text-[11.5px] whitespace-nowrap uppercase tracking-[0.16em] transition-colors duration-200 ${
              activeId === item.id ? 'border-[#D9A441] text-[#D9A441]' : 'border-transparent text-[#E8D7C2]'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
