import { NotificationsOutlined } from '@mui/icons-material';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { readNotificationApi } from '../apis/Api';

const NotificationMenu = ({
  notifications,
  unreadCount,
  onNotificationClick,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size='large'
        color='inherit'
        onClick={handleClick}>
        <Badge
          badgeContent={unreadCount}
          color='error'>
          <NotificationsOutlined />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgb(31, 41, 55)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            minWidth: 320,
            maxHeight: 400,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        {notifications.length === 0 ? (
          <MenuItem sx={{ color: 'text.secondary' }}>
            <Typography>No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => {
                onNotificationClick(notification);
                handleClose();
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.5,
                color: 'text.secondary',
                backgroundColor: notification.isRead
                  ? 'transparent'
                  : 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: notification.isRead ? 400 : 1000 }}>
                {notification.text}
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'>
                {new Date(notification.date).toLocaleDateString()}
              </Typography>
            </MenuItem>
          ))
        )}
        <MenuItem
          sx={{
            display: 'flex',
            justifyContent: 'center',
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          onClick={() => {
            handleClose();
            // mark all notifications as read
            readNotificationApi()
              .then((res) => {
                window.location.reload();
              })
              .catch((err) => console.log(err));
          }}>
          <Typography>Mark all as read</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationMenu;
