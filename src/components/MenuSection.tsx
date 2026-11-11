import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  formatPrice,
  menuCategories,
  menuNotes,
  type Diet,
  type MenuCategory,
  type MenuItem,
} from '../data/menu'
import { restaurant, SHOW_RESERVATION } from '../data/restaurant'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { MENU_CATEGORY_EVENT } from '../lib/menuIntent'
import { OrderSection } from './OrderSection'
import { ReservationSection } from './ReservationSection'
import { ReviewsSection } from './ReviewsSection'

type DietFilter = 'all' | 'veg' | 'nonveg'

const dietOptions: { id: DietFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Veg' },
  { id: 'nonveg', label: 'Non-Veg' },
]

function categoryDietLabel(diet: MenuCategory['diet']): string {
  if (diet === 'veg') return 'Pure Vegetarian'
  if (diet === 'nonveg') return 'Non-Vegetarian'
  return 'Veg & Non-Veg'
}

function matchesDiet(item: MenuItem, filter: DietFilter) {
  return filter === 'all' || item.diet === filter
}

function categoryMatchesDietFilter(cat: MenuCategory, filter: DietFilter) {
  if (filter === 'all') return true
  return cat.items.some((item) => item.diet === filter)
}

/* ─── Veg / Non-veg indicator dot ─────────────────────────────────────── */
function DietDot({ diet }: { diet: Diet }) {
  const isVeg = diet === 'veg'
  return (
    <span
      aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      className="mt-0.5 inline-flex shrink-0 items-center justify-center"
    >
      <span
        className={`block h-3 w-3 border-[1.5px] ${
          isVeg
            ? 'border-[#1e8a4c] bg-[#1e8a4c]/20'
            : 'border-[#c0261b] bg-[#c0261b]/20'
        }`}
        style={{ borderRadius: 2 }}
      >
        <span
          className={`block m-[2px] rounded-full ${isVeg ? 'bg-[#1e8a4c]' : 'bg-[#c0261b]'}`}
          style={{ width: 5, height: 5 }}
        />
      </span>
    </span>
  )
}

/* ─── Single dish row inside the card ──────────────────────────────────── */
function DishRow({ item }: { item: MenuItem }) {
  return (
    <li className="flex min-h-[44px] items-start gap-3 py-2.5 border-b border-gold/10 last:border-0">
      <DietDot diet={item.diet} />
      {/* Name */}
      <span className="flex-1 font-sans text-sm font-semibold leading-snug text-[#f5ede0] min-w-0">
        {item.name}
      </span>
      {/* Dotted gold leader */}
      <span
        aria-hidden="true"
        className="hidden shrink-0 sm:flex flex-1 self-center overflow-hidden mx-2"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg,#d9a441 0,#d9a441 3px,transparent 3px,transparent 8px)',
          backgroundSize: '8px 1px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          minWidth: 24,
          height: 1,
        }}
      />
      {/* Price */}
      <span className="shrink-0 font-fraunces text-[15px] font-semibold text-gold tabular-nums">
        {formatPrice(item.price)}
      </span>
    </li>
  )
}

/* ─── The printed menu card ─────────────────────────────────────────────── */
interface CardProps {
  category: MenuCategory
  filteredItems: MenuItem[]
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
  cardKey: string
  reduced: boolean
}

