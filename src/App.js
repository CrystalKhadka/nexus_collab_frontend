import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './styles/fonts.css';

// Import pages
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getMeApi } from './apis/Api';
import {
  ProtectedRoute,
  PublicRoute,
} from './components/protectedRoutes/protectedRoute';
import { SocketProvider } from './components/socketContext/SocketContext';
import AcceptInvitePage from './pages/AcceptInvite/AcceptInvite';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import ChatPage from './pages/ChatPage/ChatPage';
import HelpAndDocumentation from './pages/HelpAndDocumentation/HelpAndDocumentation';
import DashboardPage from './pages/Homepage/DashboardPage';
import InvitationPage from './pages/Invitation/InvitationPage';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import MembersPage from './pages/MembersPage/MembersPage';
import PreCallSetupPage from './pages/PreCall/PreCallPage';
import ProfilePage from './pages/Profile/Profile';
import ProjectBoard from './pages/ProjectBoard/ProjectBoard';
import RegisterPage from './pages/Register/RegisterPage';
import SettingsPage from './pages/Settings/SettingsPage';
import TimelinePage from './pages/TimeLinePage/TimeLinePage';
import VideoCall from './pages/VideoCall/VideoCall';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(17, 24, 39)', // bg-gray-900
      paper: 'rgba(31, 41, 55, 0.5)', // bg-gray-800/50
    },
    primary: {
      main: '#F68716',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
          backgroundImage: 'none',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  getMeApi
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      return false;
    });
};

// Main Layout Component

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SocketProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route
                path='/'
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/help'
                element={
                  <PublicRoute>
                    <HelpAndDocumentation />
                  </PublicRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/login'
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              {/* Protected Routes */}
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/board/:id'
                element={
                  <ProtectedRoute>
                    <ProjectBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/chat/:id'
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/members/:id'
                element={
                  <ProtectedRoute>
                    <MembersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/settings/:id'
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/calendar/:id'
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/timeline/:id'
                element={
                  <ProtectedRoute>
                    <TimelinePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/invitations'
                element={
                  <ProtectedRoute>
                    <InvitationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='accept-invite/:token'
                element={
                  <ProtectedRoute>
                    <AcceptInvitePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/call/:channelId'
                element={<VideoCall />}
              />
              <Route
                path='/preCall/:channelId'
                element={<PreCallSetupPage />}
              />

              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              {/* Catch all route - Redirect to dashboard if authenticated, otherwise to landing */}
              {/* <Route
                path='*'
                element={
                  isAuthenticated ? (
                    <Navigate
                      to='/dashboard'
                      replace
                    />
                  ) : (
                    <Navigate
                      to='/'
                      replace
                    />
                  )
                }
              /> */}
            </Routes>
          </Router>
        </ThemeProvider>
      </SocketProvider>
    </LocalizationProvider>
  );
}

export default App;
