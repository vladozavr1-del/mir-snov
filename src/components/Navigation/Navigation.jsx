import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navigation.module.css'

const navLinks = [
  { path: '/', label: 'Главная' },
  { path: '/dictionary', label: 'Сонник' },
  { path: '/articles', label: 'Статьи' },
  { path: '/about', label: 'О нас' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
        <span className={styles.logoSymbol}>◈</span>
        <span className={styles.logoText}>Мир снов</span>
      </Link>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {navLinks.map(link => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
              end={link.path === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
