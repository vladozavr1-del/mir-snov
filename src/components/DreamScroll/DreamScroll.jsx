import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './DreamScroll.module.css'

gsap.registerPlugin(ScrollTrigger)

const R1 = 'Вода · Лес · Полёт · Луна · Зеркало · Огонь · Змея · Лабиринт · '
const R2 = 'Сновидец · Тень · Путь · Символ · Мир · '
const R3 = 'Сон · Явь · '

const SHARDS = [
  { clip: 'polygon(50% 0%, 95% 30%, 80% 100%, 20% 100%, 5% 30%)',
    w: 210, x: '63%', y: '10%', color: 'rgba(124,58,237,0.17)', border: 'rgba(167,139,250,0.35)' },
  { clip: 'polygon(50% 0%, 100% 60%, 75% 100%, 25% 100%, 0% 60%)',
    w: 140, x: '76%', y: '48%', color: 'rgba(99,102,241,0.13)', border: 'rgba(196,181,253,0.25)' },
  { clip: 'polygon(50% 0%, 100% 100%, 0% 100%)',
    w: 170, x: '16%', y: '52%', color: 'rgba(109,40,217,0.11)', border: 'rgba(139,92,246,0.28)' },
  { clip: 'polygon(0% 20%, 60% 0%, 100% 50%, 60% 100%, 0% 80%)',
    w: 115, x: '10%', y: '16%', color: 'transparent',           border: 'rgba(167,139,250,0.20)' },
  { clip: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    w: 95,  x: '46%', y: '70%', color: 'rgba(91,33,182,0.09)',  border: 'rgba(124,58,237,0.22)' },
  { clip: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    w: 70,  x: '30%', y: '18%', color: 'transparent',           border: 'rgba(196,181,253,0.16)' },
]

