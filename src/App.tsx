import './App.css';
import { useApp } from './contexts/AppContext';
import { HomeScreen } from './components/HomeScreen';
import { AddEditHabitScreen } from './components/AddEditHabitScreen';
import { HabitDetailScreen } from './components/HabitDetailScreen';
import { StatsScreen } from './components/StatsScreen';
import { RewardsScreen } from './components/RewardsScreen';

function App() {
  const { state } = useApp();

  return (
    <>
      {state.currentScreen === 'home' && <HomeScreen />}
      {state.currentScreen === 'add-habit' && <AddEditHabitScreen />}
      {state.currentScreen === 'edit-habit' && <AddEditHabitScreen />}
      {state.currentScreen === 'habit-detail' && <HabitDetailScreen />}
      {state.currentScreen === 'stats' && <StatsScreen />}
      {state.currentScreen === 'rewards' && <RewardsScreen />}
    </>
  );
}

export default App;
