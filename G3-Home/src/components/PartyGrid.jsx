import PokemonCard from './PokemonCard'
import './PartyGrid.css'

export default function PartyGrid({ party, spriteSet }) {
  const slots = [...party]
  while (slots.length < 6) slots.push({ isEmpty: true })

  return (
    <section className="party-grid">
      <h3 className="heading">Party</h3>
      <div className="grid">
        {slots.map((pokemon, i) => (
          <PokemonCard key={i} pokemon={pokemon} slot={i} source="party" spriteSet={spriteSet} />
        ))}
      </div>
    </section>
  )
}
