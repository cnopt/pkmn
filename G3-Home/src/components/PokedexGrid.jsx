import { useMemo, useState } from 'react'
import './PokedexGrid.css'

const FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'caught', label: 'Caught' },
  { id: 'seen',   label: 'Seen only' },
  { id: 'none',   label: 'Unseen' },
]

function DexCell({ entry }) {
  const status = entry.caught ? 'caught' : entry.seen ? 'seen' : 'none'
  const title = `${entry.speciesName} (#${entry.species}) — ${
    entry.caught ? 'Caught' : entry.seen ? 'Seen' : 'Not registered'
  }`

  const iconSrc = `/sprites/icons/${entry.species}.png`

  return (
    <div
      className={`cell ${status}`}
      title={title}
      aria-label={title}
    >
      <img
        src={iconSrc}
        alt=""
        className="icon"
        loading="lazy"
        onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
      />
      <span className="dexNum">{entry.species}</span>
    </div>
  )
}

export default function PokedexGrid({ pokedex }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const entries = pokedex?.entries ?? []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((e) => {
      if (filter === 'caught' && !e.caught) return false
      if (filter === 'seen' && (!e.seen || e.caught)) return false
      if (filter === 'none' && (e.seen || e.caught)) return false
      if (q && !e.speciesName.toLowerCase().includes(q) && !String(e.species).includes(q))
        return false
      return true
    })
  }, [entries, filter, search])

  if (!pokedex) return null

  const caughtPct = pokedex.totalInGame
    ? Math.round((pokedex.caughtCount / pokedex.totalInGame) * 100)
    : 0
  const seenPct = pokedex.totalInGame
    ? Math.round((pokedex.seenCount / pokedex.totalInGame) * 100)
    : 0

  return (
    <section className="pokedex-grid">
      <div className="header">
        <h3 className="heading">Pokédex</h3>
        <div className="summary">
          <span className="statCaught">
            {pokedex.caughtCount} caught ({caughtPct}%)
          </span>
          <span className="statSeen">
            {pokedex.seenCount} seen ({seenPct}%)
          </span>
          <span className="statTotal">
            {pokedex.totalInGame} in this game
          </span>
        </div>
      </div>

      <div className="controls">
        <div className="filters" role="tablist" aria-label="Pokédex filter">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`filterBtn ${filter === f.id ? 'activeFilter' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="search"
          placeholder="Search by name or #…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search Pokédex"
        />
      </div>

      <p className="resultCount">
        Showing {filtered.length} of {entries.length} entries
      </p>

      <div className="legend">
        <span><span className="swatch swatchCaught" /> Caught</span>
        <span><span className="swatch swatchSeen" /> Seen</span>
        <span><span className="swatch swatchNone" /> Unseen</span>
      </div>

      <div className="grid">
        {filtered.map((entry) => (
          <DexCell key={entry.species} entry={entry} />
        ))}
      </div>
    </section>
  )
}
