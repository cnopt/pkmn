import { useState }     from 'react'
import { useSaveData }  from './hooks/useSaveData'
import SaveUpload       from './components/SaveUpload'
import TrainerInfo      from './components/TrainerInfo'
import PartyGrid        from './components/PartyGrid'
import BoxGrid          from './components/BoxGrid'
import styles           from './App.module.css'

const SPRITE_SETS = [
  { value: 'auto',     label: 'Auto (animated → HOME → FireRed → icon)' },
  { value: 'showdown', label: 'Showdown (animated GIFs)' },
  { value: 'home',     label: 'Pokémon HOME' },
  { value: 'firered',  label: 'FireRed / LeafGreen' },
  { value: 'icons',    label: 'Icons' },
]

export default function App() {
  const { saveData, loading, error, upload, reset } = useSaveData()
  const [spriteSet, setSpriteSet] = useState('auto')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.ball}>⬤</span> PKSave Reader
        </h1>
        <p className={styles.subtitle}>
          Upload any Pokémon save file to inspect party and box data
        </p>
        {saveData && (
          <button className={styles.resetBtn} onClick={reset}>
            Load another save
          </button>
        )}
      </header>

      {!saveData && (
        <main className={styles.uploadArea}>
          <SaveUpload onUpload={upload} loading={loading} />

          {error && (
            <div className={styles.error} role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <p className={styles.hint}>
            Supports all generations via PKHeX.Core — Gen 1 (Red/Blue) through Gen 9 (Scarlet/Violet).
            Files stay on your device; nothing is uploaded to a remote server.
          </p>
        </main>
      )}

      {saveData && (
        <main className={styles.viewer}>
          <div className={styles.toolbar}>
            <TrainerInfo trainer={saveData.trainer} />
            <label className={styles.spriteLabel}>
              Sprites
              <select
                className={styles.spriteSelect}
                value={spriteSet}
                onChange={(e) => setSpriteSet(e.target.value)}
              >
                {SPRITE_SETS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
          <PartyGrid party={saveData.party} spriteSet={spriteSet} />
          <BoxGrid   boxes={saveData.boxes} spriteSet={spriteSet} />
        </main>
      )}

      <footer className={styles.footer}>
        Powered by{' '}
        <a href="https://github.com/kwsch/PKHeX" target="_blank" rel="noreferrer">PKHeX.Core</a>
        {' · '}
        <a href="https://github.com/codemonkey85/PKMDS-Blazor" target="_blank" rel="noreferrer">PKMDS-Blazor</a>
      </footer>
    </div>
  )
}
