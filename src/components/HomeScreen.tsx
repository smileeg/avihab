import { useApp } from '../contexts/AppContext';

export const HomeScreen = () => {
  const { state, toggleHabitCompletion, navigateTo } = useApp();
  const today = new Date().toISOString().split('T')[0];

  const getTodayProgress = () => {
    if (state.habits.length === 0) return 0;
    const completed = state.habits.filter(h => h.completions.includes(today)).length;
    return Math.round((completed / state.habits.length) * 100);
  };

  const todayProgress = getTodayProgress();

  return (
    <div className="screen">
      <div className="header">
        <h1 className="kawaii-title">✨ Мої звички ✨</h1>
        <div className="stats-mini">
          <div className="stat-item">
            <span className="stat-emoji">⭐</span>
            <span className="stat-value">Рівень {state.stats.level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-emoji">🔥</span>
            <span className="stat-value">{state.stats.currentStreak} днів</span>
          </div>
          <div className="stat-item">
            <span className="stat-emoji">💎</span>
            <span className="stat-value">{state.stats.totalXP} XP</span>
          </div>
        </div>
      </div>

      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-label">Прогрес сьогодні</span>
          <span className="progress-percent">{todayProgress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${todayProgress}%` }}></div>
        </div>
      </div>

      {state.habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🌱</div>
          <p className="empty-text">Поки що немає звичок</p>
          <p className="empty-subtext">Додайте свою першу звичку!</p>
        </div>
      ) : (
        <div className="habits-list">
          {state.habits.map((habit) => {
            const isCompletedToday = habit.completions.includes(today);
            return (
              <div
                key={habit.id}
                className={`habit-card ${isCompletedToday ? 'completed' : ''}`}
                style={{ borderLeftColor: habit.color }}
              >
                <div className="habit-content" onClick={() => navigateTo('habit-detail', habit.id)}>
                  <div className="habit-icon" style={{ backgroundColor: habit.color }}>
                    {habit.icon}
                  </div>
                  <div className="habit-info">
                    <h3 className="habit-name">{habit.name}</h3>
                    <p className="habit-stats">
                      {habit.completions.length} разів виконано
                    </p>
                  </div>
                </div>
                <button
                  className={`check-button ${isCompletedToday ? 'checked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHabitCompletion(habit.id, today);
                  }}
                >
                  {isCompletedToday ? '✓' : ''}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button className="fab" onClick={() => navigateTo('add-habit')}>
        +
      </button>

      <nav className="bottom-nav">
        <button className="nav-button active" onClick={() => navigateTo('home')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Головна</span>
        </button>
        <button className="nav-button" onClick={() => navigateTo('stats')}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Статистика</span>
        </button>
        <button className="nav-button" onClick={() => navigateTo('rewards')}>
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Нагороди</span>
        </button>
      </nav>
    </div>
  );
};
