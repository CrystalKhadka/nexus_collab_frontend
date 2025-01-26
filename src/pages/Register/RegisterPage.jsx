import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  registerUserApi,
  sendVerificationEmailApi,
  verifyOtpApi,
} from '../../apis/Api';
import VerificationModal from '../../components/VerificationModal';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4, 2),
}));

const RegisterBox = styled(Box)(({ theme }) => ({
  maxWidth: '28rem',
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backgroundColor: theme.palette.background.paper,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    '&:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 100px rgba(31, 41, 55, 0.5) inset',
      '-webkit-text-fill-color': '#ffffff',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputAdornment-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #18212f inset !important',
    WebkitTextFillColor: '#ffffff !important',
    caretColor: '#18212f',
    borderRadius: 'inherit',
    border: '1px solid #18212f',
  },
}));

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const onSubmit = (values) => {
    setLoading(true);

    const data = {
      full_name: values.fullName,
      email: values.email,
      password: values.password,
    };

    console.log(data);

    registerUserApi(data)
      .then((response) => {
        if (response.status === 200) {
          sendVerificationEmailApi({ email: values.email })
            .then(() => {
              setShowVerification(true);
            })
            .catch((error) => {
              if (error.response) {
                showMessage(error.response.data.message, 'error');
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        if (error.response) {
          showMessage(error.response.data.message, 'error');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVerify = async (otp) => {
    try {
      const response = await verifyOtpApi({
        email: watch('email'),
        otp: parseInt(otp),
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Verification failed:', error);
      showMessage('Verification failed', 'error');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          zIndex: 9999,
          '& .MuiAlert-root': {
            width: '100%',
            minWidth: '300px',
          },
        }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant='filled'
          elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <StyledAppBar position='sticky'>
        <Toolbar>
          <Container
            maxWidth='lg'
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <img
              src='/images/logo1.png'
              alt='Nexus'
              style={{ height: 32 }}
            />
            <Box>
              <Button
                component={Link}
                to='/login'
                variant='outlined'
                sx={{ mr: 2 }}>
                Login
              </Button>
              <Button
                component={Link}
                to='/register'
                variant='contained'>
                Register
              </Button>
            </Box>
          </Container>
        </Toolbar>
      </StyledAppBar>
      <ContentBox>
        <Container maxWidth='lg'>
          <Grid
            container
            spacing={4}
            alignItems='center'>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
                <img
                  src='/images/nexus_logo.png'
                  alt='Nexus Logo'
                  style={{ width: '100%' }}
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}>
              <RegisterBox>
                <Typography
                  variant='h4'
                  color='white'
                  gutterBottom>
                  Create an Account
                </Typography>
                <Typography
                  variant='body1'
                  color='text.secondary'
                  gutterBottom>
                  Enter your details to register.
                </Typography>

                <Box
                  component='form'
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ mt: 4 }}>
                  <StyledTextField
                    fullWidth
                    {...register('fullName', { required: true })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <User />
                        </InputAdornment>
                      ),
                    }}
                    placeholder='Full Name'
                    error={!!errors.fullName}
                  />

                  <StyledTextField
                    fullWidth
                    {...register('email', {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Mail />
                        </InputAdornment>
                      ),
                    }}
                    placeholder='Email Address'
                    error={!!errors.email}
                  />

                  <StyledTextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: true,
                      minLength: 8,
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    placeholder='Password'
                    error={!!errors.password}
                  />

                  <StyledTextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: true,
                      validate: (value) => value === watch('password'),
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }>
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    placeholder='Confirm Password'
                    error={!!errors.confirmPassword}
                  />

                  <Button
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={loading}
                    sx={{ height: 48, mb: 3, fontSize: '1rem' }}>
                    {loading ? <CircularProgress size={24} /> : 'Register'}
                  </Button>

                  <Typography
                    align='center'
                    color='text.secondary'>
                    Already have an account?{' '}
                    <Link
                      to='/login'
                      style={{ color: '#3f51b5', textDecoration: 'none' }}>
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </RegisterBox>
            </Grid>
          </Grid>
        </Container>
      </ContentBox>
      <VerificationModal
        open={showVerification}
        onClose={() => setShowVerification(false)}
        onVerify={handleVerify}
        email={watch('email')}
      />
    </Box>
  );
};

export default RegisterPage;
