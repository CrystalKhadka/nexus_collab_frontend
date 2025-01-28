import {
  Help,
  KeyboardArrowDown,
  LogoutOutlined,
  MailOutline,
  PersonOutline,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMeApi,
  getNotificationsApi,
  getUnreadNotificationsApi,
} from '../apis/Api';
import NotificationMenu from './NotificationMenu';
import { useSocket } from './socketContext/SocketContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { socket } = useSocket();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    setLogoutModalOpen(false);
    window.location.href = '/';
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <PersonOutline sx={{ color: 'text.secondary' }} />,
      label: 'Profile',
      onClick: () => {
        navigate('/profile');
        handleClose();
      },
    },
    {
      key: 'invitations',
      icon: <MailOutline sx={{ color: 'text.secondary' }} />,
      label: 'Invitations',
      onClick: () => {
        navigate('/invitations');
        handleClose();
      },
    },
    {
      key: 'Help',
      icon: <Help sx={{ color: 'text.secondary' }} />,
      label: 'Help',
      onClick: () => {
        navigate('/help');
        handleClose();
      },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined sx={{ color: 'text.secondary' }} />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const handleNotificatonClicked = () => {};

  useEffect(() => {
    getMeApi()
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.user);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    getNotificationsApi()
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setNotifications(res.data.notifications);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    getUnreadNotificationsApi()
      .then((res) => {
        if (res.status === 200) {
          setUnreadCount(res.data.count);
          setUnreadNotifications(res.data.notifications);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <AppBar
        className='sticky top-0 z-50 h-16'
        position='fixed'
        sx={{
          bgcolor: 'rgba(17, 24, 39, 1)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src='/images/logo1.png'
              alt='Logo'
              style={{
                height: '32px',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => navigate('/dashboard')}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <NotificationMenu
              notifications={notifications}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificatonClicked}
            />

            <Box
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                bgcolor: 'rgba(31, 41, 55, 0.5)',
                '&:hover': { bgcolor: 'rgba(31, 41, 55, 0.8)' },
                borderRadius: 3,
                padding: '8px 16px',
                transition: 'all 0.2s ease-in-out',
              }}>
              <Avatar
                src={`http://localhost:5000/profilePic/${user?.image}`}
                sx={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  width: 40,
                  height: 40,
                }}
              />
              <Typography
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: 'white',
                  fontWeight: 500,
                }}>
                {user && user.firstName + ' ' + user.lastName}
              </Typography>
              <KeyboardArrowDown
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  bgcolor: 'rgb(31, 41, 55)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  minWidth: 200,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  <MenuItem
                    onClick={item.onClick}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        '& .MuiSvgIcon-root, & .MuiTypography-root': {
                          color: 'white',
                        },
                      },
                    }}>
                    {item.icon}
                    <Typography>{item.label}</Typography>
                  </MenuItem>
                  {index === menuItems.length - 2 && (
                    <Divider
                      sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={logoutModalOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            bgcolor: 'rgb(31, 41, 55)',
            color: 'white',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={handleLogoutCancel}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant='contained'
            sx={{
              bgcolor: 'error.main',
              '&:hover': { bgcolor: 'error.dark' },
            }}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
