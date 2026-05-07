import { useRef, useEffect, useState } from 'react'

const lerp = (start, end, factor) => start + (end - start) * factor

export function useLerp(target, factor = 0.08) {
  const [current, setCurrent] = useState({ x: target.x, y: target.y })
  const rafRef = useRef(null)
  const currentRef = useRef({ x: target.x, y: target.y })
  const targetRef = useRef(target)

  useEffect(() => {
    targetRef.current = target
  }, [target])

  useEffect(() => {
    const animate = () => {
      const next = {
        x: lerp(currentRef.current.x, targetRef.current.x, factor),
        y: lerp(currentRef.current.y, targetRef.current.y, factor),
      }
      const dx = Math.abs(next.x - currentRef.current.x)
      const dy = Math.abs(next.y - currentRef.current.y)
      if (dx > 0.1 || dy > 0.1) {
        currentRef.current = next
        setCurrent({ ...next })
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [factor])

  return current
}
