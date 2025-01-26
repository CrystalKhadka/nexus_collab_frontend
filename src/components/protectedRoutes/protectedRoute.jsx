import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { getMeApi, getProjectByIdApi } from '../../apis/Api';
import { useSocket } from '../../components/socketContext/SocketContext';
import initSocket from '../../utils/initSocket';
import Navbar from '../Navbar';
import { Sidebar } from '../Sidebar';

const SIDEBAR_WIDTH = 240;
const NAVBAR_HEIGHT = 64;

// Layout components remain unchanged as they don't contain bugs
const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          pt: `${NAVBAR_HEIGHT}px`,
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}>
        {children}
      </Box>
    </Box>
  );
};

const ProjectLayout = ({ children }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getProjectByIdApi(id)
      .then((response) => {})
      .catch((error) => {
        console.error(error);
        if (error.response.status === 403) {
          window.location.href = '/dashboard';
        }
        if (error.response.status === 404) {
          window.location.href = '/dashboard';
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return null;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1, pt: `${NAVBAR_HEIGHT}px` }}>
        <Sidebar />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            backgroundColor: 'background.default',
            width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
            scrollBehavior: 'smooth',
          }}
          className='overflow-y-auto'>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

// Fixed authentication helper function
const checkAuthentication = async () => {
  try {
    const response = await getMeApi();
    return {
      isAuthenticated: response.status === 200,
      user: response.data.user,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const params = useParams();
  const { socket, setSocket } = useSocket();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { isAuthenticated: isAuth, user } = await checkAuthentication();

        if (!isMounted) return;

        setAuthenticated(isAuth);
        setIsLoading(false);

        // Initialize socket only if authenticated and socket doesn't exist
        if (isAuth && user && !socket) {
          const socketInstance = initSocket(user);

          socketInstance.on('connect', () => {
            console.log('WebSocket connected:', socketInstance.id);
          });

          socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
          });

          setSocket(socketInstance);

          // Cleanup socket on component unmount
          return () => {
            socketInstance.disconnect();
            setSocket(null);
          };
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Remove socket and setSocket from dependencies to prevent re-renders

  if (isLoading) {
    return null; // Consider adding a loading spinner here
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to='/login'
        state={{ from: location }}
        replace
      />
    );
  }

  return params.id ? (
    <ProjectLayout>{children}</ProjectLayout>
  ) : (
    <MainLayout>{children}</MainLayout>
  );
};

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { isAuthenticated: isAuth } = await checkAuthentication();

        if (isMounted) {
          setAuthenticated(isAuth);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }

  if (
    isAuthenticated &&
    ['/login', '/register', '/'].includes(location.pathname)
  ) {
    return (
      <Navigate
        to='/dashboard'
        replace
      />
    );
  }

  return children;
};

export { ProtectedRoute, PublicRoute };
