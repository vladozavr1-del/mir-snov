import { useRef, useCallback } from 'react'

const MAX_TILT = 12 // degrees

export function useCardTilt() {
  const ref = useRef(null)
  const rafRef = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -MAX_TILT
      const ry = ((e.clientX - cx) / (rect.width / 2)) * MAX_TILT
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`
      el.style.transition = 'transform 0.08s linear'
      // Inner glow follows cursor
      const glowEl = el.querySelector('[data-tilt-glow]')
      if (glowEl) {
        const px = ((e.clientX - rect.left) / rect.width) * 100
        const py = ((e.clientY - rect.top) / rect.height) * 100
        glowEl.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(124,58,237,0.18) 0%, transparent 60%)`
      }
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(rafRef.current)
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    const glowEl = el.querySelector('[data-tilt-glow]')
    if (glowEl) glowEl.style.background = ''
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
