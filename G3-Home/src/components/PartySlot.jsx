import SpriteImage from './SpriteImage'
import styles from './PartySlot.module.css'

export default function PartySlot({ pokemon, slot, selected, onSelect, spriteSet }) {
  if (pokemon.isEmpty) {
    return (
      <button
        type="button"
        className={`${styles.slot} ${styles.empty} ${selected ? styles.selected : ''}`}
        onClick={() => onSelect(slot)}
        aria-label={`Empty slot ${slot + 1}`}
      />
    )
  }

  return (
    <button
      type="button"
      className={`${styles.slot} ${pokemon.isShiny ? styles.shiny : ''} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect(slot)}
      aria-label={pokemon.speciesName}
      aria-pressed={selected}
    >
      {pokemon.isShiny && <span className={styles.badge} title="Shiny">✨</span>}
      {pokemon.isEgg && <span className={`${styles.badge} ${styles.eggBadge}`} title="Egg">🥚</span>}
      <SpriteImage
        key={`${pokemon.species}-${spriteSet}`}
        species={pokemon.species}
        isShiny={pokemon.isShiny}
        name={pokemon.speciesName}
        spriteSet={spriteSet}
        className={styles.sprite}
      />
    </button>
  )
}
