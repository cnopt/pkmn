import styles from './TrainerInfo.module.css'

const GAME_ICONS = {
  // Sword/Shield
  Sword: '⚔️', Shield: '🛡️',
  // Scarlet/Violet
  Scarlet: '🔴', Violet: '🟣',
  // Sun/Moon / Ultra
  Sun: '☀️', Moon: '🌙', UltraSun: '☀️', UltraMoon: '🌙',
  // X/Y
  X: '❎', Y: '🔵',
  // Ruby/Sapphire etc
  Ruby: '💎', Sapphire: '💎', Emerald: '💚',
  OmegaRuby: '💎', AlphaSapphire: '💎',
  // Diamond/Pearl/Platinum
  Diamond: '💠', Pearl: '💠', Platinum: '⚪',
  BrilliantDiamond: '💠', ShiningPearl: '💠',
  // BW
  Black: '⚫', White: '⚪', Black2: '⚫', White2: '⚪',
  // HeartGold/SoulSilver
  HeartGold: '💛', SoulSilver: '🩶',
  // Legends
  LegendsArceus: '🏔️', LegendsZA: '🏙️',
  // Let's Go
  LetsGoPikachu: '⚡', LetsGoEevee: '🟤',
}

export default function TrainerInfo({ trainer }) {
  const icon = GAME_ICONS[trainer.game] ?? '🎮'

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.gameIcon}>{icon}</span>
        <div>
          <h2 className={styles.name}>{trainer.name || 'Unknown Trainer'}</h2>
          <span className={styles.game}>{trainer.game} &middot; Gen {trainer.generation}</span>
        </div>
      </div>
      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>Trainer ID</dt>
          <dd>{String(trainer.tid).padStart(6, '0')}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Secret ID</dt>
          <dd>{String(trainer.sid).padStart(6, '0')}</dd>
        </div>
      </dl>
    </div>
  )
}
