import { useEffect, useState } from 'react'
import type { Diet, Price } from '../data/menu'
import { formatPrice } from '../data/menu'
import { IMG } from '../data/signature'

type MenuItemCardProps = {
  name: string
  price: Price
  diet: Diet
  signature?: boolean
  categoryLabel?: string
  imageKey?: string
}

export function MenuItemCard({
  name,
  price,
  diet,
  signature = false,
  categoryLabel,
  imageKey,
}: MenuItemCardProps) {
  const veg = diet === 'veg'
  const sources = [imageKey ? `/images/menu/${imageKey}.webp` : '', IMG[name] ?? ''].filter(Boolean)
  const [sourceIndex, setSourceIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const photo = sources[sourceIndex]

  useEffect(() => {
    setSourceIndex(0)
    setReady(false)
  }, [name, imageKey])

  const showPhoto = Boolean(photo) && ready

  return (
    <article className="w-[72vw] shrink-0 snap-start md:w-[clamp(230px,24vw,290px)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#2d1b16]">
        {showPhoto ? null : (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: veg
                ? 'radial-gradient(circle at 40% 35%, #e7c27a, #8a4a12 72%)'
                : 'radial-gradient(circle at 40% 35%, #d96a32, #5a1409 74%)',
            }}
          />
        )}
        {photo ? (
          <img
            key={photo}
            src={photo}
            alt={`${name} served in a brass vessel`}
            width={640}
            height={480}
            decoding="async"
            loading="lazy"
            onLoad={() => setReady(true)}
            onError={() => {
              setReady(false)
              setSourceIndex((current) => current + 1)
            }}
            className={`absolute inset-0 h-full w-full object-cover ${ready ? '' : 'opacity-0'}`}
          />
        ) : null}
        {signature ? (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-2.5 py-1 text-[0.68rem] font-semibold text-espresso">
            Signature
          </span>
        ) : null}
      </div>
      {categoryLabel ? (
        <p className="mt-3 text-xs tracking-wide text-brown/55">{categoryLabel}</p>
      ) : null}
      <h3 className={`font-display text-[17px] leading-snug text-brown ${categoryLabel ? 'mt-1' : 'mt-3'}`}>
        {name}
      </h3>
      <p className="mt-2 flex items-center gap-2">
        <span
          className={`inline-block h-2.5 w-2.5 shrink-0 ${veg ? 'bg-[#1e8a4c]' : 'bg-[#c0261b]'}`}
          aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
        />
        <span className="font-display text-lg font-bold text-[#85170D]">{formatPrice(price)}</span>
      </p>
    </article>
  )
}
