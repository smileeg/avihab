import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Habit, Badge, UserStats, Screen } from '../types';
import { availableBadges } from '../utils/badges';

interface AppContextType {
  state: AppState;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  updateHabit: (id: string, habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  navigateTo: (screen: Screen, habitId?: string) => void;
  getHabitProgress: (habitId: string, period: 'day' | 'week' | 'month') => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'habit-tracker-habits';

const XP_PER_COMPLETION = 10;
const XP_PER_LEVEL = 100;

const calculateStats = (habits: Habit[]): UserStats => {
  const allCompletions = habits.flatMap(h => h.completions);
  const totalHabitsCompleted = allCompletions.length;
  const totalXP = totalHabitsCompleted * XP_PER_COMPLETION;
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;

  const uniqueDates = [...new Set(allCompletions)].sort();
  
  if (uniqueDates.length === 0) {
    return { totalXP, level, currentStreak: 0, longestStreak: 0, totalHabitsCompleted };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentStreak = 0;
  let tempStreak = 1;
  let longestStreak = 1;
  
  const mostRecentDate = new Date(uniqueDates[uniqueDates.length - 1]);
  mostRecentDate.setHours(0, 0, 0, 0);
  const daysSinceRecent = Math.round((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceRecent <= 1) {
    currentStreak = 1;
    
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const currentDate = new Date(uniqueDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(uniqueDates[i + 1]);
      nextDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.round((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    prevDate.setHours(0, 0, 0, 0);
    const currentDate = new Date(uniqueDates[i]);
    currentDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    totalXP,
    level,
    currentStreak,
    longestStreak,
    totalHabitsCompleted,
  };
};

const checkBadges = (habits: Habit[], stats: UserStats): Badge[] => {
  return availableBadges.map(badge => {
    let shouldUnlock = false;

    switch (badge.id) {
      case 'first-step':
        shouldUnlock = stats.totalHabitsCompleted >= 1;
        break;
      case 'week-warrior':
        shouldUnlock = stats.currentStreak >= 7;
        break;
      case 'month-master':
        shouldUnlock = stats.currentStreak >= 30;
        break;
      case 'habit-collector':
        shouldUnlock = habits.length >= 5;
        break;
      case 'level-5':
        shouldUnlock = stats.level >= 5;
        break;
      case 'level-10':
        shouldUnlock = stats.level >= 10;
        break;
      case 'hundred-club':
        shouldUnlock = stats.totalHabitsCompleted >= 100;
        break;
      case 'consistency-king':
        const lastWeek = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        });
        shouldUnlock = habits.length > 0 && lastWeek.every(date =>
          habits.every(habit => habit.completions.includes(date))
        );
        break;
    }

    return {
      ...badge,
      unlocked: shouldUnlock,
      unlockedAt: shouldUnlock ? new Date().toISOString() : undefined,
    };
  });
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const stats = useMemo(() => calculateStats(habits), [habits]);
  const badges = useMemo(() => checkBadges(habits, stats), [habits, stats]);

  const state: AppState = {
    habits,
    stats,
    badges,
    currentScreen,
    selectedHabitId,
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits(prev => [...prev, newHabit]);
    setCurrentScreen('home');
  };

  const updateHabit = (id: string, habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, ...habit } : h))
    );
    setCurrentScreen('home');
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setCurrentScreen('home');
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const completions = h.completions.includes(date)
            ? h.completions.filter(d => d !== date)
            : [...h.completions, date];
          return { ...h, completions };
        }
        return h;
      })
    );
  };

  const navigateTo = (screen: Screen, habitId?: string) => {
    setCurrentScreen(screen);
    setSelectedHabitId(habitId || null);
  };

  const getHabitProgress = (habitId: string, period: 'day' | 'week' | 'month'): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let daysToCheck = 1;
    if (period === 'week') daysToCheck = 7;
    if (period === 'month') daysToCheck = 30;

    const dates = Array.from({ length: daysToCheck }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });

    const completed = dates.filter(date => habit.completions.includes(date)).length;
    return Math.round((completed / daysToCheck) * 100);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        navigateTo,
        getHabitProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
