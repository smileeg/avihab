import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { habitIcons, pastelColors } from '../utils/habitIcons';

export const AddEditHabitScreen = () => {
  const { state, addHabit, updateHabit, navigateTo } = useApp();
  const isEdit = state.currentScreen === 'edit-habit';
  const habit = state.selectedHabitId
    ? state.habits.find(h => h.id === state.selectedHabitId)
    : null;

  const [name, setName] = useState(habit?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon || habitIcons[0].emoji);
  const [selectedColor, setSelectedColor] = useState(habit?.color || pastelColors[0]);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setSelectedIcon(habit.icon);
      setSelectedColor(habit.color);
    }
  }, [habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const habitData = {
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
    };

    if (isEdit && state.selectedHabitId) {
      updateHabit(state.selectedHabitId, habitData);
    } else {
      addHabit(habitData);
    }
  };

  return (
    <div className="screen">
      <div className="header">
        <button className="back-button" onClick={() => navigateTo('home')}>
          ← Назад
        </button>
        <h1 className="kawaii-title">
          {isEdit ? '✏️ Редагувати звичку' : '✨ Нова звичка'}
        </h1>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Назва звички</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наприклад: Ранкова молитва"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Оберіть іконку</label>
          <div className="icon-grid">
            {habitIcons.map((icon) => (
              <button
                key={icon.emoji}
                type="button"
                className={`icon-option ${selectedIcon === icon.emoji ? 'selected' : ''}`}
                onClick={() => setSelectedIcon(icon.emoji)}
                title={icon.name}
              >
                {icon.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Оберіть колір</label>
          <div className="color-grid">
            {pastelColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={!name.trim()}>
          {isEdit ? '💾 Зберегти' : '✨ Створити звичку'}
        </button>
      </form>
    </div>
  );
};
