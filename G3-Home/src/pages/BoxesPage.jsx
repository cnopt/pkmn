import BoxGrid from '../components/BoxGrid'
import SpriteToolbar from '../components/SpriteToolbar'
import styles from './Page.module.css'

export default function BoxesPage({ boxes, spriteSet, onSpriteSetChange }) {
  return (
    <section className={styles.page}>
      <SpriteToolbar spriteSet={spriteSet} onSpriteSetChange={onSpriteSetChange} />
      <BoxGrid boxes={boxes} spriteSet={spriteSet} />
    </section>
  )
}
