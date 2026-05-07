import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { dreamSymbols, searchDreams, alphabet } from '../../data/dreams'
import { ScrollReveal } from '../../components/ScrollReveal/ScrollReveal'
import { DreamCard } from '../../components/DreamCard/DreamCard'
import styles from './Dictionary.module.css'

export function Dictionary() {
  const [query, setQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState(null)

  const filtered = useMemo(() => {
    if (query.trim()) return searchDreams(query)
    if (activeLetter) return dreamSymbols.filter(d => d.letter === activeLetter)
    return dreamSymbols
  }, [query, activeLetter])

  const handleLetterClick = (letter) => {
    setActiveLetter(prev => prev === letter ? null : letter)
    setQuery('')
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <ScrollReveal>
          <p className={styles.eyebrow}>◈ Энциклопедия снов</p>
          <h1 className={styles.title}>Сонник</h1>
          <p className={styles.subtitle}>
            Каждый символ — послание из мира, где правят Мастера снов
          </p>
        </ScrollReveal>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>◐</span>
          <input
            className={styles.search}
            type="text"
            placeholder="Искать символ..."
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setActiveLetter(null)
            }}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        <div className={styles.alphabet}>
          {alphabet.map(letter => (
            <button
              key={letter}
              className={`${styles.letterBtn} ${activeLetter === letter ? styles.active : ''}`}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.container}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>Символ не найден. Попробуйте другой запрос.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((symbol, i) => (
              <ScrollReveal key={symbol.id} delay={i * 80} direction="up">
                <DreamCard type="symbol" data={symbol} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
