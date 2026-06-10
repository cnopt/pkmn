const STORAGE_KEY = 'pksave-reader-save-url'

export function readSavedUrl() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function writeSavedUrl(url) {
  try {
    if (url) localStorage.setItem(STORAGE_KEY, url)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* private browsing or storage quota */
  }
}
