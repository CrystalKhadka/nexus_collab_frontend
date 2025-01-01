import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import ChatPage from './pages/ChatPage/ChatPage';
import DashboardPage from './pages/Homepage/DashboardPage';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import MembersPage from './pages/MembersPage/MembersPage';
import ProjectBoard from './pages/ProjectBoard/ProjectBoard';
import RegisterPage from './pages/Register/RegisterPage';
import SettingsPage from './pages/Settings/SettingsPage';
import TimelinePage from './pages/TimeLinePage/TimeLinePage';
import './styles/fonts.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<LandingPage />}
        />
        <Route
          path='/register'
          element={<RegisterPage />}
        />
        <Route
          path='/login'
          element={<LoginPage />}
        />
        <Route
          path='/dashboard'
          element={<DashboardPage />}
        />
        <Route
          path='/board'
          element={<ProjectBoard />}
        />
        <Route
          path='/chat'
          element={<ChatPage />}
        />
        <Route
          path='/members'
          element={<MembersPage />}
        />
        <Route
          path='/settings'
          element={<SettingsPage />}
        />
        <Route
          path='/calendar'
          element={<CalendarPage />}
        />
        <Route
          path='/timeline'
          element={<TimelinePage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
