import { Link } from 'react-router-dom'
import { useCardTilt } from '../../hooks/useCardTilt'
import styles from './DreamCard.module.css'

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function DreamCard({ type = 'article', data }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt()

  if (type === 'article') {
    return (
      <Link
        to={`/articles/${data.id}`}
        className={styles.card}
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        data-anim="stagger-child"
      >
        <div className={styles.cardInner}>
          <div className={styles.meta}>
            <span className={styles.category}>{data.category}</span>
            <span className={styles.readTime}>{data.readTime}</span>
          </div>
          <h3 className={styles.title}>{data.title}</h3>
          <p className={styles.excerpt}>{data.excerpt}</p>
          <div className={styles.tags}>
            {data.tags.slice(0, 3).map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
          <div className={styles.readMore}>
            <span>Читать</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>
        <div className={styles.glow} data-tilt-glow />
      </Link>
    )
  }

  if (type === 'symbol') {
    const c = data.color || '#7c3aed'
    const symbolVars = {
      '--symbol-color': c,
      '--symbol-bg': hexToRgba(c, 0.12),
      '--symbol-border': hexToRgba(c, 0.28),
      '--symbol-shadow-sm': hexToRgba(c, 0.18),
      '--symbol-shadow-lg': hexToRgba(c, 0.32),
      '--symbol-glow-bg': hexToRgba(c, 0.09),
    }
    return (
      <Link
        to={`/dictionary/${data.id}`}
        className={`${styles.card} ${styles.symbolCard}`}
        style={symbolVars}
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        data-anim="stagger-child"
      >
        <div className={styles.cardInner}>
          <div className={styles.symbolIcon}>{data.letter}</div>
          <h3 className={styles.title}>{data.title}</h3>
          <p className={styles.subtitle}>{data.subtitle}</p>
          <p className={styles.excerpt}>{data.shortDesc}</p>
          <div className={styles.tags}>
            {data.tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        </div>
        <div className={styles.glow} data-tilt-glow />
      </Link>
    )
  }

  return null
}