export function DreamScroll() {
  const outerRef     = useRef(null)
  const vortexRef    = useRef(null)
  const sceneRef     = useRef(null)
  const manifestoRef = useRef(null)
  const g1Ref        = useRef(null)
  const g2Ref        = useRef(null)
  const g3Ref        = useRef(null)
  const irisRef      = useRef(null)
  const pupilRef     = useRef(null)

  // One ref per shard + mline — populated in JSX via callback refs
  const shardRefs = useRef([])
  const mlineRefs = useRef([])

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return

    const shards = shardRefs.current.filter(Boolean)
    const mlines = mlineRefs.current.filter(Boolean)

    const ctx = gsap.context(() => {
      const O = '300 300'

      // Set hidden layers invisible before timeline starts
      gsap.set(sceneRef.current,     { opacity: 0 })
      gsap.set(manifestoRef.current, { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: '+=420%',
          pin: true,
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      })

      // ── PHASE 1: TEXT VORTEX (0 → 0.35) ─────────────────────────────────
      tl
        .to(g1Ref.current, { rotation:  290, svgOrigin: O, ease: 'none' }, 0)
        .to(g2Ref.current, { rotation: -215, svgOrigin: O, ease: 'none' }, 0)
        .to(g3Ref.current, { rotation:  165, svgOrigin: O, ease: 'none' }, 0)
        .to(irisRef.current,  { attr: { ry: 22 }, ease: 'power2.in' }, 0)
        .to(pupilRef.current, { attr: { ry: 10 }, ease: 'power2.in' }, 0)

        // Vortex scales out and fades
        .to(vortexRef.current, { opacity: 0, scale: 1.6, ease: 'power2.in' }, 0.32)

      // ── PHASE 2: CRYSTAL SCENE (0.38 → 0.62) ─────────────────────────────
        .to(sceneRef.current, { opacity: 1 }, 0.38)
        .fromTo(shards,
          { opacity: 0, y: 80, scale: 0.3 },
          { opacity: 1, y: 0,  scale: 1,
            stagger: { amount: 0.12, from: 'start' },
            ease: 'back.out(1.2)' },
          0.39
        )
        // Shards slowly drift upward
        .to(shards, { y: -40, ease: 'none' }, 0.52)
        // Scene exits — shards fly off upward
        .to(shards,        { opacity: 0, y: -110 }, 0.60)
        .to(sceneRef.current, { opacity: 0 }, 0.63)

      // ── PHASE 3: MANIFESTO (0.65 → 0.88) ─────────────────────────────────
        .to(manifestoRef.current, { opacity: 1 }, 0.65)
        .fromTo(mlines,
          { clipPath: 'inset(0 102% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)',
            stagger: 0.05,
            ease: 'power2.out' },
          0.67
        )
        // Manifesto exits upward
        .to(manifestoRef.current, { opacity: 0, y: -60 }, 0.87)

    })

    return () => ctx.revert()
  }, [])

  const C  = 300
  const mk = (r) =>
    `M ${C},${C} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`

  return (
    <section className={styles.outer} ref={outerRef}>
      <div className={styles.canvas}>

        {/* ── LAYER 1: TEXT VORTEX ──────────────────────────────── */}
        <div className={styles.layer} ref={vortexRef}>
          <svg
            className={styles.vortexSvg}
            viewBox="0 0 600 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id="ds1" d={mk(248)} />
              <path id="ds2" d={mk(184)} />
              <path id="ds3" d={mk(122)} />
              <radialGradient id="dsIrisG" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#04020d" />
                <stop offset="28%"  stopColor="#3b0764" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
            </defs>

            <g ref={g1Ref}>
              <text className={styles.rt1}>
                <textPath href="#ds1">{R1.repeat(2)}</textPath>
              </text>
            </g>
            <g ref={g2Ref}>
              <text className={styles.rt2}>
                <textPath href="#ds2">{R2.repeat(4)}</textPath>
              </text>
            </g>
            <g ref={g3Ref}>
              <text className={styles.rt3}>
                <textPath href="#ds3">{R3.repeat(9)}</textPath>
              </text>
            </g>

            <g transform={`translate(${C}, ${C})`}>
              <ellipse rx="66" ry="36" fill="rgba(124,58,237,0.06)" />
              <path d="M -57,0 Q 0,-29 57,0 Q 0,29 -57,0 Z" fill="rgba(4,2,13,0.93)" />
              <ellipse ref={irisRef} rx="22" ry="0.6" fill="url(#dsIrisG)" />
              <ellipse ref={pupilRef} rx="10" ry="0.3" fill="#04020d" />
              <path d="M -57,0 Q 0,-29 57,0" fill="none" stroke="rgba(167,139,250,0.55)" strokeWidth="1" />
              <path d="M -57,0 Q 0,29 57,0"  fill="none" stroke="rgba(167,139,250,0.38)" strokeWidth="1" />
              <circle cx="-8" cy="-8" r="3.5" fill="rgba(255,255,255,0.62)" />
            </g>
          </svg>
        </div>

        {/* ── LAYER 2: CRYSTAL SCENE ────────────────────────────── */}
        <div className={styles.layer} ref={sceneRef}>
          {SHARDS.map((s, i) => (
            <div
              key={i}
              ref={el => { shardRefs.current[i] = el }}
              className={styles.shard}
              style={{
                width: s.w,
                height: s.w,
                left: s.x,
                top: s.y,
                clipPath: s.clip,
                background: s.color,
                boxShadow: `inset 0 0 0 1px ${s.border}, 0 0 40px ${s.border}`,
              }}
            />
          ))}
        </div>

        {/* ── LAYER 3: MANIFESTO ────────────────────────────────── */}
        <div className={styles.layer} ref={manifestoRef}>
          <div className={styles.manifesto}>
            <span ref={el => { mlineRefs.current[0] = el }} className={styles.mLine}>
              Каждый сон —
            </span>
            <em ref={el => { mlineRefs.current[1] = el }} className={`${styles.mLine} ${styles.mAccent}`}>
              послание
            </em>
            <span ref={el => { mlineRefs.current[2] = el }} className={styles.mLine}>
              из той части тебя,
            </span>
            <span ref={el => { mlineRefs.current[3] = el }} className={styles.mLine}>
              которую ты ещё не познал
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
