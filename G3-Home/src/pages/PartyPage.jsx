import PartyGrid from '../components/PartyGrid'
import SpriteToolbar from '../components/SpriteToolbar'
import styles from './Page.module.css'

export default function PartyPage({ party, spriteSet, onSpriteSetChange }) {
  return (
    <section className={styles.page}>
      <SpriteToolbar spriteSet={spriteSet} onSpriteSetChange={onSpriteSetChange} />
      <PartyGrid party={party} spriteSet={spriteSet} />
    </section>
  )
}