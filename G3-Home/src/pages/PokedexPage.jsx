import PokedexGrid from '../components/PokedexGrid'
import styles from './Page.module.css'

export default function PokedexPage({ pokedex }) {
  return (
    <section className={styles.page}>
      <PokedexGrid pokedex={pokedex} />
    </section>
  )
}
