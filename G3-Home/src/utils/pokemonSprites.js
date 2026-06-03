export const SPRITE_FALLBACK_ORDER = ['showdown', 'home', 'firered', 'icons']

export function spriteUrl(set, species, isShiny) {
  const s = isShiny ? '/shiny' : ''
  switch (set) {
    case 'showdown': return `/sprites/showdown${s}/${species}.gif`
    case 'home':     return `/sprites/home${s}/${species}.png`
    case 'firered':  return `/sprites/firered${s}/${species}.png`
    case 'icons':    return `/sprites/icons/${species}.png`
    default:         return null
  }
}

export function buildFallbacks(species, isShiny, spriteSet) {
  if (spriteSet && spriteSet !== 'auto') {
    const rest = SPRITE_FALLBACK_ORDER.filter((s) => s !== spriteSet)
    return [spriteSet, ...rest].map((s) => spriteUrl(s, species, isShiny))
  }
  return SPRITE_FALLBACK_ORDER.map((s) => spriteUrl(s, species, isShiny))
}

export function iconUrl(species) {
  return `/sprites/icons/${species}.png`
}
