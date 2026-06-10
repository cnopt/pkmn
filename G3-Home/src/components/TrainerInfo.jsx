import './TrainerInfo.css'

const GAME_ICONS = {
  Sword: '⚔️', Shield: '🛡️',
  Scarlet: '🔴', Violet: '🟣',
  Sun: '☀️', Moon: '🌙', UltraSun: '☀️', UltraMoon: '🌙',
  X: '❎', Y: '🔵',
  Ruby: '💎', Sapphire: '💎', Emerald: '💚',
  OmegaRuby: '💎', AlphaSapphire: '💎',
  Diamond: '💠', Pearl: '💠', Platinum: '⚪',
  BrilliantDiamond: '💠', ShiningPearl: '💠',
  Black: '⚫', White: '⚪', Black2: '⚫', White2: '⚪',
  HeartGold: '💛', SoulSilver: '🩶',
  LegendsArceus: '🏔️', LegendsZA: '🏙️',
  LetsGoPikachu: '⚡', LetsGoEevee: '🟤',
}

export default function TrainerInfo({ trainer }) {
  const icon = GAME_ICONS[trainer.game] ?? '🎮'

  return (
    <div className="trainer-info">
      <div className="header">
        <span className="gameIcon">{icon}</span>
        <div>
          <h2 className="name">{trainer.name || 'Unknown Trainer'}</h2>
          <span className="game">{trainer.game} &middot; Gen {trainer.generation}</span>
        </div>
      </div>
      <dl className="stats">
        <div className="stat">
          <dt>Trainer ID</dt>
          <dd>{String(trainer.tid).padStart(6, '0')}</dd>
        </div>
        <div className="stat">
          <dt>Secret ID</dt>
          <dd>{String(trainer.sid).padStart(6, '0')}</dd>
        </div>
      </dl>
    </div>
  )
}
