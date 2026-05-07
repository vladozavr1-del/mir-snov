import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './DreamScene.module.css'

// Dream shapes: clip-paths that feel like fragments of something larger
const SHARDS = [
  {
    id: 'a',
    clip:      'polygon(50% 0%, 95% 30%, 80% 100%, 20% 100%, 5% 30%)',
    clipMorph: 'polygon(35% 5%, 90% 20%, 95% 75%, 40% 100%, 8% 55%)',
    size: 140, x: '55%', y: '18%',
    rotX: 15, rotY: -20,
    color: 'rgba(124,58,237,0.18)',
    border: 'rgba(167,139,250,0.35)',
    dur: 18, delay: 0,
  },
  {
    id: 'b',
    clip:      'polygon(50% 0%, 100% 60%, 75% 100%, 25% 100%, 0% 60%)',
    clipMorph: 'polygon(65% 5%, 100% 45%, 80% 95%, 20% 90%, 5% 40%)',
    size: 90, x: '75%', y: '55%',
    rotX: -25, rotY: 30,
    color: 'rgba(99,102,241,0.14)',
    border: 'rgba(196,181,253,0.25)',
    dur: 22, delay: 3,
  },
  {
    id: 'c',
    clip:      'polygon(50% 0%, 100% 100%, 0% 100%)',
    clipMorph: 'polygon(40% 5%, 95% 90%, 5% 80%)',
    size: 110, x: '38%', y: '60%',
    rotX: 10, rotY: 15,
    color: 'rgba(109,40,217,0.12)',
    border: 'rgba(139,92,246,0.30)',
    dur: 26, delay: 6,
  },
  {
    id: 'd',
    clip:      'polygon(0% 20%, 60% 0%, 100% 50%, 60% 100%, 0% 80%)',
    clipMorph: 'polygon(15% 5%, 75% 15%, 95% 60%, 50% 100%, 5% 65%)',
    size: 75, x: '82%', y: '25%',
    rotX: -15, rotY: -25,
    color: 'transparent',
    border: 'rgba(167,139,250,0.20)',
    dur: 20, delay: 9,
  },
  {
    id: 'e',
    clip:      'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    clipMorph: 'polygon(35% 5%, 80% 10%, 100% 60%, 65% 95%, 15% 90%, 0% 45%)',
    size: 60, x: '48%', y: '78%',
    rotX: 20, rotY: 10,
    color: 'rgba(91,33,182,0.10)',
    border: 'rgba(124,58,237,0.22)',
    dur: 16, delay: 12,
  },
  {
    id: 'f',
    clip:      'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    clipMorph: 'polygon(60% 5%, 95% 45%, 75% 95%, 25% 100%, 5% 45%)',
    size: 45, x: '65%', y: '40%',
    rotX: -30, rotY: 20,
    color: 'transparent',
    border: 'rgba(196,181,253,0.18)',
    dur: 30, delay: 5,
  },
]

export function DreamScene() {
  const stageRef = useRef(null)
  const shardRefs = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!stageRef.current) return
    const ctx = gsap.context(() => {

      // Each shard gets its own dream-logic animation:
      // slow rotation → sudden pause → drift away → snap back
      shardRefs.current.forEach((el, i) => {
        if (!el) return
        const s = SHARDS[i]

        // Floating drift (Y oscillation at different speeds and offsets)
        gsap.to(el, {
          y: '+=28',
          duration: s.dur * 0.55,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: s.delay * 0.4,
        })

        // Continuous slow rotation on Y axis — the "impossibility" axis
        gsap.to(el, {
          rotateY: `+=${i % 2 === 0 ? 360 : -360}`,
          duration: s.dur,
          repeat: -1,
          ease: 'none',
          delay: s.delay * 0.3,
        })

        // Clip-path morphing — crystal geometry shifts between impossible forms
        gsap.to(el, {
          clipPath: s.clipMorph,
          duration: s.dur * 1.1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          delay: s.delay * 0.6,
        })

        // Occasional "dream skip" — sudden rotateX jolt
        const jolt = () => {
          const wait = 4000 + Math.random() * 8000
          setTimeout(() => {
            gsap.timeline()
              .to(el, { rotateX: `+=${(Math.random() > 0.5 ? 1 : -1) * 90}`, duration: 0.4, ease: 'power3.in' })
              .to(el, { rotateX: `+=${(Math.random() > 0.5 ? 1 : -1) * 90}`, duration: 1.2, ease: 'elastic.out(1, 0.5)' })
              .add(jolt)
          }, wait)
        }
        jolt()
      })

      // Mouse parallax on the whole stage
      const onMove = (e) => {
        const cx = window.innerWidth / 2
        const cy = window.innerHeight / 2
        const rx = ((e.clientY - cy) / cy) * -6
        const ry = ((e.clientX - cx) / cx) * 8
        gsap.to(stageRef.current, {
          rotateX: rx,
          rotateY: ry,
          duration: 1.4,
          ease: 'power3.out',
        })
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    }, stageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className={styles.viewport} aria-hidden="true">
      <div className={styles.stage} ref={stageRef}>
        {SHARDS.map((s, i) => (
          <div
            key={s.id}
            ref={el => shardRefs.current[i] = el}
            className={styles.shard}
            style={{
              width: s.size,
              height: s.size,
              left: s.x,
              top: s.y,
              clipPath: s.clip,
              background: s.color,
              boxShadow: `inset 0 0 0 1px ${s.border}, 0 0 30px ${s.border.replace(')', ', 0.3)').replace('rgba', 'rgba')}`,
              transform: `rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`,
              backdropFilter: 'blur(2px)',
            }}
          />
        ))}

        {/* Glow orbs that bleed through the shapes */}
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.glow3} />
      </div>
    </div>
  )
}
