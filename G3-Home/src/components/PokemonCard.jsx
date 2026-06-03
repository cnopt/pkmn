import SpriteImage from './SpriteImage'
import { PokemonStatsBlock } from './PokemonStats'
import styles from './PokemonCard.module.css'

export default function PokemonCard({ pokemon, slot, source, spriteSet }) {
  if (pokemon.isEmpty) {
    return (
      <div className={`${styles.card} ${styles.empty}`}>
        <span className={styles.emptyLabel}>{source === 'party' ? `Slot ${slot + 1}` : ''}</span>
      </div>
    )
  }

  return (
    <div className={`${styles.card} ${pokemon.isShiny ? styles.shiny : ''}`}>
      {pokemon.isShiny && <span className={styles.shinyBadge} title="Shiny">✨</span>}
      {pokemon.isEgg  && <span className={styles.eggBadge}   title="Egg">🥚</span>}

      <SpriteImage
        species={pokemon.species}
        isShiny={pokemon.isShiny}
        name={pokemon.speciesName}
        spriteSet={spriteSet}
        className={styles.sprite}
      />

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.species}>{pokemon.speciesName}</span>
          {pokemon.nickname && pokemon.nickname !== pokemon.speciesName && (
            <span className={styles.nickname}>"{pokemon.nickname}"</span>
          )}
        </div>

        <div className={styles.metaRow}>
          <span className={styles.level}>Lv. {pokemon.level}</span>
          <span className={styles.gender} title={pokemon.gender}>
            {pokemon.gender === 'Male' ? '♂' : pokemon.gender === 'Female' ? '♀' : ''}
          </span>
          {pokemon.natureName && (
            <span className={styles.nature}>{pokemon.natureName}</span>
          )}
        </div>

        {pokemon.heldItemName && (
          <div className={styles.heldItem}>🎒 {pokemon.heldItemName}</div>
        )}
      </div>

      {pokemon.moves?.length > 0 && (
        <div className={styles.moves}>
          {pokemon.moves.map((m) => (
            <span key={m.id} className={styles.move}>{m.name}</span>
          ))}
        </div>
      )}

      <PokemonStatsBlock pokemon={pokemon} />
    </div>
  )
}
