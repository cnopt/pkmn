import { useState } from 'react'
import { buildFallbacks } from '../utils/pokemonSprites'

export default function SpriteImage({ species, isShiny, name, spriteSet, className }) {
  const fallbacks = buildFallbacks(species, isShiny, spriteSet)
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <img
      src={fallbacks[idx]}
      alt={name}
      className={className}
      loading="lazy"
      onError={() => {
        if (idx + 1 < fallbacks.length) {
          setIdx(idx + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}
