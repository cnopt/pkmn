import typeSpritesUrl from '../assets/type-sprites.png'

/** Native sprite size in the FRLG type sheet (pixels). */
export const TYPE_SPRITE_W = 32
export const TYPE_SPRITE_H = 16

/** Sheet layout: 4 columns × 6 rows, 128×96 px total. */
export const TYPE_SHEET_COLS = 4
export const TYPE_SHEET_W = 128
export const TYPE_SHEET_H = 96

/** Integer scale factor — keeps pixel art crisp when upscaled. */
export const TYPE_SPRITE_SCALE = 1

export const typeSpritesSheet = typeSpritesUrl

/**
 * PKHeX MoveType skips game type 9 (???), so ids from Fire onward are one
 * lower than the FRLG sprite sheet (e.g. PKHeX Water=10 → sheet Water=11).
 */
export function toGameSpriteTypeId(pkhexTypeId) {
  if (pkhexTypeId >= 9 && pkhexTypeId <= 16) return pkhexTypeId + 1
  if (pkhexTypeId === 17) return 9 // Fairy — no G3 icon; use ???
  return pkhexTypeId
}

/** Maps game type id (0–17) to grid column and row in the sheet. */
export function typeSpritePosition(typeId) {
  const spriteId = toGameSpriteTypeId(typeId)
  const col = spriteId % TYPE_SHEET_COLS
  const row = Math.floor(spriteId / TYPE_SHEET_COLS)
  return { col, row }
}

export function typeSpriteStyle(typeId, scale = TYPE_SPRITE_SCALE) {
  const { col, row } = typeSpritePosition(typeId)
  const w = TYPE_SPRITE_W * scale
  const h = TYPE_SPRITE_H * scale

  return {
    width: `${w}px`,
    height: `${h}px`,
    backgroundImage: `url(${typeSpritesSheet})`,
    backgroundSize: `${TYPE_SHEET_W * scale}px ${TYPE_SHEET_H * scale}px`,
    backgroundPosition: `-${col * w}px -${row * h}px`,
  }
}
