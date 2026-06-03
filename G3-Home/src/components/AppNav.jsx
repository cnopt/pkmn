import { NavLink } from 'react-router-dom'
import styles from './AppNav.module.css'

const LINKS = [
  { to: '/trainer', label: 'Trainer' },
  { to: '/party',   label: 'Party' },
  { to: '/boxes',   label: 'Boxes' },
  { to: '/pokedex', label: 'Pokédex' },
]

export default function AppNav() {
  return (
    <nav className={styles.nav} aria-label="Save sections">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
