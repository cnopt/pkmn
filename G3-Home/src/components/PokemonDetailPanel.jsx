import SpriteImage from './SpriteImage'
import { PokemonStatsBlock } from './PokemonStats'
import cardStyles from './PokemonCard.module.css'
import styles from './PokemonDetailPanel.module.css'

export default function PokemonDetailPanel({ pokemon, spriteSet, onClose }) {
  if (!pokemon || pokemon.isEmpty) return null

  return (
    <aside className={`${styles.panel} ${pokemon.isShiny ? styles.shiny : ''}`}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close details"
      >
        ×
      </button>

      {pokemon.isShiny && <span className={styles.badge} title="Shiny">✨</span>}
      {pokemon.isEgg && <span className={`${styles.badge} ${styles.eggBadge}`} title="Egg">🥚</span>}

      <div className={styles.spriteWrap}>
        <SpriteImage
          key={`${pokemon.species}-${spriteSet}`}
          species={pokemon.species}
          isShiny={pokemon.isShiny}
          name={pokemon.speciesName}
          spriteSet={spriteSet}
          className={styles.sprite}
        />
      </div>

      <div className={cardStyles.info}>
        <div className={cardStyles.nameRow}>
          <span className={cardStyles.species}>{pokemon.speciesName}</span>
          {pokemon.nickname && pokemon.nickname !== pokemon.speciesName && (
            <span className={cardStyles.nickname}>"{pokemon.nickname}"</span>
          )}
        </div>

        <div className={cardStyles.metaRow}>
          <span className={cardStyles.level}>Lv. {pokemon.level}</span>
          <span className={cardStyles.gender} title={pokemon.gender}>
            {pokemon.gender === 'Male' ? '♂' : pokemon.gender === 'Female' ? '♀' : ''}
          </span>
          {pokemon.natureName && (
            <span className={cardStyles.nature}>{pokemon.natureName}</span>
          )}
        </div>

        {pokemon.abilityName && (
          <div className={styles.detailLine}>
            <span className={styles.detailLabel}>Ability</span>
            <span>{pokemon.abilityName}</span>
          </div>
        )}

        {pokemon.heldItemName && (
          <div className={cardStyles.heldItem}>🎒 {pokemon.heldItemName}</div>
        )}

        {pokemon.otName && (
          <div className={styles.detailLine}>
            <span className={styles.detailLabel}>OT</span>
            <span>{pokemon.otName}</span>
          </div>
        )}
      </div>

      {pokemon.moves?.length > 0 && (
        <div className={cardStyles.moves}>
          {pokemon.moves.map((m) => (
            <span key={m.id} className={cardStyles.move}>{m.name}</span>
          ))}
        </div>
      )}

      <PokemonStatsBlock pokemon={pokemon} />
    </aside>
  )
}
