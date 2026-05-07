import { useInView } from 'react-intersection-observer'
import styles from './ScrollReveal.module.css'

export function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const { ref, inView } = useInView({
    threshold: 0.12,
    triggerOnce: true,
  })

  const dirClass = {
    up: styles.fromUp,
    left: styles.fromLeft,
    right: styles.fromRight,
    fade: styles.fromFade,
  }[direction] || styles.fromUp

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${dirClass} ${inView ? styles.visible : ''} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
