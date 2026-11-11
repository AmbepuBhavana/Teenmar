type BrandMarkProps = {
  className?: string
  imageClassName?: string
  wordmarkClassName?: string
  subtitleClassName?: string
  href?: string
  showImage?: boolean
  light?: boolean
}

export function BrandMark({
  className = '',
  imageClassName = 'h-10 w-10 shrink-0',
  wordmarkClassName = 'text-[1.15rem] font-semibold tracking-[0.18em]',
  subtitleClassName = 'text-[0.62rem] font-medium tracking-[0.32em]',
  href = '#home',
  showImage = false,
  light = false,
}: BrandMarkProps) {
  const ink = light ? '#FFF9F0' : '#FFF9F0'
  const gold = '#D9A441'

  return (
    <a href={href} className={`group flex items-center gap-3 ${className}`} aria-label="Teenmaar Telugu Kitchen home">
      {showImage ? (
        <img
          src="/images/teenmar%20logo.jpg"
          alt=""
          aria-hidden="true"
          className={`shrink-0 rounded-full object-cover ${imageClassName}`}
          width={44}
          height={44}
        />
      ) : (
        <svg viewBox="0 0 48 48" className={imageClassName} aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#21130F" stroke={gold} strokeWidth="1.25" />
          <path
            d="M24 10c2.6 5.4 1.2 9.2-1 12.2 4.6-1.2 7.5 2 8.2 5.6-5.2-1-9.6 1.6-12.6 6-1.4-7 1.2-14.2 5.4-23.8Z"
            fill="#85170D"
          />
          <path
            d="M24 13.5c1.5 3.6 1 6.2-.2 8.4 2.9-.7 4.8 1.4 5.3 3.8-3.3-.5-6.1 1.2-8.2 4.1-.7-4.8.8-9.8 3.1-16.3Z"
            fill="#F28A19"
          />
        </svg>
      )}
      <span className="leading-tight">
        <span
          className={`block font-display ${wordmarkClassName}`}
          style={{ color: ink }}
        >
          TEENMAAR
        </span>
        <span
          className={`block font-sans uppercase ${subtitleClassName}`}
          style={{ color: gold }}
        >
          Telugu Kitchen
        </span>
      </span>
    </a>
  )
}
