import { useState, useEffect } from 'react'
import PartySlot from './PartySlot'
import PokemonDetailPanel from './PokemonDetailPanel'
import styles from './PartyGrid.module.css'

export default function PartyGrid({ party, spriteSet }) {
  const slots = [...party]
  while (slots.length < 6) slots.push({ isEmpty: true })

  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    const nextSlots = [...party]
    while (nextSlots.length < 6) nextSlots.push({ isEmpty: true })
    setSelectedIndex((prev) => {
      if (prev === null) return null
      if (prev < nextSlots.length && !nextSlots[prev].isEmpty) return prev
      return null
    })
  }, [party])

  function handleSelect(slot) {
    const pokemon = slots[slot]
    if (pokemon.isEmpty) {
      setSelectedIndex(null)
    } else {
      setSelectedIndex(slot)
    }
  }

  const selected =
    selectedIndex !== null && selectedIndex < slots.length
      ? slots[selectedIndex]
      : null

  const showPanel = selected && !selected.isEmpty

  return (
    <div className={`${styles.layout} ${showPanel ? styles.withPanel : ''}`}>
      <section className={styles.gridColumn}>
        <h3 className={styles.heading}>Party</h3>
        <div className={styles.grid}>
          {slots.map((pokemon, i) => (
            <PartySlot
              key={i}
              pokemon={pokemon}
              slot={i}
              selected={showPanel && selectedIndex === i}
              onSelect={handleSelect}
              spriteSet={spriteSet}
            />
          ))}
        </div>
      </section>

      {showPanel && (
        <div className={styles.detailColumn}>
          <PokemonDetailPanel
            pokemon={selected}
            spriteSet={spriteSet}
            onClose={() => setSelectedIndex(null)}
          />
        </div>
      )}
    </div>
  )
}
