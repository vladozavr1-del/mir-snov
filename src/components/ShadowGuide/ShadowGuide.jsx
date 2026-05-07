import { useEffect, useRef, useState } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useLerp } from '../../hooks/useLerp'
import styles from './ShadowGuide.module.css'

export function ShadowGuide() {
  const { position, isVisible } = useMousePosition()
  const lerpPos = useLerp(position, 0.07)
  const slowPos = useLerp(position, 0.04)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => setIsScrolling(false), 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(scrollTimer.current)
    }
  }, [])

  useEffect(() => {
    const interactiveSelectors = 'a, button, [data-interactive], input, textarea, .interactive'
    let elements = []

    const addListeners = () => {
      elements = Array.from(document.querySelectorAll(interactiveSelectors))
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHoveringInteractive(true))
        el.addEventListener('mouseleave', () => setIsHoveringInteractive(false))
      })
    }

    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      elements.forEach(el => {
        el.removeEventListener('mouseenter', () => setIsHoveringInteractive(true))
        el.removeEventListener('mouseleave', () => setIsHoveringInteractive(false))
      })
    }
  }, [])

  const containerClass = [
    styles.shadowContainer,
    isVisible ? styles.visible : '',
    isHoveringInteractive ? styles.interactive : '',
    isScrolling ? styles.scrolling : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      {/* Slow trailing shadow — the "body" */}
      <div
        className={`${styles.shadow} ${styles.shadowTrail}`}
        style={{
          left: slowPos.x,
          top: slowPos.y,
          opacity: isVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Main silhouette */}
      <div
        className={containerClass}
        style={{
          left: lerpPos.x,
          top: lerpPos.y,
        }}
        aria-hidden="true"
      >
        <div className={styles.glow} />
        <svg
          className={styles.silhouette}
          viewBox="0 0 60 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <ellipse cx="30" cy="14" rx="10" ry="12" fill="currentColor" />
          {/* Cloak/body */}
          <path
            d="M10 35 C10 28 20 24 30 24 C40 24 50 28 50 35 L58 90 C55 92 45 95 30 95 C15 95 5 92 2 90 Z"
            fill="currentColor"
          />
          {/* Hood suggestion */}
          <path
            d="M18 22 C15 18 12 16 10 20 L12 28 C16 26 20 25 22 24 Z"
            fill="currentColor"
            opacity="0.7"
          />
          <path
            d="M42 22 C45 18 48 16 50 20 L48 28 C44 26 40 25 38 24 Z"
            fill="currentColor"
            opacity="0.7"
          />
          {/* Feet/cloak hem */}
          <path
            d="M2 90 C5 100 10 110 18 118 L22 115 C16 106 12 97 12 90 Z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M58 90 C55 100 50 110 42 118 L38 115 C44 106 48 97 48 90 Z"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>

        {/* Pointing indicator for interactive elements */}
        {isHoveringInteractive && (
          <div className={styles.pointer}>
            <svg viewBox="0 0 20 30" fill="none">
              <path d="M10 0 L18 20 L10 15 L2 20 Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>
    </>
  )
}
