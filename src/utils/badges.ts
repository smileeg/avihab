import type { Badge } from '../types';

export const availableBadges: Omit<Badge, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-step',
    name: 'Перший крок',
    description: 'Виконайте першу звичку',
    icon: '🌟',
  },
  {
    id: 'week-warrior',
    name: 'Тижневий воїн',
    description: 'Підтримуйте серію 7 днів',
    icon: '🔥',
  },
  {
    id: 'month-master',
    name: 'Майстер місяця',
    description: 'Підтримуйте серію 30 днів',
    icon: '👑',
  },
  {
    id: 'habit-collector',
    name: 'Колекціонер звичок',
    description: 'Створіть 5 звичок',
    icon: '📋',
  },
  {
    id: 'level-5',
    name: 'Рівень 5',
    description: 'Досягніть 5 рівня',
    icon: '⭐',
  },
  {
    id: 'level-10',
    name: 'Рівень 10',
    description: 'Досягніть 10 рівня',
    icon: '🏆',
  },
  {
    id: 'hundred-club',
    name: 'Клуб сотні',
    description: 'Виконайте 100 звичок',
    icon: '💯',
  },
  {
    id: 'consistency-king',
    name: 'Король постійності',
    description: 'Виконуйте всі звички протягом тижня',
    icon: '👑',
  },
];
