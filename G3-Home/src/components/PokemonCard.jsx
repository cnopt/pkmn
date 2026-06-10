import { useState } from 'react'
import { TypeBadges } from './TypeBadge'
import './PokemonCard.css'

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
      className="sprite"
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
    <div className="statRow">
      <span className="statLabel">{label}</span>
      <span className="statValue">{value}</span>
      <div className="statBarTrack">
        <div className="statBarFill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function PokemonCard({ pokemon, slot, source, spriteSet }) {
  if (pokemon.isEmpty) {
    return (
      <div className="pokemon-card empty">
        <span className="emptyLabel">{source === 'party' ? `Slot ${slot + 1}` : ''}</span>
      </div>
    )
  }

  const ivTotal = pokemon.ivs
    ? Object.values(pokemon.ivs).reduce((s, v) => s + v, 0)
    : null

  return (
    <div className={`pokemon-card ${pokemon.isShiny ? 'shiny' : ''}`}>
      {pokemon.isShiny && <span className="shinyBadge" title="Shiny">✨</span>}
      {pokemon.isEgg  && <span className="eggBadge"   title="Egg">🥚</span>}

      <TypeBadges
        type1={pokemon.type1}
        type2={pokemon.type2}
        type1Name={pokemon.type1Name}
        type2Name={pokemon.type2Name}
      />

      <SpriteImage
        species={pokemon.species}
        isShiny={pokemon.isShiny}
        name={pokemon.speciesName}
        spriteSet={spriteSet}
      />

      <div className="info">
        <div className="nameRow">
          <span className="species">{pokemon.speciesName}</span>
          {pokemon.isNicknamed && (
            <span className="nickname">"{pokemon.nickname}"</span>
          )}
        </div>

        <div className="metaRow">
          <span className="level">Lv. {pokemon.level}</span>
          <span className="gender" title={pokemon.gender}>
            {pokemon.gender === 'Male' ? '♂' : pokemon.gender === 'Female' ? '♀' : ''}
          </span>
          {pokemon.natureName && (
            <span className="nature">{pokemon.natureName}</span>
          )}
        </div>

        {pokemon.heldItemName && (
          <div className="heldItem">🎒 {pokemon.heldItemName}</div>
        )}
      </div>

      {pokemon.moves?.length > 0 && (
        <div className="moves">
          {pokemon.moves.map((m) => (
            <span key={m.id} className="move">{m.name}</span>
          ))}
        </div>
      )}

      <div className="statsBlock">
        {STAT_ABBR.map((label, i) => (
          <StatBar key={label} label={label} value={pokemon[STAT_KEYS[i]] ?? 0} />
        ))}
      </div>

      {ivTotal !== null && (
        <div className="ivSummary">
          IVs: {ivTotal} / 186
          {ivTotal === 186 && <span className="perfect"> ★</span>}
        </div>
      )}
    </div>
  )
}
