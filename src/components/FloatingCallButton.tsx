import { Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { restaurant } from '../data/restaurant'

export function FloatingCallButton() {
  const [coveredSectionVisible, setCoveredSectionVisible] = useState(false)

  useEffect(() => {
    const coveredSections = ['home', 'specialities']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    if (!coveredSections.length || !('IntersectionObserver' in window)) return

    const visibleSections = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target)
          else visibleSections.delete(entry.target)
        })
        setCoveredSectionVisible(visibleSections.size > 0)
      },
      { threshold: 0.1 },
    )
    coveredSections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  if (coveredSectionVisible) return null

  return (
    <a
      href={restaurant.phones[0].href}
      className="fixed right-4 bottom-5 z-40 inline-flex items-center gap-2 rounded-full bg-telugu px-4 py-3 text-sm font-semibold text-warm shadow-lg md:hidden"
      aria-label={`Call ${restaurant.name} on ${restaurant.phones[0].number}`}
    >
      <Phone size={18} />
      Call
    </a>
  )
}
