export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  completions: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalHabitsCompleted: number;
}

export type Screen = 'home' | 'add-habit' | 'edit-habit' | 'habit-detail' | 'stats' | 'rewards';

export interface AppState {
  habits: Habit[];
  stats: UserStats;
  badges: Badge[];
  currentScreen: Screen;
  selectedHabitId: string | null;
}
