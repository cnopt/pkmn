import TrainerInfo from '../components/TrainerInfo'
import styles from './Page.module.css'

export default function TrainerPage({ trainer }) {
  return (
    <section className={styles.page}>
      <TrainerInfo trainer={trainer} />
    </section>
  )
}
