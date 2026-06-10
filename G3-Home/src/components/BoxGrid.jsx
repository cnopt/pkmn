import { useState } from 'react'
import dataViewUrl  from '../assets/pokemon-data-view.png'
import boxBgUrl     from '../assets/box1-bg.png'
import boxLabelUrl  from '../assets/box1-label.png'
import btnLeftUrl   from '../assets/button-left.png'
import btnRightUrl  from '../assets/button-right.png'
import './BoxGrid.css'

// ── Sprite helpers ────────────────────────────────────────────────────────────

function iconUrl(species) {
  return `/pksprite/regular/${species}.png`
}

function fireredUrl(species, isShiny) {
  return isShiny
    ? `/sprites/firered/shiny/${species}.png`
    : `/sprites/firered/${species}.png`
}

// ── BoxSlot ───────────────────────────────────────────────────────────────────

function BoxSlot({ pokemon, onEnter, onLeave }) {
  const isEmpty = !pokemon || pokemon.isEmpty

  return (
    <div
      className={`box-slot${isEmpty ? ' box-slot--empty' : ''}`}
      onMouseEnter={() => onEnter(isEmpty ? null : pokemon)}
      onMouseLeave={onLeave}
    >
      {!isEmpty && (
        <>
          <img
            src={iconUrl(pokemon.speciesName).toLowerCase()}
            alt={pokemon.speciesName}
            className="box-slot-icon"
            draggable={false}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          {pokemon.isShiny && (
            <span className="box-slot-shiny" title="Shiny">★</span>
          )}
        </>
      )}
    </div>
  )
}

// ── DataPanel ─────────────────────────────────────────────────────────────────

function DataPanel({ pokemon }) {
  const hasPokemon = pokemon && !pokemon.isEmpty

  return (
    <div className="data-panel">
      <img
        src={dataViewUrl}
        alt="Pokémon Data"
        className="data-panel-bg pixelart"
        draggable={false}
      />

      {/* Preview sprite overlaid in the blue checkered region */}
      <div className="data-panel-preview">
        {hasPokemon && (
          <img
            src={fireredUrl(pokemon.species, pokemon.isShiny)}
            alt={pokemon.speciesName}
            className="data-panel-sprite pixelart"
            draggable={false}
            onError={(e) => {
              // Fallback to icon if firered sprite missing
              e.currentTarget.src = iconUrl(pokemon.species)
            }}
          />
        )}
      </div>

      {/* Info text overlaid in the gray lower section */}
      {hasPokemon && (
        <div className="data-panel-info">
          <span className="data-info-name">{pokemon.speciesName}</span>
          <span className="data-info-level">Lv.{pokemon.level}</span>
          {pokemon.isShiny && <span className="data-info-shiny">✦</span>}
        </div>
      )}
    </div>
  )
}

// ── BoxView ───────────────────────────────────────────────────────────────────

function BoxView({ box, onSlotHover, onSlotLeave }) {
  return (
    <div className="box-content">
      <div className="box-container">
        <img
          src={boxBgUrl}
          alt=""
          className="box-bg-img pixelart"
          draggable={false}
        />
        <div className="box-grid-overlay">
          {box.slots.map((pokemon, i) => (
            <BoxSlot
              key={i}
              pokemon={pokemon}
              onEnter={onSlotHover}
              onLeave={onSlotLeave}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Root BoxGrid ──────────────────────────────────────────────────────────────

export default function BoxGrid({ boxes }) {
  const [selectedBox, setSelectedBox]     = useState(0)
  const [hoveredPokemon, setHoveredPokemon] = useState(null)

  if (!boxes?.length) return null

  const nonEmpty = boxes.filter((b) => b.slots.some((s) => !s.isEmpty))
  const visible  = nonEmpty.length === 0 ? boxes : nonEmpty
  const total    = visible.length

  const currentIndex = Math.min(selectedBox, total - 1)
  const currentBox   = visible[currentIndex]

  function prevBox() {
    setSelectedBox((i) => (i - 1 + total) % total)
    setHoveredPokemon(null)
  }
  function nextBox() {
    setSelectedBox((i) => (i + 1) % total)
    setHoveredPokemon(null)
  }

  function handleSlotHover(pokemon) {
    setHoveredPokemon(pokemon)
  }
  function handleSlotLeave() {
    setHoveredPokemon(null)
  }

  return (
    <>
    <div className='pc-header'>
      <p>Box Viewer</p>
    </div>
    <div className="pc-screen">
      {/* Left: Pokémon Data panel */}
      <DataPanel pokemon={hoveredPokemon} />

      {/* Right: Box navigation + grid */}
      <div className="box-panel">
        {/* Label bar: ← BOX N → */}
        <div className="label-bar">
          <button
            className="nav-btn"
            onClick={prevBox}
            aria-label="Previous box"
          >
            <img
              src={btnLeftUrl}
              alt="◀"
              className="nav-btn-img pixelart"
              draggable={false}
            />
          </button>

          <div className="label-center">
            <img
              src={boxLabelUrl}
              alt=""
              className="label-bg-img pixelart"
              draggable={false}
            />
            <span className="box-name-text">{currentBox.name}</span>
          </div>

          <button
            className="nav-btn"
            onClick={nextBox}
            aria-label="Next box"
          >
            <img
              src={btnRightUrl}
              alt="▶"
              className="nav-btn-img pixelart"
              draggable={false}
            />
          </button>
        </div>

        {/* Box background + Pokémon grid */}
        <BoxView
          box={currentBox}
          onSlotHover={handleSlotHover}
          onSlotLeave={handleSlotLeave}
        />
      </div>
    </div>
    </>
  )
}
