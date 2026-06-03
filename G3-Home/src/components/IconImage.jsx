import { useState } from 'react'
import { iconUrl } from '../utils/pokemonSprites'

export default function IconImage({ species, name, className }) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <img
      src={iconUrl(species)}
      alt={name}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
