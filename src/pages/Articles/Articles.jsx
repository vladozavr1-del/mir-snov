import { useState, useMemo } from 'react'
import { articles, categories } from '../../data/articles'
import { ScrollReveal } from '../../components/ScrollReveal/ScrollReveal'
import { DreamCard } from '../../components/DreamCard/DreamCard'
import styles from './Articles.module.css'

export function Articles() {
  const [activeCategory, setActiveCategory] = useState(null)

  const filtered = useMemo(() => {
    if (!activeCategory) return articles
    return articles.filter(a => a.category === activeCategory)
  }, [activeCategory])

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <ScrollReveal>
          <p className={styles.eyebrow}>◈ Знания о снах</p>
          <h1 className={styles.title}>Статьи</h1>
          <p className={styles.subtitle}>Психология, символы и практики осознанных сновидений</p>
        </ScrollReveal>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${!activeCategory ? styles.active : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          Все
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => setActiveCategory(prev => prev === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {filtered.map((article, i) => (
            <ScrollReveal key={article.id} delay={i * 80} direction="up">
              <DreamCard type="article" data={article} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  )
}