function MenuCard({
  category,
  filteredItems,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  cardKey,
  reduced,
}: CardProps) {
  return (
    /* Espresso outer mat */
    <div className="rounded-2xl bg-[#21130f] p-3.5">
      {/* Gold double-border inner frame */}
      <div
        className="rounded-xl"
        style={{
          border: '1.5px solid #d9a441',
          boxShadow: 'inset 0 0 0 9.5px #21130f, inset 0 0 0 11px #d9a441',
          padding: '24px 20px 20px',
        }}
      >
        {/* Card header */}
        <div className="mb-5 text-center">
          <p className="text-lg tracking-widest text-gold select-none" aria-hidden="true">
            ✦ ❖ ✦
          </p>
          <h3 className="mt-2 font-fraunces text-[clamp(24px,4vw,36px)] italic font-light leading-tight text-[#f5ede0]">
            {category.label}
          </h3>
          <p className="mt-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-saffron">
            {categoryDietLabel(category.diet)}
          </p>
        </div>

        {/* Dish list — aria-live so screen readers announce changes */}
        <ul
          key={cardKey}
          aria-live="polite"
          aria-label={`${category.label} dishes`}
          className={reduced ? undefined : 'menu-card-fade'}
        >
          {filteredItems.length === 0 ? (
            <li className="py-8 text-center font-sans text-sm text-[#f5ede0]/50">
              No dishes in this category match your filter.
            </li>
          ) : (
            filteredItems.map((item) => <DishRow key={item.id} item={item} />)
          )}
        </ul>

        {/* Prev / Next navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="Previous category"
            className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 font-sans text-sm text-gold transition-opacity hover:opacity-70 disabled:opacity-25"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Prev
          </button>
          <span className="font-sans text-xs text-[#f5ede0]/40">
            {filteredItems.length} dish{filteredItems.length !== 1 ? 'es' : ''}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next category"
            className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 font-sans text-sm text-gold transition-opacity hover:opacity-70 disabled:opacity-25"
          >
            Next
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Search results view (all categories, grouped) ─────────────────────── */
function SearchResults({
  query,
  groups,
}: {
  query: string
  groups: { label: string; items: MenuItem[] }[]
}) {
  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0)

  if (totalCount === 0) {
    return (
      <div className="rounded-2xl bg-[#21130f] p-3.5">
        <div
          className="rounded-xl px-6 py-10 text-center"
          style={{
            border: '1.5px solid #d9a441',
            boxShadow: 'inset 0 0 0 9.5px #21130f, inset 0 0 0 11px #d9a441',
          }}
        >
          <p className="font-fraunces text-2xl italic text-[#f5ede0]">Nothing found.</p>
          <p className="mt-2 font-sans text-sm text-[#f5ede0]/55">
            No dishes found for &ldquo;{query}&rdquo;. Try another word.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-[#21130f] p-3.5">
      <div
        className="rounded-xl"
        style={{
          border: '1.5px solid #d9a441',
          boxShadow: 'inset 0 0 0 9.5px #21130f, inset 0 0 0 11px #d9a441',
          padding: '24px 20px 20px',
        }}
      >
        <p className="mb-4 text-center font-sans text-xs text-[#f5ede0]/50">
          {totalCount} result{totalCount !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
              {group.label}
            </p>
            <ul aria-label={group.label}>
              {group.items.map((item) => (
                <DishRow key={item.id} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main section ──────────────────────────────────────────────────────── */
export function MenuSection() {
  const reduced = usePrefersReducedMotion()
  const indexRef = useRef<HTMLDivElement>(null)
  const chipBarRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [diet, setDiet] = useState<DietFilter>('all')
  const [activeId, setActiveId] = useState(menuCategories[0].id)

  const needle = query.trim().toLowerCase()
  const searching = needle.length > 0

  /* Listen for external category-open events (from SignatureDishes etc.) */
  useEffect(() => {
    const onOpen = (event: Event) => {
      const label = (event as CustomEvent<string>).detail
      const match = menuCategories.find((c) => c.label === label)
      if (!match) return
      setDiet('all')
      setQuery('')
      setActiveId(match.id)
    }
    window.addEventListener(MENU_CATEGORY_EVENT, onOpen)
    return () => window.removeEventListener(MENU_CATEGORY_EVENT, onOpen)
  }, [])

  /* Categories filtered by diet toggle */
  const visibleCategories = useMemo(
    () => menuCategories.filter((c) => categoryMatchesDietFilter(c, diet)),
    [diet],
  )

  /* When the active category is filtered out, snap to the first visible one */
  useEffect(() => {
    if (!visibleCategories.find((c) => c.id === activeId)) {
      setActiveId(visibleCategories[0]?.id ?? menuCategories[0].id)
    }
  }, [visibleCategories, activeId])

  const activeIndex = visibleCategories.findIndex((c) => c.id === activeId)
  const activeCategory =
    visibleCategories[activeIndex] ?? visibleCategories[0] ?? menuCategories[0]

  /* Items inside the active card, filtered by diet */
  const cardItems = useMemo(
    () => activeCategory.items.filter((item) => matchesDiet(item, diet)),
    [activeCategory, diet],
  )

  /* Search: gather matching items grouped by category */
  const searchGroups = useMemo(() => {
    if (!searching) return []
    return menuCategories
      .map((cat) => ({
        label: cat.label,
        items: cat.items.filter(
          (item) => matchesDiet(item, diet) && item.name.toLowerCase().includes(needle),
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [searching, needle, diet])

  const selectCategory = (id: string) => {
    setQuery('')
    setActiveId(id)
    /* Scroll chip into view on mobile */
    const chip = chipBarRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`)
    chip?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
  }

  const goNext = () => {
    const next = visibleCategories[activeIndex + 1]
    if (next) selectCategory(next.id)
  }
  const goPrev = () => {
    const prev = visibleCategories[activeIndex - 1]
    if (prev) selectCategory(prev.id)
  }

  const cardKey = searching
    ? `search:${needle}:${diet}`
    : `${activeCategory.id}:${diet}`

  /* Scroll the sticky index row into view when active changes */
  useEffect(() => {
    const row = indexRef.current?.querySelector<HTMLElement>(`[data-id="${activeId}"]`)
    if (!row) return
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeId])

  return (
    <section
      id="menu"
      className="scroll-mt-24"
      style={{
        background: 'linear-gradient(160deg, #F2B04A 0%, #F28A19 50%, #D9742A 100%)',
      }}
    >
      {/* ── Section header ── */}
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-20 md:pt-28 lg:px-8">
        <h2 className="font-fraunces text-[clamp(40px,6vw,72px)] leading-[1.0] text-espresso">
          <span className="font-semibold">The Teenmaar</span>{' '}
          <span
            className="italic font-light"
            style={{ color: '#57100b' }}
          >
            table.
          </span>
        </h2>
        <p className="mt-3 font-sans text-[13px] leading-6 text-espresso/70">
          {menuNotes.gst.replace('.', '')} · {menuNotes.prep.replace('Preparation time: ', 'Preparation time ').replace('.', '')} · {menuNotes.availability}
        </p>
      </div>

      {/* ── Controls: search + diet filter ── */}
      <div className="mx-auto max-w-7xl px-5 pb-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search pill */}
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search dishes</span>
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-espresso/40"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, e.g. biryani, paneer…"
              className="h-11 w-full rounded-full bg-[#f5ede0] pl-10 pr-10 font-sans text-sm text-espresso outline-none placeholder:text-espresso/40 focus:ring-2 focus:ring-espresso/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-espresso/40 hover:text-espresso"
              >
                <X size={15} />
              </button>
            )}
          </label>

          {/* Diet segmented toggle */}
          <div
            role="group"
            aria-label="Filter by diet"
            className="flex shrink-0 rounded-full bg-espresso/20 p-1"
          >
            {dietOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={diet === opt.id}
                onClick={() => setDiet(opt.id)}
                className={`min-h-[36px] rounded-full px-5 font-sans text-sm font-semibold transition-colors ${
                  diet === opt.id
                    ? 'bg-espresso text-gold shadow-sm'
                    : 'text-espresso hover:bg-espresso/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile chip bar ── */}
      <div
        ref={chipBarRef}
        className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-4 lg:hidden"
        role="group"
        aria-label="Menu categories"
      >
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            data-id={cat.id}
            type="button"
            aria-pressed={cat.id === activeId}
            onClick={() => selectCategory(cat.id)}
            className={`shrink-0 min-h-[44px] rounded-full px-4 font-sans text-sm font-semibold whitespace-nowrap transition-colors ${
              cat.id === activeId
                ? 'bg-espresso text-gold'
                : 'bg-espresso/20 text-espresso hover:bg-espresso/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Desktop two-column layout ── */}
      <div className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-10 lg:items-start">

          {/* ── LEFT: sticky category index (desktop only) ── */}
          <div
            ref={indexRef}
            className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
            aria-label="Menu categories"
          >
            <div className="border-t-2 border-espresso">
              {visibleCategories.map((cat, i) => {
                const active = cat.id === activeId
                const itemCount = cat.items.filter((item) => matchesDiet(item, diet)).length
                return (
                  <button
                    key={cat.id}
                    data-id={cat.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectCategory(cat.id)}
                    className={`group flex w-full min-h-[44px] items-center gap-3 border-b border-espresso/20 px-3 py-3 text-left transition-all duration-200 ${
                      active
                        ? 'bg-espresso text-gold'
                        : 'text-espresso hover:translate-x-[10px] hover:bg-espresso/10'
                    }`}
                    style={reduced ? undefined : undefined}
                  >
                    {/* Number */}
                    <span
                      className={`w-7 shrink-0 font-fraunces text-xs italic ${
                        active ? 'text-gold/60' : 'text-espresso/40'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Label */}
                    <span className="flex-1 font-sans text-sm font-semibold leading-snug">
                      {cat.label}
                    </span>
                    {/* Count */}
                    <span
                      className={`shrink-0 font-sans text-xs tabular-nums ${
                        active ? 'text-gold/60' : 'text-espresso/40'
                      }`}
                    >
                      {itemCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── RIGHT: menu card or search results ── */}
          <div aria-live="polite" aria-label="Menu content">
            {searching ? (
              <SearchResults query={query.trim()} groups={searchGroups} />
            ) : (
              <MenuCard
                category={activeCategory}
                filteredItems={cardItems}
                onPrev={goPrev}
                onNext={goNext}
                hasPrev={activeIndex > 0}
                hasNext={activeIndex < visibleCategories.length - 1}
                cardKey={cardKey}
                reduced={reduced}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Sections that live inside the menu section ── */}
      <OrderSection />
      {SHOW_RESERVATION ? <ReservationSection /> : null}
      <ReviewsSection />

      {/* ── CTA footer bar ── */}
      <div className="bg-espresso text-warm">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between lg:px-8">
          <h3 className="font-fraunces text-4xl italic font-light md:text-5xl">Hungry already?</h3>
          <div className="flex flex-wrap gap-3">
            {restaurant.phones.map((phone) => (
              <a
                key={phone.number}
                href={phone.href}
                className="inline-flex min-h-12 items-center rounded-full bg-telugu px-5 font-sans text-sm font-semibold text-warm"
              >
                Call {phone.number}
              </a>
            ))}
            <a
              href={restaurant.maps.directions}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center rounded-full border border-gold/50 px-5 font-sans text-sm font-semibold text-gold"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
