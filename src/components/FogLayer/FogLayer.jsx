import styles from './FogLayer.module.css'

export function FogLayer() {
  return (
    <div className={styles.fogContainer} aria-hidden="true">
      <div className={styles.fog1} />
      <div className={styles.fog2} />
      <div className={styles.fog3} />
      <div className={styles.vignette} />
    </div>
  )
}
