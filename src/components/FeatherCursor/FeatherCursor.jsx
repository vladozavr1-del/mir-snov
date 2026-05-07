import { useEffect, useRef, useState } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useLerp } from '../../hooks/useLerp'
import styles from './FeatherCursor.module.css'

// SVG feather: 36×100 viewBox, tip at (18, 97) — 97% of height
// Rendered size: 24×66px → tip Y offset from top = 66 * 0.97 ≈ 64px
const FEATHER_W    = 24
const FEATHER_H    = 66
const TIP_OFFSET_Y = FEATHER_H * 0.97  // px from element top to tip point

export function FeatherCursor() {
  const { position, isVisible } = useMousePosition()
  // Fast lerp for the feather tip — minimal lag for accurate clicking
  const lerpPos = useLerp(position, 0.15)
  // Very slow lerp for the trail glow behind
  const trailPos = useLerp(position, 0.04)

  const prevRef = useRef({ x: 0, y: 0 })
  const angleRef = useRef(0)
  const [angle, setAngle] = useState(0)
  const [isHover, setIsHover] = useState(false)
  const [speed, setSpeed] = useState(0)

  // Full directional rotation — tip always leads in the direction of movement
  useEffect(() => {
    const dx = lerpPos.x - prevRef.current.x
    const dy = lerpPos.y - prevRef.current.y
    const spd = Math.sqrt(dx * dx + dy * dy)
    setSpeed(spd)

    if (spd > 1.5) {
      // atan2(dx, dy): 0° = moving down, +90° = moving right, −90° = moving left
      const target = Math.atan2(dx, dy) * (180 / Math.PI)
      // Shortest-arc lerp to avoid spinning the long way around
      let delta = target - angleRef.current
      if (delta >  180) delta -= 360
      if (delta < -180) delta += 360
      angleRef.current += delta * 0.035
      setAngle(angleRef.current)
    } else if (spd < 0.3) {
      // Nearly stopped — drift gently back to upright
      angleRef.current *= 0.988
      setAngle(angleRef.current)
    }
    prevRef.current = { x: lerpPos.x, y: lerpPos.y }
  }, [lerpPos])

  // Detect interactive elements
  useEffect(() => {
    const onEnter = () => setIsHover(true)
    const onLeave = () => setIsHover(false)
    const sel = 'a, button, [data-interactive], input, textarea, label'
    const bind = () => {
      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    bind()
    const obs = new MutationObserver(bind)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [])

  const glow = isHover ? 1.8 : Math.min(1 + speed * 0.04, 1.5)

  return (
    <>
      {/* Trailing orb — positioned at trail center */}
      <div
        className={styles.trail}
        style={{
          left: trailPos.x,
          top: trailPos.y,
          opacity: isVisible ? Math.min(speed * 0.05, 0.45) : 0,
        }}
        aria-hidden="true"
      />

      {/* Feather — positioned so TIP is exactly at cursor */}
      <div
        className={`${styles.wrapper} ${isVisible ? styles.visible : ''} ${isHover ? styles.hover : ''}`}
        style={{
          // Place element so its tip (TIP_OFFSET_Y from top) lands on cursor
          left: lerpPos.x - FEATHER_W / 2,
          top: lerpPos.y - TIP_OFFSET_Y,
          // Rotate around the tip point
          transformOrigin: `${FEATHER_W / 2}px ${TIP_OFFSET_Y}px`,
          transform: `rotate(${angle}deg)`,
        }}
        aria-hidden="true"
      >
        <div className={styles.glow} style={{ opacity: glow * 0.55 }} />

        <svg
          className={styles.feather}
          viewBox="0 0 36 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={FEATHER_W}
          height={FEATHER_H}
        >
          {/* Left barbs */}
          <path d="M18 6  C10 13 4 23 3 35  L18 26 Z" fill="url(#fL)" opacity="0.92"/>
          <path d="M18 20 C9  27 3 37 2 49  L18 40 Z" fill="url(#fL)" opacity="0.82"/>
          <path d="M18 34 C8  40 2 51 1 63  L18 54 Z" fill="url(#fL)" opacity="0.70"/>
          <path d="M18 48 C9  54 3 63 2 73  L18 68 Z" fill="url(#fL)" opacity="0.55"/>

          {/* Right barbs */}
          <path d="M18 6  C26 13 32 23 33 35 L18 26 Z" fill="url(#fR)" opacity="0.88"/>
          <path d="M18 20 C27 27 33 37 34 49 L18 40 Z" fill="url(#fR)" opacity="0.78"/>
          <path d="M18 34 C28 40 34 51 35 63 L18 54 Z" fill="url(#fR)" opacity="0.66"/>
          <path d="M18 48 C27 54 33 63 34 73 L18 68 Z" fill="url(#fR)" opacity="0.50"/>

          {/* Central quill */}
          <path
            d="M18 3 C18 3 17.2 38 16.5 68 C16 80 15.5 87 16 93 C16.4 96 17.2 98.5 18 98.5 C18.8 98.5 19.6 96 20 93 C20.5 87 20 80 19.5 68 C18.8 38 18 3 18 3Z"
            fill="url(#qS)"
          />

          {/* Tip glow dot */}
          <ellipse cx="18" cy="97" rx="2.5" ry="2" fill="url(#tG)" opacity="0.95"/>

          <defs>
            <linearGradient id="fL" x1="18" y1="0" x2="0" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#f0e9ff" stopOpacity="0.95"/>
              <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.75"/>
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25"/>
            </linearGradient>
            <linearGradient id="fR" x1="18" y1="0" x2="36" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#f5f0ff" stopOpacity="0.90"/>
              <stop offset="45%" stopColor="#c4b5fd" stopOpacity="0.65"/>
              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.20"/>
            </linearGradient>
            <linearGradient id="qS" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#ffffff"/>
              <stop offset="55%"  stopColor="#c4b5fd"/>
              <stop offset="100%" stopColor="#a78bfa"/>
            </linearGradient>
            <radialGradient id="tG" cx="50%" cy="60%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
              <stop offset="60%"  stopColor="#c4b5fd" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>

        {/* Ink dot at exact tip */}
        <div className={styles.inkDot} style={{ opacity: glow }} />
      </div>
    </>
  )
}
