import { Search } from 'lucide-react'

type MenuSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function MenuSearch({ value, onChange }: MenuSearchProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Search dishes</span>
      <Search
        size={16}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-brown/40"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search dishes, e.g. biryani, paneer, prawns"
        className="h-12 w-full rounded-full border border-brown/15 bg-warm pr-4 pl-11 text-sm text-brown outline-none ring-gold/40 placeholder:text-brown/40 focus:ring-2"
      />
    </label>
  )
}
