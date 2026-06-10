import { useState } from 'react'
import { useSaveData }  from './hooks/useSaveData'
import SaveUpload       from './components/SaveUpload'
import TrainerInfo      from './components/TrainerInfo'
import PartyGrid        from './components/PartyGrid'
import BoxGrid          from './components/BoxGrid'
import PokedexGrid      from './components/PokedexGrid'
import './App.css'

const SPRITE_SETS = [
  { value: 'auto',     label: 'Auto (animated → HOME → FireRed → icon)' },
  { value: 'showdown', label: 'Showdown (animated GIFs)' },
  { value: 'home',     label: 'Pokémon HOME' },
  { value: 'firered',  label: 'FireRed / LeafGreen' },
  { value: 'icons',    label: 'Icons' },
]

export default function App() {
  const {
    saveData,
    loading,
    error,
    savedUrl,
    saveSource,
    preferUpload,
    setSavedUrl,
    upload,
    fetchFromUrl,
    reset,
  } = useSaveData()
  const [spriteSet, setSpriteSet] = useState('auto')
  const showUrlBar = savedUrl.trim() && saveSource !== 'file' && (saveData || loading || (!preferUpload && !saveData))
  const showUploadScreen = !saveData && !loading && (preferUpload || !savedUrl.trim())
  const showUrlRecovery = !saveData && !loading && !preferUpload && savedUrl.trim()

  function handleUrlKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!loading && savedUrl.trim()) fetchFromUrl(savedUrl, { keepCurrentData: !!saveData })
    }
  }

  function handleRefetch() {
    fetchFromUrl(savedUrl, { keepCurrentData: !!saveData })
  }

  return (
    <div className="app">
      <header className="header">
        {(showUrlBar || saveData) && (
          <div className="headerActions">
            {showUrlBar && (
              <div className="url-bar">
                <input
                  type="url"
                  className="url-input"
                  value={savedUrl}
                  onChange={(e) => setSavedUrl(e.target.value)}
                  onKeyDown={handleUrlKeyDown}
                  disabled={loading}
                  spellCheck={false}
                  aria-label="Save file URL"
                />
                <button
                  type="button"
                  className="accent-btn"
                  onClick={handleRefetch}
                  disabled={loading || !savedUrl.trim()}
                >
                  {loading ? 'Fetching…' : 'Refetch'}
                </button>
              </div>
            )}
            {saveData && (
              <button className="resetBtn" onClick={reset} disabled={loading}>
                Load another save
              </button>
            )}
          </div>
        )}
      </header>

      {showUploadScreen && (
        <main className="uploadArea">
          <SaveUpload
            onUpload={upload}
            onFetchUrl={fetchFromUrl}
            url={savedUrl}
            onUrlChange={setSavedUrl}
            loading={loading}
          />

          {error && (
            <div className="error" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <p className="hint">
            Supports all generations via PKHeX.Core — Gen 1 (Red/Blue) through Gen 9 (Scarlet/Violet).
            Local files stay on your device. Your last fetched URL is remembered — use Fetch or Refetch to load the latest save.
          </p>
        </main>
      )}

      {showUrlRecovery && (
        <main className="loadingArea">
          <p>Could not load save from URL.</p>
          {error && (
            <div className="error" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          <p className="hint">Update the URL above and click Refetch.</p>
        </main>
      )}

      {!saveData && loading && (
        <main className="loadingArea">
          <div className="spinner" aria-hidden="true" />
          <p>Loading save from URL…</p>
          {error && (
            <div className="error" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
        </main>
      )}

      {saveData && (
        <main className="viewer">
          {error && (
            <div className="error" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className="toolbar">
            <TrainerInfo trainer={saveData.trainer} />
            <label className="spriteLabel">
              Sprites
              <select
                className="spriteSelect"
                value={spriteSet}
                onChange={(e) => setSpriteSet(e.target.value)}
              >
                {SPRITE_SETS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
          <PartyGrid   party={saveData.party}   spriteSet={spriteSet} />
          <BoxGrid     boxes={saveData.boxes}   spriteSet={spriteSet} />
          <PokedexGrid pokedex={saveData.pokedex} />
        </main>
      )}

      <footer className="footer">
        Powered by{' '}
        <a href="https://github.com/kwsch/PKHeX" target="_blank" rel="noreferrer">PKHeX.Core</a>
        {' · '}
        <a href="https://github.com/codemonkey85/PKMDS-Blazor" target="_blank" rel="noreferrer">PKMDS-Blazor</a>
      </footer>
    </div>
  )
}
