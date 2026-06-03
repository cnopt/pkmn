import styles from './SpriteToolbar.module.css'

const SPRITE_SETS = [
  { value: 'auto',     label: 'Auto (animated → HOME → FireRed → icon)' },
  { value: 'showdown', label: 'Showdown (animated GIFs)' },
  { value: 'home',     label: 'Pokémon HOME' },
  { value: 'firered',  label: 'FireRed / LeafGreen' },
  { value: 'icons',    label: 'Icons' },
]

export default function SpriteToolbar({ spriteSet, onSpriteSetChange }) {
  return (
    <div className={styles.toolbar}>
      <label className={styles.label}>
        Sprites
        <select
          className={styles.select}
          value={spriteSet}
          onChange={(e) => onSpriteSetChange(e.target.value)}
        >
          {SPRITE_SETS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
