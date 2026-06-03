import { useState, useCallback } from 'react'

/**
 * Manages the lifecycle of a Pokémon save file upload:
 *   - POSTs the file to /api/parse-save
 *   - Tracks loading / error state
 *   - Exposes the parsed SaveDataDto as `saveData`
 *   - Exposes `reset()` to clear the loaded save and start over
 */
export function useSaveData() {
  const [saveData, setSaveData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const upload = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    setSaveData(null)

    const form = new FormData()
    form.append('save', file)

    try {
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
    } catch (err) {
      setError(err.message ?? 'Failed to parse save file.')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSaveData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { saveData, loading, error, upload, reset }
}
