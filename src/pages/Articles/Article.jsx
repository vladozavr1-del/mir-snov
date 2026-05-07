import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { getArticleById, articles } from '../../data/articles'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { ScrollReveal } from '../../components/ScrollReveal/ScrollReveal'
import { DreamCard } from '../../components/DreamCard/DreamCard'
import styles from './Article.module.css'

export function Article() {
  const { id } = useParams()
  const article = getArticleById(id)
  const progress = useScrollProgress()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!article) {
    return (
      <main className={styles.main}>
        <div className={styles.notFound}>
          <p>Статья не найдена</p>
          <Link to="/articles">← Вернуться к статьям</Link>
        </div>
      </main>
    )
  }

  const related = articles.filter(a => a.id !== id && a.category === article.category).slice(0, 2)

  const renderContent = (text) => {
    return text.trim().split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className={styles.heading2}>{line.slice(3)}</h2>
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        const inner = line.slice(2, -2)
        return <p key={i}><strong>{inner}</strong></p>
      }
      if (line.startsWith('- **')) {
        const rest = line.slice(2)
        const parts = rest.split('** — ')
        if (parts.length === 2) {
          return (
            <li key={i} className={styles.listItem}>
              <strong>{parts[0].slice(2)}</strong> — {parts[1]}
            </li>
          )
        }
        return <li key={i} className={styles.listItem}>{line.slice(2)}</li>
      }
      if (line.startsWith('- ')) {
        return <li key={i} className={styles.listItem}>{line.slice(2)}</li>
      }
      if (line.match(/^\d+\. /)) {
        return <li key={i} className={`${styles.listItem} ${styles.ordered}`}>{line.replace(/^\d+\. /, '')}</li>
      }
      if (line.trim() === '') return null
      return <p key={i}>{line}</p>
    }).filter(Boolean)
  }

  return (
    <main className={styles.main}>
      {/* Scroll progress bar */}
      <div className={styles.progressBar} style={{ transform: `scaleX(${progress})` }} />

      <div className={styles.container}>
        <ScrollReveal>
          <Link to="/articles" className={styles.back}>← Статьи</Link>
        </ScrollReveal>

        <header className={styles.articleHeader}>
          <ScrollReveal delay={100}>
            <div className={styles.meta}>
              <span className={styles.category}>{article.category}</span>
              <span className={styles.readTime}>{article.readTime}</span>
              <span className={styles.date}>
                {new Date(article.date).toLocaleDateString('ru', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className={styles.title}>{article.title}</h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className={styles.excerpt}>{article.excerpt}</p>
          </ScrollReveal>
          <ScrollReveal delay={350}>
            <div className={styles.tags}>
              {article.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </ScrollReveal>
        </header>

        <ScrollReveal delay={400}>
          <div className={styles.divider} />
        </ScrollReveal>

        <ScrollReveal delay={450}>
          <div className={styles.content}>
            {renderContent(article.content)}
          </div>
        </ScrollReveal>

        {related.length > 0 && (
          <div className={styles.related}>
            <ScrollReveal>
              <h3 className={styles.relatedTitle}>Читайте также</h3>
            </ScrollReveal>
            <div className={styles.relatedGrid}>
              {related.map((a, i) => (
                <ScrollReveal key={a.id} delay={i * 100}>
                  <DreamCard type="article" data={a} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
