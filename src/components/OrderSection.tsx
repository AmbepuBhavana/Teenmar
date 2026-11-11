import { ExternalLink, Phone, Star } from 'lucide-react'
import { ZOMATO_DELIVERY_RATING, ZOMATO_URL, restaurant } from '../data/restaurant'

const score = ZOMATO_DELIVERY_RATING.score
const count = ZOMATO_DELIVERY_RATING.count.toLocaleString('en-US')

export function OrderSection() {
  return (
    <section id="order" className="scroll-mt-24 order-section">
      <div className="order-in">

        {/* ── 1. Heading ── */}
        <h2 className="order-heading">
          Order <em>online.</em>
        </h2>

        {/* ── 2. Intro ── */}
        <p className="order-sub">
          Get Teenmaar delivered through Zomato, or call the restaurant directly for takeaway and
          enquiries.
        </p>

        {/* ── 3. Zomato banner ── */}
        <div className="zom-banner" aria-label="Order on Zomato">
          {/* Left content */}
          <div>
            <h3 className="zom-heading">
              Delivery at<br />your door.
            </h3>

            {/* Rating pill */}
            <div className="zom-pill" role="img" aria-label={`Zomato delivery rating ${score} out of 5 from ${count} ratings`}>
              <Star
                size={16}
                fill="#f3c24f"
                stroke="none"
                aria-hidden="true"
              />
              <span>
                <b>{score}/5</b> from {count} delivery ratings
              </span>
            </div>
          </div>

          {/* Zomato CTA button */}
          <a
            href={ZOMATO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="zom-btn"
            aria-label="Order on Zomato (opens in a new tab)"
          >
            <span>Order</span>
            <span>on Zomato</span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>

        {/* ── 4. Banner note ── */}
        <p className="zom-note">
          Opens Zomato in a new tab. Zomato's own prices and availability apply at checkout.
        </p>

        {/* ── 5. Call row ── */}
        <div className="call-row">
          {/* Left: label */}
          <div>
            <h3 className="call-heading">Call the<br />restaurant</h3>
            <p className="call-sub">Prefer to talk to us?<br />Call either number directly.</p>
          </div>

          {/* Right: numbers */}
          <div className="nums-grid">
            {restaurant.phones.map((phone) => (
              <a key={phone.number} href={phone.href} className="phone-link">
                <small>
                  <Phone size={13} aria-hidden="true" />
                  Tap to call
                </small>
                {phone.number}
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
