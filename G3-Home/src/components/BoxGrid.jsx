import { useState } from 'react'
import PokemonCard from './PokemonCard'
import styles from './BoxGrid.module.css'

function BoxView({ box, spriteSet }) {
  return (
    <div className={styles.box}>
      <h4 className={styles.boxName}>{box.name}</h4>
      <div className={styles.boxGrid}>
        {box.slots.map((pokemon, i) => (
          <PokemonCard key={i} pokemon={pokemon} slot={i} source="box" spriteSet={spriteSet} />
        ))}
      </div>
    </div>
  )
}

export default function BoxGrid({ boxes, spriteSet }) {
  const [selectedBox, setSelectedBox] = useState(0)

  if (!boxes?.length) return null

  const nonEmpty = boxes.filter((b) => b.slots.some((s) => !s.isEmpty))
  const allEmpty  = nonEmpty.length === 0

  // Show all non-empty boxes (or all if everything is empty)
  const visible = allEmpty ? boxes : nonEmpty

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.heading}>PC Boxes</h3>
        <span className={styles.count}>
          {nonEmpty.length} / {boxes.length} boxes used
        </span>
      </div>

      {visible.length > 1 && (
        <div className={styles.tabs}>
          {visible.map((box, i) => (
            <button
              key={i}
              className={`${styles.tab} ${i === selectedBox ? styles.activeTab : ''}`}
              onClick={() => setSelectedBox(i)}
            >
              {box.name}
            </button>
          ))}
        </div>
      )}

      {visible[selectedBox] && <BoxView box={visible[selectedBox]} spriteSet={spriteSet} />}
    </section>
  )
}
