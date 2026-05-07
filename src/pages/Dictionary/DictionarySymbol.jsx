import { useParams, Link } from 'react-router-dom'
import { dreamSymbols } from '../../data/dreams'

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
import { ScrollReveal } from '../../components/ScrollReveal/ScrollReveal'
import styles from './DictionarySymbol.module.css'

export function DictionarySymbol() {
  const { id } = useParams()
  const symbol = dreamSymbols.find(d => d.id === id)

  if (!symbol) {
    return (
      <main className={styles.main}>
        <div className={styles.notFound}>
          <p>Символ не найден</p>
          <Link to="/dictionary">← Вернуться в сонник</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <ScrollReveal>
          <Link to="/dictionary" className={styles.back}>← Сонник</Link>
        </ScrollReveal>

        <div className={styles.symbolHeader}>
          <ScrollReveal delay={100}>
            <div
              className={styles.symbolIcon}
              style={{
                '--symbol-color': symbol.color,
                '--symbol-bg': hexToRgba(symbol.color, 0.1),
                '--symbol-border': hexToRgba(symbol.color, 0.28),
                '--symbol-shadow': hexToRgba(symbol.color, 0.18),
              }}
            >
              {symbol.letter}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className={styles.title}>{symbol.title}</h1>
            <p className={styles.subtitle}>{symbol.subtitle}</p>
            <div className={styles.tags}>
              {symbol.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={300}>
          <div className={styles.content}>
            {symbol.fullDesc.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className={styles.moreSymbols}>
            <h3>Другие символы</h3>
            <div className={styles.otherList}>
              {dreamSymbols
                .filter(d => d.id !== symbol.id)
                .slice(0, 4)
                .map(d => (
                  <Link key={d.id} to={`/dictionary/${d.id}`} className={styles.otherItem}>
                    <span style={{ color: d.color }}>{d.letter}</span>
                    <span>{d.title}</span>
                  </Link>
                ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  )
}
