import { Lock, Mail, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  loginUserApi,
  sendVerificationEmailApi,
  verifyOtpApi,
} from '../../apis/Api';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
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

const LoginBox = styled(Box)(({ theme }) => ({
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
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
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

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { register, handleSubmit, watch } = useForm();

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const data = {
        email: values.email,
        password: values.password,
      };

      const response = await loginUserApi(data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      if (error.response?.status === 400 && !error.response.data.isVerified) {
        try {
          await sendVerificationEmailApi({ email: values.email });
          setShowVerification(true);
        } catch (verifyError) {
          console.error('Verification email error:', verifyError);
        }
      }
    } finally {
      setLoading(false);
    }
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
    }
  };

  return (
    <Box>
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
              <LoginBox>
                <Typography
                  variant='h4'
                  color='white'
                  gutterBottom>
                  Welcome Back
                </Typography>
                <Typography
                  variant='body1'
                  color='text.secondary'
                  gutterBottom>
                  Enter your credentials to access your account.
                </Typography>

                <Box
                  component='form'
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ mt: 4 }}>
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
                  />

                  <StyledTextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: true })}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    placeholder='Password'
                  />

                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      onClick={() => setShowForgotPassword(true)}
                      sx={{ textTransform: 'none' }}>
                      Forgot Password?
                    </Button>
                  </Box>

                  <Button
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={loading}
                    sx={{ height: 48, mb: 3, fontSize: '1rem' }}>
                    {loading ? <CircularProgress size={24} /> : 'Sign in'}
                  </Button>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}>
                    <Divider
                      sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Typography color='text.secondary'>or</Typography>
                    <Divider
                      sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant='outlined'
                    color='inherit'
                    sx={{
                      height: 48,
                      mb: 3,
                      fontSize: '1rem',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                    startIcon={
                      <img
                        src='https://cdn.cdnlogo.com/logos/g/35/google-icon.svg'
                        alt='Google'
                        style={{ width: 20, height: 20 }}
                      />
                    }>
                    Continue with Google
                  </Button>

                  <Typography
                    align='center'
                    color='text.secondary'>
                    Don't have an account?{' '}
                    <Link
                      to='/register'
                      style={{ color: '#3f51b5', textDecoration: 'none' }}>
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </LoginBox>
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

      <ForgotPasswordModal
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </Box>
  );
};

export default LoginPage;
