import { useApp } from '../contexts/AppContext';

export const StatsScreen = () => {
  const { state, navigateTo } = useApp();

  const getWeeklyData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
      
      const completed = state.habits.filter(h => h.completions.includes(dateStr)).length;
      
      data.push({
        day: dayName,
        completed,
        total: state.habits.length,
      });
    }
    return data;
  };

  const weeklyData = getWeeklyData();
  const maxCompleted = Math.max(...weeklyData.map(d => d.completed), 1);

  return (
    <div className="screen">
      <div className="header">
        <h1 className="kawaii-title">📊 Статистика</h1>
      </div>

      <div className="stats-overview">
        <div className="stat-card-large">
          <div className="stat-emoji-large">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Рівень</div>
            <div className="stat-number-large">{state.stats.level}</div>
            <div className="xp-progress">
              <div className="xp-bar">
                <div
                  className="xp-fill"
                  style={{
                    width: `${(state.stats.totalXP % 100)}%`,
                  }}
                ></div>
              </div>
              <div className="xp-text">
                {state.stats.totalXP % 100}/100 XP
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-emoji">🔥</div>
            <div className="stat-label">Поточна серія</div>
            <div className="stat-number">{state.stats.currentStreak}</div>
            <div className="stat-unit">днів</div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji">🏆</div>
            <div className="stat-label">Найдовша серія</div>
            <div className="stat-number">{state.stats.longestStreak}</div>
            <div className="stat-unit">днів</div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji">💎</div>
            <div className="stat-label">Всього XP</div>
            <div className="stat-number">{state.stats.totalXP}</div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji">✅</div>
            <div className="stat-label">Виконано</div>
            <div className="stat-number">{state.stats.totalHabitsCompleted}</div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3 className="section-title">📈 Прогрес за тиждень</h3>
        <div className="bar-chart">
          {weeklyData.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-container">
                <div
                  className="bar"
                  style={{
                    height: `${(item.completed / maxCompleted) * 100}%`,
                  }}
                >
                  <span className="bar-value">{item.completed}</span>
                </div>
              </div>
              <div className="bar-label">{item.day}</div>
            </div>
          ))}
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button" onClick={() => navigateTo('home')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Головна</span>
        </button>
        <button className="nav-button active" onClick={() => navigateTo('stats')}>
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
