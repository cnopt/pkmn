import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useSaveData } from './hooks/useSaveData'
import SaveUpload from './components/SaveUpload'
import AppNav from './components/AppNav'
import TrainerPage from './pages/TrainerPage'
import PartyPage from './pages/PartyPage'
import BoxesPage from './pages/BoxesPage'
import PokedexPage from './pages/PokedexPage'
import styles from './App.module.css'

const SUBHEADER_LABELS = {
  '/': 'Select a save file to view',
  '/trainer': 'Trainer',
  '/party': 'Party',
  '/boxes': 'Boxes',
  '/pokedex': 'Pokédex',
}

export default function App() {
  const { saveData, loading, error, upload, reset } = useSaveData()
  const [spriteSet, setSpriteSet] = useState('auto')
  const navigate = useNavigate()
  const location = useLocation()
  const hadSaveRef = useRef(false)
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    if (saveData && !hadSaveRef.current) {
      navigate('/trainer', { replace: true })
    }
    hadSaveRef.current = Boolean(saveData)
  }, [saveData, navigate])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    function updateHeight() {
      setHeaderHeight(el.offsetHeight)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [saveData])

  function handleReset() {
    reset()
    navigate('/', { replace: true })
  }

  const subheaderLabel = SUBHEADER_LABELS[location.pathname] ?? 'G3 Pokémon Home'

  return (
    <div className={styles.app}>
      <div className={styles.headerStack} ref={headerRef}>
        <header className={styles.headerBar}>
          <div className={styles.titleTab}>
            <h1 className={styles.title}>G3PH</h1>
          </div>
          <div className={styles.headerMid}>
            {saveData && <AppNav />}
          </div>
          {saveData && (
            <div className={styles.headerEnd}>
              <button className={styles.resetBtn} onClick={handleReset}>
                Load another save
              </button>
            </div>
          )}
        </header>

        <div className={styles.subHeader}>
          <p className={styles.subHeaderText}>{subheaderLabel}</p>
        </div>
      </div>

      <div className={styles.main} style={{ paddingTop: headerHeight }}>
        <Routes>
        <Route
          path="/"
          element={
            saveData ? (
              <Navigate to="/party" replace />
            ) : (
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
            )
          }
        />
        <Route
          path="/trainer"
          element={
            saveData ? (
              <main className={styles.viewer}>
                <TrainerPage trainer={saveData.trainer} />
              </main>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/party"
          element={
            saveData ? (
              <main className={styles.viewer}>
                <PartyPage
                  party={saveData.party}
                  spriteSet={spriteSet}
                  onSpriteSetChange={setSpriteSet}
                />
              </main>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/boxes"
          element={
            saveData ? (
              <main className={styles.viewer}>
                <BoxesPage
                  boxes={saveData.boxes}
                  spriteSet={spriteSet}
                  onSpriteSetChange={setSpriteSet}
                />
              </main>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/pokedex"
          element={
            saveData ? (
              <main className={styles.viewer}>
                <PokedexPage pokedex={saveData.pokedex} />
              </main>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={saveData ? '/trainer' : '/'} replace />} />
        </Routes>
      </div>
    </div>
  )
}
