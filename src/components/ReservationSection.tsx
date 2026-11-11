import { useEffect, useRef, useState, type FormEvent } from 'react'
import { restaurant, SHOW_RESERVATION, WHATSAPP_NUMBER } from '../data/restaurant'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const occasions = ['Family meal', 'Birthday', 'Friends', 'Business', 'Other'] as const
type Occasion = (typeof occasions)[number]
type FieldName = 'name' | 'phone' | 'date' | 'time'

function localDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatRequestDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function formatRequestTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date)
}

export function ReservationSection() {
  const reducedMotion = usePrefersReducedMotion()
  const resultCard = useRef<HTMLDivElement>(null)
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const requestText = useRef<HTMLPreElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)
  const phoneInput = useRef<HTMLInputElement>(null)
  const dateInput = useRef<HTMLInputElement>(null)
  const timeInput = useRef<HTMLInputElement>(null)
  const copiedTimeout = useRef<number | undefined>(undefined)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [occasion, setOccasion] = useState<Occasion | ''>('')
  const [notes, setNotes] = useState('')
  const [validation, setValidation] = useState<{ field: FieldName; message: string } | null>(null)
  const [request, setRequest] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy request')
  const [copyHelp, setCopyHelp] = useState('')

  const today = localDateValue()
  const whatsappNumber = WHATSAPP_NUMBER.replace(/\D/g, '')
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(request)}`
    : undefined

  useEffect(() => () => window.clearTimeout(copiedTimeout.current), [])

  useEffect(() => {
    if (!request) return
    resultCard.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' })
    resultHeading.current?.focus({ preventScroll: true })
  }, [request, reducedMotion])

  if (!SHOW_RESERVATION) return null

  const clearValidation = () => setValidation(null)

  const prepareRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const invalid = (field: FieldName, message: string, input: HTMLInputElement | null) => {
      setValidation({ field, message })
      input?.focus()
    }

    if (!name.trim()) return invalid('name', 'Please enter your name.', nameInput.current)
    if (!/^\d{10}$/.test(phone)) {
      return invalid('phone', 'Please enter a 10-digit phone number.', phoneInput.current)
    }
    if (!date) return invalid('date', 'Please choose a date.', dateInput.current)
    if (date < today) {
      return invalid('date', 'Please choose today or a future date.', dateInput.current)
    }
    if (!time) return invalid('time', 'Please choose a preferred time.', timeInput.current)

    const lines = [
      'Hello Teenmaar Telugu Kitchen, I would like to request a table.',
      `Name: ${name.trim()}`,
      `Phone: ${phone}`,
      `Date: ${formatRequestDate(date)}`,
      `Time: ${formatRequestTime(time)}`,
      `Guests: ${guests}`,
    ]
    if (occasion) lines.push(`Occasion: ${occasion}`)
    if (notes.trim()) lines.push(`Notes: ${notes.trim()}`)
    lines.push('Please confirm availability.')

    setValidation(null)
    setCopyLabel('Copy request')
    setCopyHelp('')
    setRequest(lines.join('\n'))
  }

  const copyRequest = async () => {
    try {
      await navigator.clipboard.writeText(request)
      setCopyLabel('Copied')
      setCopyHelp('')
      window.clearTimeout(copiedTimeout.current)
      copiedTimeout.current = window.setTimeout(() => setCopyLabel('Copy request'), 2000)
    } catch {
      const selection = window.getSelection()
      const range = document.createRange()
      if (requestText.current && selection) {
        range.selectNodeContents(requestText.current)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setCopyHelp('Now press Ctrl+C')
    }
  }

  const editRequest = () => {
    setRequest('')
    setCopyLabel('Copy request')
    setCopyHelp('')
  }

  return (
    <section
      id="reserve"
      className="reservation-section scroll-mt-24"
      aria-labelledby="reservation-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 min-[900px]:grid-cols-[1fr_1.1fr] min-[900px]:gap-14">
        <div>
          <h2
            id="reservation-heading"
            className="font-display text-[clamp(36px,5vw,64px)] leading-[1.05] text-[#2D1B16]"
          >
            Reserve <em className="text-[#85170D]">a table.</em>
          </h2>
          <p className="mt-5 max-w-[42ch] text-base leading-7 text-[#5B463B]">
            Tell us when you are coming and how many of you there will be. The restaurant will
            confirm your table by phone.
          </p>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-[#4C382F]">
            {[
              'Your request is not a confirmed booking until the restaurant confirms it.',
              'Subject to availability.',
              'For large groups or events, please call us directly.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[9px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#D9A441]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {request ? (
          <div
            ref={resultCard}
            className="w-full min-w-0 rounded-[22px] border border-[#D9A441] bg-[#FBF4E8] p-5 text-[#85170D] shadow-[0_30px_60px_-34px_rgba(60,20,10,.45)] min-[520px]:p-[clamp(20px,3vw,34px)]"
            aria-labelledby="reservation-result-heading"
          >
            <h3
              id="reservation-result-heading"
              ref={resultHeading}
              tabIndex={-1}
              className="font-display text-3xl leading-tight italic focus:outline-none"
            >
              Almost done. Call to confirm.
            </h3>
            <p className="mt-3 text-sm leading-6">
              This is not a confirmed booking yet. Call the restaurant with the details below, or copy
              them.
            </p>
            <pre
              ref={requestText}
              tabIndex={-1}
              aria-label="Reservation request details"
              className="mt-5 overflow-x-auto rounded-xl border border-dashed border-[#DCCBB2] bg-white/70 p-4 font-sans text-sm leading-6 whitespace-pre-wrap break-words focus:outline-none"
            >
              {request}
            </pre>
            <div className="mt-5 grid grid-cols-2 gap-2 min-[900px]:flex min-[900px]:flex-wrap">
              <a
                href={`tel:${restaurant.phones[0].number}`}
                className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#85170D] px-5 text-center text-sm font-semibold text-white min-[900px]:col-span-1"
              >
                Call {restaurant.phones[0].number}
              </a>
              <a
                href={`tel:${restaurant.phones[1].number}`}
                className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full border border-[#85170D] px-5 text-center text-sm font-semibold text-[#85170D] min-[900px]:col-span-1"
              >
                Call {restaurant.phones[1].number}
              </a>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener"
                  className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full border border-[#85170D] px-5 text-center text-sm font-semibold text-[#85170D] min-[900px]:col-span-1"
                >
                  Send on WhatsApp
                </a>
              ) : null}
              <button
                type="button"
                onClick={copyRequest}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#85170D] px-4 text-sm font-semibold text-[#85170D]"
              >
                {copyLabel}
              </button>
              <button
                type="button"
                onClick={editRequest}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#85170D] px-4 text-sm font-semibold text-[#85170D]"
              >
                Edit request
              </button>
            </div>
            {copyHelp ? <p className="mt-3 text-sm" role="status">{copyHelp}</p> : null}
          </div>
        ) : (
          <form
            noValidate
            onSubmit={prepareRequest}
            className="reservation-card w-full min-w-0 rounded-[22px] border border-[#D9A441] bg-[#FBF4E8] text-[#85170D] shadow-[0_30px_60px_-34px_rgba(60,20,10,.45)]"
            style={{ padding: 'clamp(20px, 3vw, 34px)' }}
          >
            <div className="reservation-fields">
              <div className="reservation-field">
                <label htmlFor="reservation-name">Your name</label>
                <input
                  ref={nameInput}
                  id="reservation-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    clearValidation()
                  }}
                  aria-invalid={validation?.field === 'name'}
                  required
                />
              </div>
              <div className="reservation-field">
                <label htmlFor="reservation-phone">Phone number</label>
                <input
                  ref={phoneInput}
                  id="reservation-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '')
                    const nationalNumber = digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits
                    setPhone(nationalNumber.slice(-10))
                    clearValidation()
                  }}
                  aria-invalid={validation?.field === 'phone'}
                  required
                />
              </div>
              <div className="reservation-field">
                <label htmlFor="reservation-date">Date</label>
                <input
                  ref={dateInput}
                  id="reservation-date"
                  name="date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value)
                    clearValidation()
                  }}
                  aria-invalid={validation?.field === 'date'}
                  required
                />
              </div>
              <div className="reservation-field">
                <label htmlFor="reservation-time">Preferred time</label>
                <input
                  ref={timeInput}
                  id="reservation-time"
                  name="time"
                  type="time"
                  value={time}
                  onChange={(event) => {
                    setTime(event.target.value)
                    clearValidation()
                  }}
                  aria-invalid={validation?.field === 'time'}
                  required
                />
              </div>
              <div className="reservation-field reservation-field-full">
                <label id="reservation-guests-label">Guests</label>
                <div role="group" aria-labelledby="reservation-guests-label" className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Decrease guests"
                    disabled={guests <= 1}
                    onClick={() => setGuests((value) => Math.max(1, value - 1))}
                    className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#DCCBB2] text-2xl leading-none disabled:opacity-40"
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <span className="min-w-8 text-center font-display text-2xl font-bold" aria-live="polite">
                    {guests}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase guests"
                    disabled={guests >= 20}
                    onClick={() => setGuests((value) => Math.min(20, value + 1))}
                    className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#DCCBB2] text-2xl leading-none disabled:opacity-40"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
                {guests === 20 ? (
                  <p className="mt-2 text-sm">For more than 20 guests please call us.</p>
                ) : null}
              </div>
              <fieldset className="reservation-field reservation-field-full min-w-0">
                <legend>Occasion (optional)</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {occasions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={occasion === item}
                      onClick={() => setOccasion((value) => (value === item ? '' : item))}
                      className={`min-h-10 rounded-full border border-[#DCCBB2] px-4 text-sm font-medium ${
                        occasion === item ? 'bg-[#85170D] text-white' : 'bg-white/70 text-[#85170D]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="reservation-field reservation-field-full">
                <label htmlFor="reservation-notes">Notes (optional)</label>
                <textarea
                  id="reservation-notes"
                  name="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Seating preference, special requests"
                />
              </div>
            </div>
            {validation ? (
              <p className="mt-4 text-sm font-semibold" role="alert">
                {validation.message}
              </p>
            ) : null}
            <p className="mt-4 text-xs leading-5 text-[#5B463B]">
              Your request is not a confirmed booking until the restaurant confirms it. Subject to
              availability.
            </p>
            <button
              type="submit"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#85170D] px-5 text-sm font-semibold text-white min-[400px]:w-auto"
            >
              Prepare my request
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
