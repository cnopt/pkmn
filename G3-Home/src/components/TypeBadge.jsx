import { typeSpriteStyle } from '../utils/typeSprites'
import './TypeBadge.css'

export default function TypeBadge({ typeId, typeName }) {
  if (typeId == null || typeId < 0) return null

  return (
    <span
      className="typeBadge"
      style={typeSpriteStyle(typeId)}
      title={typeName}
      aria-label={typeName ? `${typeName} type` : undefined}
    />
  )
}

export function TypeBadges({ type1, type2, type1Name, type2Name }) {
  const types = []
  if (type1 != null && type1 >= 0) {
    types.push({ id: type1, name: type1Name })
  }
  if (type2 != null && type2 >= 0 && type2 !== type1) {
    types.push({ id: type2, name: type2Name })
  }
  if (types.length === 0) return null

  return (
    <div className="typeBadges">
      {types.map((t) => (
        <TypeBadge key={t.id} typeId={t.id} typeName={t.name} />
      ))}
    </div>
  )
}
