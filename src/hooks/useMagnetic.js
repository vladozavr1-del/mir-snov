import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useMagnetic(strength = 0.32) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      const dx   = e.clientX - cx
      const dy   = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const zone = Math.max(rect.width, rect.height) * 1.6

      if (dist < zone) {
        const pull = (1 - dist / zone) * strength
        gsap.to(el, { x: dx * pull, y: dy * pull, duration: 0.35, ease: 'power2.out' })
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.42)' })
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [strength])

  return ref
}
