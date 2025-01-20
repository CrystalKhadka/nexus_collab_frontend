import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Camera, Mail, MapPin, Phone, User } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { getMeApi, updateUserApi, uploadProfilePicApi } from '../../apis/Api';

// Memoized InputField component to prevent unnecessary re-renders
const InputField = memo(
  ({
    icon: Icon,
    label,
    value,
    onChange,
    type = 'text',
    disabled = false,
    isMobile,
    theme,
  }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'text.secondary',
        }}>
        <Icon size={18} />
        <Typography
          variant='body2'
          fontWeight='medium'>
          {label}
        </Typography>
      </Box>
      <TextField
        fullWidth
        type={type}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        variant='outlined'
        size={isMobile ? 'small' : 'medium'}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
            borderRadius: '12px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-focused': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
    </Box>
  )
);

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef(null);
  const [change, setChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    profilePic: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await getMeApi();
        if (!isMounted) return;

        const userData = res.data.user;
        setProfileData({
          fullName: userData.middleName
            ? `${userData.firstName} ${userData.middleName} ${userData.lastName}`
            : `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          address: userData.address,
          phone: userData.phone,
          profilePic: userData.image,
        });
      } catch (err) {
        console.log(err);
        if (isMounted) {
          handleSnackbar('Failed to load profile', 'error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [change]);

  const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfilePicChange = async () => {
    const input = fileInputRef.current;
    if (!input) return;

    input.click();
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      const formData = new FormData();
      formData.append('profilePic', file);

      try {
        const res = await uploadProfilePicApi(formData);
        setProfileData((prev) => ({
          ...prev,
          profilePic: res.data.profilePic,
        }));
        handleSnackbar('Profile picture updated successfully');
      } catch (err) {
        console.log(err);
        handleSnackbar('Failed to update profile picture', 'error');
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUserApi(profileData);
      setChanges((prev) => !prev);
      handleSnackbar('Profile updated successfully');
    } catch (error) {
      console.log(error);
      handleSnackbar('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profileData.fullName) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth='lg'>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth='lg'>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { md: '1fr 2fr' },
          }}>
          {/* Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': { boxShadow: 3 },
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 128,
                    height: 128,
                    border: '4px solid white',
                    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}>
                  <img
                    src={`http://localhost:5000/profilePic/${profileData?.profilePic}`}
                    alt='Profile'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Avatar>
                <IconButton
                  onClick={handleProfilePicChange}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'grey.100' },
                    transition: 'all 0.2s ease-in-out',
                  }}
                  size='small'>
                  <Camera size={16} />
                </IconButton>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  style={{ display: 'none' }}
                />
              </Box>
              <Typography
                variant='h5'
                sx={{ mt: 2, fontWeight: 600 }}>
                {profileData.fullName}
              </Typography>
            </Box>
          </Paper>

          {/* Form */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': { boxShadow: 3 },
            }}>
            <Typography
              variant='h6'
              sx={{ mb: 3, fontWeight: 600 }}>
              Profile Information
            </Typography>

            <Box
              component='form'
              onSubmit={handleUpdate}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: { sm: '1fr 1fr' },
                }}>
                <InputField
                  icon={User}
                  label='Full Name'
                  value={profileData.fullName}
                  onChange={handleChange('fullName')}
                  isMobile={isMobile}
                  theme={theme}
                />
                <InputField
                  icon={Mail}
                  label='Email Address'
                  value={profileData.email}
                  onChange={handleChange('email')}
                  type='email'
                  disabled
                  isMobile={isMobile}
                  theme={theme}
                />
              </Box>

              <InputField
                icon={MapPin}
                label='Address'
                value={profileData.address}
                onChange={handleChange('address')}
                isMobile={isMobile}
                theme={theme}
              />

              <InputField
                icon={Phone}
                label='Phone Number'
                value={profileData.phone}
                onChange={handleChange('phone')}
                type='tel'
                isMobile={isMobile}
                theme={theme}
              />

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  mt: 2,
                }}>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete your account? This action cannot be undone.'
                      )
                    ) {
                      handleSnackbar('Account deletion requested', 'warning');
                    }
                  }}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                  }}>
                  Delete Account
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isLoading}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    bgcolor: 'rgb(37, 99, 235)',
                    '&:hover': { bgcolor: 'rgb(29, 78, 216)' },
                  }}>
                  {isLoading ? (
                    <CircularProgress
                      size={24}
                      color='inherit'
                    />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
