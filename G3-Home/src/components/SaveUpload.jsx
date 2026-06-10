import { useRef, useState } from 'react'
import './SaveUpload.css'

const ACCEPTED_EXTENSIONS = ['.sav', '.srm', '.bin', '.dat', '.dsv', '.gci', '.raw', '.main']

export default function SaveUpload({ onUpload, onFetchUrl, url, onUrlChange, loading }) {
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

  function handleFetchClick(e) {
    e.stopPropagation()
    if (!loading && url.trim()) onFetchUrl(url)
  }

  function handleUrlKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!loading && url.trim()) onFetchUrl(url)
    }
  }

  return (
    <div className="save-upload">
      <div
        className={`dropzone ${dragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
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
          className="hiddenInput"
          aria-hidden="true"
        />
        <div className="icon">
          {loading ? (
            <div className="spinner" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          )}
        </div>
        <p className="primary">
          {loading ? 'Parsing save file…' : 'Drop your save file here'}
        </p>
        {!loading && (
          <p className="secondary">
            or click to browse &mdash; .sav, .bin, .dat and more
          </p>
        )}
      </div>

      <p className="divider" aria-hidden="true">or</p>

      <div className="urlSection" onClick={(e) => e.stopPropagation()}>
        <label className="urlLabel" htmlFor="save-url">
          Fetch from URL
        </label>
        <div className="url-bar">
          <input
            id="save-url"
            type="url"
            className="url-input"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            disabled={loading}
            spellCheck={false}
          />
          <button
            type="button"
            className="accent-btn"
            onClick={handleFetchClick}
            disabled={loading || !url.trim()}
          >
            Fetch
          </button>
        </div>
      </div>
    </div>
  )
}
