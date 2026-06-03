import { useState } from 'react'
import styles from './PokemonCard.module.css'

const STAT_ABBR = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']
const STAT_KEYS = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed']

const SPRITE_FALLBACK_ORDER = ['showdown', 'home', 'firered', 'icons']

function spriteUrl(set, species, isShiny) {
  const s = isShiny ? '/shiny' : ''
  switch (set) {
    case 'showdown': return `/sprites/showdown${s}/${species}.gif`
    case 'home':     return `/sprites/home${s}/${species}.png`
    case 'firered':  return `/sprites/firered${s}/${species}.png`
    case 'icons':    return `/sprites/icons/${species}.png`
    default:         return null
  }
}

function buildFallbacks(species, isShiny, spriteSet) {
  if (spriteSet && spriteSet !== 'auto') {
    // Pin to the selected set, then fall back through the rest
    const rest = SPRITE_FALLBACK_ORDER.filter((s) => s !== spriteSet)
    return [spriteSet, ...rest].map((s) => spriteUrl(s, species, isShiny))
  }
  return SPRITE_FALLBACK_ORDER.map((s) => spriteUrl(s, species, isShiny))
}

function SpriteImage({ species, isShiny, name, spriteSet }) {
  const fallbacks = buildFallbacks(species, isShiny, spriteSet)
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <img
      src={fallbacks[idx]}
      alt={name}
      className={styles.sprite}
      loading="lazy"
      onError={() => {
        if (idx + 1 < fallbacks.length) {
          setIdx(idx + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}

function StatBar({ label, value, max = 255 }) {
  const pct = Math.round((value / max) * 100)
  const color =
    value >= 120 ? '#4caf50' :
    value >= 80  ? '#8bc34a' :
    value >= 50  ? '#ffc107' :
    value >= 30  ? '#ff9800' : '#f44336'

  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      <div className={styles.statBarTrack}>
        <div className={styles.statBarFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function PokemonCard({ pokemon, slot, source, spriteSet }) {
  if (pokemon.isEmpty) {
    return (
      <div className={`${styles.card} ${styles.empty}`}>
        <span className={styles.emptyLabel}>{source === 'party' ? `Slot ${slot + 1}` : ''}</span>
      </div>
    )
  }

  const ivTotal = pokemon.ivs
    ? Object.values(pokemon.ivs).reduce((s, v) => s + v, 0)
    : null

  return (
    <div className={`${styles.card} ${pokemon.isShiny ? styles.shiny : ''}`}>
      {pokemon.isShiny && <span className={styles.shinyBadge} title="Shiny">✨</span>}
      {pokemon.isEgg  && <span className={styles.eggBadge}   title="Egg">🥚</span>}

      <SpriteImage
        species={pokemon.species}
        isShiny={pokemon.isShiny}
        name={pokemon.speciesName}
        spriteSet={spriteSet}
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

      <div className={styles.statsBlock}>
        {STAT_ABBR.map((label, i) => (
          <StatBar key={label} label={label} value={pokemon[STAT_KEYS[i]] ?? 0} />
        ))}
      </div>

      {ivTotal !== null && (
        <div className={styles.ivSummary}>
          IVs: {ivTotal} / 186
          {ivTotal === 186 && <span className={styles.perfect}> ★</span>}
        </div>
      )}
    </div>
  )
}
