import { useRef, useState } from 'react'
import styles from './SaveUpload.module.css'

const ACCEPTED_EXTENSIONS = ['.sav', '.bin', '.srm', '.dat', '.dsv', '.gci', '.raw', '.main']

export default function SaveUpload({ onUpload, loading }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files) {
    const file = files[0]
    if (!file) return
    onUpload(file)
  }

  function handleChange(e) {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  return (
    <div
      className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${loading ? styles.loading : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !loading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload save file"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !loading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleChange}
        className={styles.hiddenInput}
        aria-hidden="true"
      />
      <div className={styles.icon}>
        {loading ? (
          <div className={styles.spinner} />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        )}
      </div>
      <p className={styles.primary}>
        {loading ? 'Parsing save file…' : 'Drop your save file here'}
      </p>
      {!loading && (
        <p className={styles.secondary}>
          or click to browse &mdash; .sav, .bin, .dat and more
        </p>
      )}
    </div>
  )
}
