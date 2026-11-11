import { MessageCircle, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { restaurant, WHATSAPP_NUMBER } from '../data/restaurant'

export function FloatingCallButton() {
  const [coveredSectionVisible, setCoveredSectionVisible] = useState(false)
  const whatsappNumber = WHATSAPP_NUMBER.replace(/\D/g, '')
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : ''

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

  return (
    <>
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-4 bottom-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
          aria-label={`Chat with ${restaurant.name} on WhatsApp`}
        >
          <MessageCircle size={18} aria-hidden="true" />
          WhatsApp
        </a>
      ) : null}
      {!coveredSectionVisible ? (
        <a
          href={restaurant.phones[0].href}
          className={`fixed right-4 z-40 inline-flex items-center gap-2 rounded-full bg-telugu px-4 py-3 text-sm font-semibold text-warm shadow-lg md:hidden ${
            whatsappHref ? 'bottom-20' : 'bottom-5'
          }`}
          aria-label={`Call ${restaurant.name} on ${restaurant.phones[0].number}`}
        >
          <Phone size={18} aria-hidden="true" />
          Call
        </a>
      ) : null}
    </>
  )
}
