import styles from './PokemonCard.module.css'

export const STAT_ABBR = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']
export const STAT_KEYS = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed']

export function StatBar({ label, value, max = 255 }) {
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

export function PokemonStatsBlock({ pokemon }) {
  const ivTotal = pokemon.ivs
    ? Object.values(pokemon.ivs).reduce((s, v) => s + v, 0)
    : null

  return (
    <>
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
    </>
  )
}
