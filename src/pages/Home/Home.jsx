import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DreamScene } from '../../components/DreamScene/DreamScene'
import { DreamCard } from '../../components/DreamCard/DreamCard'
import { DreamScroll } from '../../components/DreamScroll/DreamScroll'
import { useScrollAnimations } from '../../hooks/useScrollAnimations'
import { useMagnetic } from '../../hooks/useMagnetic'
import { articles } from '../../data/articles'
import { dreamSymbols } from '../../data/dreams'
import styles from './Home.module.css'

gsap.registerPlugin(ScrollTrigger)

export function Home() {
  const pageRef       = useRef(null)
  const sceneWrapRef  = useRef(null)
  const eyeSvgRef     = useRef(null)
  const eyeInnerRef   = useRef(null)

  const ctaPrimaryRef = useMagnetic(0.28)
  const ctaGhostRef   = useMagnetic(0.22)

  useScrollAnimations(pageRef)

  // Hero entrance — Pinatri-style: rows fly in from different directions
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl
        .from('[data-hero="badge"]',  { y: -24, opacity: 0, duration: 0.9, delay: 0.15 })
        .from('[data-hero="row1"]',   { y: 130, opacity: 0, duration: 1.35 }, '-=0.55')
        .from('[data-hero="orb"]',    { scale: 0, opacity: 0, duration: 1.1, ease: 'back.out(1.3)' }, '-=1.15')
        .from('[data-hero="row2-l"]', { x: -90, opacity: 0, duration: 1.1 }, '<0.05')
        .from('[data-hero="row2-r"]', { x: 90,  opacity: 0, duration: 1.1 }, '<')
        .from('[data-hero="row3"]',   { y: 55, opacity: 0, duration: 1.0 }, '-=0.75')
        .from('[data-hero="strip"]',  { y: 34, opacity: 0, duration: 0.85 }, '-=0.5')
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // Subtle parallax: orb drifts opposite direction to page scroll
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const y = window.scrollY
        if (y > window.innerHeight * 1.1) return
        if (sceneWrapRef.current) {
          sceneWrapRef.current.style.transform = `translateY(${-y * 0.1}px)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Eye cursor tracking in quote section
  useEffect(() => {
    const onMove = (e) => {
      const svg   = eyeSvgRef.current
      const inner = eyeInnerRef.current
      if (!svg || !inner) return
      const rect  = svg.getBoundingClientRect()
      const ecx   = rect.left + rect.width  * (420 / 840)
      const ecy   = rect.top  + rect.height * (160 / 320)
      const dx    = e.clientX - ecx
      const dy    = e.clientY - ecy
      const dist  = Math.sqrt(dx * dx + dy * dy)
      const pxPerUnit = rect.width / 840
      const maxPx = 9 * pxPerUnit
      const nx    = dist > 0 ? dx / dist : 0
      const ny    = dist > 0 ? dy / dist : 0
      const travel = Math.min(dist * 0.18, maxPx)
      gsap.to(inner, { x: nx * travel, y: ny * travel, duration: 0.45, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <main className={styles.page} ref={pageRef}>

      {/* ── HERO: editorial Pinatri style ── */}
      <section className={styles.hero}>

        {/* Badge — like ISBN label in Pinatri */}
        <div className={styles.heroBadge} data-hero="badge">
          <span className={styles.heroBadgeIcon} aria-hidden="true" />
          Платформа о сновидениях · 2025
        </div>

        {/* Giant editorial title */}
        <div className={styles.heroTitleBlock}>

          {/* Row 1: МИР */}
          <div className={styles.titleRow} data-hero="row1">
            <span className={styles.titleText}>МИР</span>
          </div>

          {/* Row 2: СН[ORБATA]В — DreamScene replaces О */}
          <div className={styles.titleRow} data-hero="row2">
            <span className={styles.titleText} data-hero="row2-l">СН</span>
            <div
              className={styles.titleOrb}
              ref={sceneWrapRef}
              data-hero="orb"
              aria-hidden="true"
            >
              <DreamScene />
            </div>
            <span className={styles.titleText} data-hero="row2-r">В</span>
          </div>

          {/* Row 3: italic sub-line */}
          <span className={styles.titleItalic} data-hero="row3">
            сновидений
          </span>
        </div>

        {/* Bottom info strip */}
        <div className={styles.heroInfoStrip} data-hero="strip">
          <span className={styles.heroDiamond} aria-hidden="true">◇</span>
          <div className={styles.heroInfoCol}>
            <span>Тайный язык снов</span>
            <span>и символов ночи</span>
          </div>
          <div className={styles.heroInfoCol}>
            <span>Сонник · Статьи · Практики</span>
            <span>осознанных сновидений</span>
          </div>
          <div className={styles.heroCtaGroup}>
            <Link
              to="/dictionary"
              className={styles.ctaPrimary}
              ref={ctaPrimaryRef}
              data-interactive="true"
            >
              Открыть сонник →
            </Link>
            <Link
              to="/articles"
              className={styles.ctaGhost}
              ref={ctaGhostRef}
              data-interactive="true"
            >
              Читать статьи
            </Link>
          </div>
        </div>

        {/* Marquee strip */}
        <div className={styles.marqueeWrap} aria-hidden="true">
          <div className={styles.marquee}>
            {Array(4).fill('Сны · Символы · Практики · Осознанность · Архетипы · Тень · Сновидец ·').map((t, i) =>
              <span key={i}>{t}&nbsp;</span>
            )}
          </div>
        </div>
      </section>

      {/* ── IMMERSIVE SCROLL ── */}
      <DreamScroll />

      {/* ── SYMBOLS ── */}
      <section className={styles.symbolsSection}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelNum} data-anim="number">02</span>
          <span>Энциклопедия снов</span>
        </div>
        <h2 className={styles.sectionHeading} data-anim="heading">Символы</h2>
        <div className={styles.symbolsStrip} data-anim="stagger-parent">
          {dreamSymbols.slice(0, 4).map((sym) => (
            <Link
              key={sym.id}
              to={`/dictionary/${sym.id}`}
              className={styles.symbolItem}
              data-interactive="true"
              data-anim="stagger-child"
            >
              <span className={styles.symbolLetter} style={{ color: sym.color }}>{sym.letter}</span>
              <span className={styles.symbolTitle}>{sym.title}</span>
              <span className={styles.symbolSub}>{sym.subtitle}</span>
              <span className={styles.symbolArrow}>↗</span>
            </Link>
          ))}
          <Link
            to="/dictionary"
            className={`${styles.symbolItem} ${styles.symbolSeeAll}`}
            data-interactive="true"
            data-anim="stagger-child"
          >
            <span className={styles.symbolLetter} style={{ color: 'var(--color-lavender)' }}>→</span>
            <span className={styles.symbolTitle}>Весь сонник</span>
            <span className={styles.symbolSub}>{dreamSymbols.length} символов</span>
          </Link>
        </div>
      </section>

      {/* ── FEATURED ARTICLE ── */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelNum} data-anim="number">03</span>
          <span>Главная статья</span>
        </div>
        <Link
          to={`/articles/${articles[4].id}`}
          className={styles.featuredCard}
          data-interactive="true"
          data-anim="featured"
        >
          <div className={styles.featuredCategory}>{articles[4].category}</div>
          <h2 className={styles.featuredTitle}>{articles[4].title}</h2>
          <p className={styles.featuredExcerpt}>{articles[4].excerpt}</p>
          <span className={styles.featuredCta}>Читать статью →</span>
          <div className={styles.featuredGlow} data-tilt-glow />
        </Link>
      </section>

      {/* ── ARTICLES ── */}
      <section className={styles.articlesSection}>
        <div className={styles.articlesHeader}>
          <div>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNum} data-anim="number">04</span>
              <span>Статьи</span>
            </div>
            <h2 className={styles.sectionHeading} data-anim="heading">Последние</h2>
          </div>
          <Link to="/articles" className={styles.seeAllLink} data-interactive="true">Все статьи →</Link>
        </div>
        <div className={styles.articlesGrid} data-anim="stagger-parent">
          {articles.slice(0, 4).map(article => (
            <DreamCard key={article.id} type="article" data={article} />
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteBg} aria-hidden="true">◈</div>
        <div className={styles.eyeQuoteWrap} data-anim="quote">
          <svg
            ref={eyeSvgRef}
            className={styles.eyeQuoteSvg}
            viewBox="0 0 840 320"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <path id="qtop" d="M 75,160 Q 420,50 765,160" />
              <path id="qbot" d="M 75,160 Q 420,270 765,160" />
              <radialGradient id="qIrisG" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#04020d" />
                <stop offset="28%"  stopColor="#3b0764" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
            </defs>
            <text className={styles.arcText} dy="1.05em">
              <textPath href="#qtop" startOffset="50%" textAnchor="middle">
                Между сном и явью нет пропасти —
              </textPath>
            </text>
            <text className={styles.arcText}>
              <textPath href="#qbot" startOffset="50%" textAnchor="middle">
                есть лишь тонкая нить
              </textPath>
            </text>
            <g transform="translate(420, 160)">
              <ellipse rx="66" ry="36" fill="rgba(124,58,237,0.06)" className={styles.eyeGlow} />
              <path d="M -58,0 Q 0,-28 58,0 Q 0,28 -58,0 Z" fill="rgba(4,2,13,0.92)" />
              <g ref={eyeInnerRef}>
                <ellipse rx="20" ry="20" fill="url(#qIrisG)" className={styles.eyeIris} />
                <ellipse rx="9" ry="9" fill="#04020d" />
                <circle cx="-7" cy="-7" r="3.2" fill="rgba(255,255,255,0.65)" />
                <circle cx="6"  cy="5"  r="1.5" fill="rgba(255,255,255,0.3)" />
              </g>
              <path d="M -58,0 Q 0,-28 58,0" fill="none" stroke="rgba(167,139,250,0.52)" strokeWidth="0.9" />
              <path d="M -58,0 Q 0,28 58,0"  fill="none" stroke="rgba(167,139,250,0.36)" strokeWidth="0.9" />
            </g>
          </svg>
          <cite className={styles.eyeCite}>— Мастер снов</cite>
        </div>
      </section>

    </main>
  )
}
