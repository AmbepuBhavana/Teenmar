import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function registerGsap() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function revealOnScroll(root: HTMLElement, reducedMotion: boolean) {
  const nodes = [...root.querySelectorAll<HTMLElement>('[data-reveal]')]
  if (reducedMotion || nodes.length === 0) {
    nodes.forEach((node) => {
      node.style.opacity = '1'
      node.style.transform = 'none'
    })
    return
  }

  registerGsap()
  const ctx = gsap.context(() => {
    nodes.forEach((node) => {
      gsap.fromTo(
        node,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 92%',
            once: true,
          },
          onComplete: () => {
            node.style.opacity = '1'
            node.style.transform = 'none'
          },
        },
      )
    })
  }, root)

  const showIfStuck = () => {
    nodes.forEach((node) => {
      const opacity = Number.parseFloat(window.getComputedStyle(node).opacity)
      if (opacity > 0.2) return
      const rect = node.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.98 && rect.bottom > 0
      if (!inView) return
      gsap.to(node, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        overwrite: 'auto',
        onComplete: () => {
          node.style.opacity = '1'
          node.style.transform = 'none'
        },
      })
    })
  }

  const early = window.setTimeout(showIfStuck, 500)
  const late = window.setTimeout(showIfStuck, 1600)
  window.addEventListener('scroll', showIfStuck, { passive: true })

  return () => {
    window.clearTimeout(early)
    window.clearTimeout(late)
    window.removeEventListener('scroll', showIfStuck)
    ctx.revert()
  }
}
