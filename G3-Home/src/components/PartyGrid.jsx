import PokemonCard from './PokemonCard'
import styles from './PartyGrid.module.css'

export default function PartyGrid({ party, spriteSet }) {
  const slots = [...party]
  while (slots.length < 6) slots.push({ isEmpty: true })

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>Party</h3>
      <div className={styles.grid}>
        {slots.map((pokemon, i) => (
          <PokemonCard key={i} pokemon={pokemon} slot={i} source="party" spriteSet={spriteSet} />
        ))}
      </div>
    </section>
  )
}
