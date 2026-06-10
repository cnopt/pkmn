import { useState, useCallback, useEffect, useRef } from 'react'
import { readSavedUrl, writeSavedUrl } from '../utils/saveUrlStorage'

function filenameFromResponse(url, res) {
  const disposition = res.headers.get('Content-Disposition')
  if (disposition) {
    const match = /filename\*?=(?:UTF-8'')?"?([^";\n]+)"?/i.exec(disposition)
    if (match?.[1]) return decodeURIComponent(match[1])
  }
  try {
    const name = new URL(url).pathname.split('/').pop()
    if (name) return name
  } catch { /* ignore invalid URL */ }
  return 'save.sav'
}

/**
 * Manages the lifecycle of a Pokémon save file upload:
 *   - POSTs the file to /api/parse-save
 *   - Persists the last successful fetch URL in localStorage
 *   - Exposes refetch() to reload the saved URL without leaving the viewer
 *   - Tracks loading / error state
 *   - Exposes the parsed SaveDataDto as `saveData`
 *   - Exposes `reset()` to clear the loaded save and start over
 */
export function useSaveData() {
  const [saveData, setSaveData] = useState(null)
  const [loading, setLoading] = useState(() => !!readSavedUrl().trim())
  const [error, setError]     = useState(null)
  const [savedUrl, setSavedUrl] = useState(readSavedUrl)
  const [saveSource, setSaveSource] = useState(null)
  const [preferUpload, setPreferUpload] = useState(false)
  const didAutoFetch = useRef(false)

  const parseFile = useCallback(async (file) => {
    const form = new FormData()
    form.append('save', file)

    const res = await fetch('/api/parse-save', {
      method: 'POST',
      body: form,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? `Server returned ${res.status}`)
    }

    const data = await res.json()
    setSaveData(data)
  }, [])

  const upload = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    setSaveData(null)
    setSaveSource('file')

    try {
      await parseFile(file)
      setSaveSource('file')
    } catch (err) {
      setError(err.message ?? 'Failed to parse save file.')
    } finally {
      setLoading(false)
    }
  }, [parseFile])

  const fetchFromUrl = useCallback(async (url, { keepCurrentData = false } = {}) => {
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Enter a URL to fetch.')
      return
    }

    setLoading(true)
    setError(null)
    if (!keepCurrentData) setSaveData(null)

    try {
      const res = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? `Failed to fetch URL (${res.status})`)
      }

      const blob = await res.blob()
      const filename = filenameFromResponse(trimmed, res)
      const file = new File([blob], filename, { type: blob.type || 'application/octet-stream' })
      await parseFile(file)
      writeSavedUrl(trimmed)
      setSavedUrl(trimmed)
      setSaveSource('url')
    } catch (err) {
      setError(err.message ?? 'Failed to fetch save from URL.')
    } finally {
      setLoading(false)
    }
  }, [parseFile])

  const refetch = useCallback(() => {
    if (!savedUrl.trim()) {
      setError('No saved URL to refetch.')
      return
    }
    return fetchFromUrl(savedUrl, { keepCurrentData: true })
  }, [savedUrl, fetchFromUrl])

  const reset = useCallback(() => {
    setSaveData(null)
    setError(null)
    setLoading(false)
    setSaveSource(null)
    setPreferUpload(true)
  }, [])

  useEffect(() => {
    if (didAutoFetch.current || preferUpload) return
    const url = readSavedUrl().trim()
    if (!url) return
    didAutoFetch.current = true
    fetchFromUrl(url)
  }, [fetchFromUrl, preferUpload])

  return {
    saveData,
    loading,
    error,
    savedUrl,
    saveSource,
    preferUpload,
    setSavedUrl,
    upload,
    fetchFromUrl,
    refetch,
    reset,
  }
}
