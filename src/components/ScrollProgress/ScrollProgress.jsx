import { useEffect, useRef } from 'react'
import styles from './ScrollProgress.module.css'

export function ScrollProgress() {
  const fillRef = useRef(null)
  const numRef  = useRef(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      if (fillRef.current) fillRef.current.style.width = pct + '%'
      if (numRef.current)  numRef.current.textContent  = Math.round(pct) + '%'
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.fill} ref={fillRef} />
      </div>
      <span className={styles.num} ref={numRef}>0%</span>
    </div>
  )
}
