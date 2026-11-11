import { useLayoutEffect, useRef } from 'react'

type MenuNavCategory = {
  id: string
  label: string
  count: number
}

type MenuCategoryNavigationProps = {
  categories: MenuNavCategory[]
  activeId: string
  reduced: boolean
  onSelect: (id: string) => void
}

export function MenuCategoryNavigation({
  categories,
  activeId,
  reduced,
  onSelect,
}: MenuCategoryNavigationProps) {
  const bar = useRef<HTMLDivElement>(null)
  const categoryKey = categories.map((category) => category.id).join('|')

  useLayoutEffect(() => {
    const root = bar.current
    const chip = root?.querySelector<HTMLButtonElement>(`[data-category="${activeId}"]`)
    if (!root || !chip) return
    const left = chip.offsetLeft - (root.clientWidth - chip.clientWidth) / 2
    root.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' })
  }, [activeId, reduced, categoryKey])

  return (
    <div
      ref={bar}
      className="no-scrollbar relative mt-5 flex w-full min-w-0 gap-2 overflow-x-auto px-[max(0px,calc(50%-6.5rem))]"
      role="group"
      aria-label="Menu categories"
    >
      {categories.map((category) => {
        const active = category.id === activeId
        return (
          <button
            key={category.id}
            data-category={category.id}
            type="button"
            aria-pressed={active}
            onClick={(event) => {
              onSelect(category.id)
              const root = bar.current
              const chip = event.currentTarget
              if (!root) return
              const left = chip.offsetLeft - (root.clientWidth - chip.clientWidth) / 2
              root.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' })
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
              active ? 'bg-telugu text-warm' : 'bg-warm text-brown/75'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
