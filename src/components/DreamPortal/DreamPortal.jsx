import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './DreamPortal.module.css'

gsap.registerPlugin(ScrollTrigger)

const R1 = 'Вода · Лес · Полёт · Луна · Зеркало · Огонь · Змея · Лабиринт · '
const R2 = 'Сновидец · Тень · Путь · Символ · Мир · '
const R3 = 'Сон · Явь · '

export function DreamPortal() {
  const sectionRef = useRef(null)
  const g1Ref     = useRef(null)
  const g2Ref     = useRef(null)
  const g3Ref     = useRef(null)
  const irisRef   = useRef(null)
  const pupilRef  = useRef(null)
  const glowRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const O = '300 300'

      // Differential ring rotation tied to scroll position (scrub)
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
        .to(g1Ref.current, { rotation:  108, svgOrigin: O, ease: 'none' }, 0)
        .to(g2Ref.current, { rotation: -78,  svgOrigin: O, ease: 'none' }, 0)
        .to(g3Ref.current, { rotation:  54,  svgOrigin: O, ease: 'none' }, 0)

      // Eye opens as portal scrolls into view
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 58%',
          end: 'center 42%',
          scrub: 2,
        },
      })
        .fromTo(irisRef.current,  { attr: { ry: 0.6 } }, { attr: { ry: 20 }, ease: 'power2.out' }, 0)
        .fromTo(pupilRef.current, { attr: { ry: 0.3 } }, { attr: { ry: 9  }, ease: 'power2.out' }, 0)

      // Ambient eye glow breathes
      gsap.to(glowRef.current, {
        attr: { ry: 40 },
        opacity: 0.18,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const C  = 300
  const mk = (r) =>
    `M ${C},${C} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`

  return (
    <section className={styles.portal} ref={sectionRef}>
      <div className={styles.inner}>
        <svg
          className={styles.svg}
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path id="dp1" d={mk(234)} />
            <path id="dp2" d={mk(172)} />
            <path id="dp3" d={mk(112)} />
            <radialGradient id="dpIrisG" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#04020d" />
              <stop offset="28%"  stopColor="#3b0764" />
              <stop offset="100%" stopColor="#7c3aed" />
            </radialGradient>
          </defs>

          {/* Outer ring — slowest */}
          <g ref={g1Ref}>
            <text className={styles.t1}>
              <textPath href="#dp1">{R1.repeat(2)}</textPath>
            </text>
          </g>

          {/* Middle ring — counter-rotates */}
          <g ref={g2Ref}>
            <text className={styles.t2}>
              <textPath href="#dp2">{R2.repeat(4)}</textPath>
            </text>
          </g>

          {/* Inner ring — fastest */}
          <g ref={g3Ref}>
            <text className={styles.t3}>
              <textPath href="#dp3">{R3.repeat(9)}</textPath>
            </text>
          </g>

          {/* Central eye */}
          <g transform={`translate(${C}, ${C})`}>
            {/* Ambient glow halo */}
            <ellipse ref={glowRef} rx="62" ry="32" fill="rgba(124,58,237,0.07)" opacity="0.07" />

            {/* Eyelid fill */}
            <path
              d="M -55,0 Q 0,-27 55,0 Q 0,27 -55,0 Z"
              fill="rgba(4,2,13,0.93)"
            />

            {/* Iris — ry animated from near-0 to open */}
            <ellipse ref={irisRef} rx="21" ry="0.6" fill="url(#dpIrisG)" />

            {/* Pupil */}
            <ellipse ref={pupilRef} rx="9.5" ry="0.3" fill="#04020d" />

            {/* Upper eyelid line */}
            <path
              d="M -55,0 Q 0,-27 55,0"
              fill="none"
              stroke="rgba(167,139,250,0.55)"
              strokeWidth="0.9"
            />
            {/* Lower eyelid line */}
            <path
              d="M -55,0 Q 0,27 55,0"
              fill="none"
              stroke="rgba(167,139,250,0.38)"
              strokeWidth="0.9"
            />

            {/* Specular glint */}
            <circle cx="-8" cy="-7" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="6"  cy="4"  r="1.5" fill="rgba(255,255,255,0.3)" />
          </g>
        </svg>
      </div>
    </section>
  )
}
