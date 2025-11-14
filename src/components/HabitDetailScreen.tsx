import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

export const HabitDetailScreen = () => {
  const { state, navigateTo, deleteHabit, getHabitProgress, toggleHabitCompletion } = useApp();
  const habit = state.selectedHabitId
    ? state.habits.find(h => h.id === state.selectedHabitId)
    : null;

  useEffect(() => {
    if (!habit) {
      navigateTo('home');
    }
  }, [habit, navigateTo]);

  if (!habit) {
    return null;
  }

  const dayProgress = getHabitProgress(habit.id, 'day');
  const weekProgress = getHabitProgress(habit.id, 'week');
  const monthProgress = getHabitProgress(habit.id, 'month');

  const handleDelete = () => {
    if (confirm(`Видалити звичку "${habit.name}"?`)) {
      deleteHabit(habit.id);
    }
  };

  const getLast7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
  };

  const days = getLast7Days();

  return (
    <div className="screen">
      <div className="header">
        <button className="back-button" onClick={() => navigateTo('home')}>
          ← Назад
        </button>
        <h1 className="kawaii-title">Деталі звички</h1>
      </div>

      <div className="habit-detail-card" style={{ borderColor: habit.color }}>
        <div className="habit-detail-header">
          <div className="habit-icon-large" style={{ backgroundColor: habit.color }}>
            <img src={habit.icon} alt={habit.name} className="habit-icon-img" />
          </div>
          <h2 className="habit-detail-name">{habit.name}</h2>
        </div>

        <div className="progress-section">
          <h3 className="section-title">📈 Прогрес</h3>
          
          <div className="progress-item">
            <div className="progress-item-header">
              <span>Сьогодні</span>
              <span className="progress-value">{dayProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${dayProgress}%`, backgroundColor: habit.color }}></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-item-header">
              <span>Цього тижня</span>
              <span className="progress-value">{weekProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${weekProgress}%`, backgroundColor: habit.color }}></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-item-header">
              <span>Цього місяця</span>
              <span className="progress-value">{monthProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${monthProgress}%`, backgroundColor: habit.color }}></div>
            </div>
          </div>
        </div>

        <div className="calendar-section">
          <h3 className="section-title">📅 Останні 7 днів</h3>
          <div className="mini-calendar">
            {days.map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const isCompleted = habit.completions.includes(dateStr);
              const dayName = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
              
              return (
                <button
                  key={dateStr}
                  className={`calendar-day ${isCompleted ? 'completed' : ''}`}
                  style={isCompleted ? { backgroundColor: habit.color } : {}}
                  onClick={() => toggleHabitCompletion(habit.id, dateStr)}
                >
                  <div className="calendar-day-name">{dayName}</div>
                  <div className="calendar-day-number">{date.getDate()}</div>
                  {isCompleted && <div className="calendar-check">✓</div>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-emoji">🎯</div>
            <div className="stat-label">Всього</div>
            <div className="stat-number">{habit.completions.length}</div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="action-button edit"
          onClick={() => navigateTo('edit-habit', habit.id)}
        >
          ✏️ Редагувати
        </button>
        <button className="action-button delete" onClick={handleDelete}>
          🗑️ Видалити
        </button>
      </div>
    </div>
  );
};
