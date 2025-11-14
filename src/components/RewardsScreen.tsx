import { useApp } from '../contexts/AppContext';

export const RewardsScreen = () => {
  const { state, navigateTo } = useApp();

  const unlockedBadges = state.badges.filter(b => b.unlocked);
  const lockedBadges = state.badges.filter(b => !b.unlocked);

  return (
    <div className="screen">
      <div className="header">
        <h1 className="kawaii-title">🏆 Нагороди</h1>
      </div>

      <div className="rewards-summary">
        <div className="reward-stat">
          <span className="reward-emoji">🎖️</span>
          <div>
            <div className="reward-number">{unlockedBadges.length}/{state.badges.length}</div>
            <div className="reward-label">Отримано бейджів</div>
          </div>
        </div>
      </div>

      {unlockedBadges.length > 0 && (
        <div className="badges-section">
          <h3 className="section-title">✨ Отримані бейджі</h3>
          <div className="badges-grid">
            {unlockedBadges.map((badge) => (
              <div key={badge.id} className="badge-card unlocked">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
                {badge.unlockedAt && (
                  <div className="badge-date">
                    {new Date(badge.unlockedAt).toLocaleDateString('uk-UA')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div className="badges-section">
          <h3 className="section-title">🔒 Заблоковані бейджі</h3>
          <div className="badges-grid">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="badge-card locked">
                <div className="badge-icon grayscale">{badge.icon}</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-button" onClick={() => navigateTo('home')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Головна</span>
        </button>
        <button className="nav-button" onClick={() => navigateTo('stats')}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Статистика</span>
        </button>
        <button className="nav-button active" onClick={() => navigateTo('rewards')}>
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Нагороди</span>
        </button>
      </nav>
    </div>
  );
};
