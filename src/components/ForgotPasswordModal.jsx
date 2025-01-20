import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  Fade,
  IconButton,
  LinearProgress,
  Modal,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import {
  resetPasswordApi,
  sendForgotPasswordEmailApi,
  verifyForgotPasswordOTPApi,
} from '../apis/Api';

// Create custom theme with better contrast and accessibility
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#2563EB',
    },
    error: {
      main: '#EF4444',
    },
    success: {
      main: '#10B981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
  },
});

// Enhanced styled components
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '440px',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius / 2,
  },
}));

const CodeInput = styled(TextField)(({ theme }) => ({
  width: '52px',
  [theme.breakpoints.down('sm')]: {
    width: '40px',
  },
  '& .MuiInputBase-input': {
    height: '52px',
    padding: 0,
    fontSize: '24px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      height: '40px',
      fontSize: '20px',
    },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    transition: 'all 0.2s ease-in-out',
    '&.Mui-focused': {
      backgroundColor: `${theme.palette.background.default}`,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    '&:hover': {
      backgroundColor: `${theme.palette.background.default}`,
    },
  },
}));

const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const inputRefs = useRef([]);
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));

  // Password strength calculator
  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.match(/[A-Z]/)) score += 25;
    if (password.match(/[0-9]/)) score += 25;
    if (password.match(/[^A-Za-z0-9]/)) score += 25;
    setStrength(score);
  }, [password]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    sendForgotPasswordEmailApi({ email })
      .then(() => {
        setLoading(false);
        setStep(2);
      })
      .catch(() => {
        setLoading(false);
        setError('Error sending email');
      });
  };

  const handleCodeChange = (value, index) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^[0-9]$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }

    setVerificationCode(newCode);
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (verificationCode.join('').length !== 6) {
      setError('Please enter complete verification code');
      return;
    }
    setError('');
    setLoading(true);
    verifyForgotPasswordOTPApi({ email, otp: verificationCode.join('') })
      .then(() => {
        setLoading(false);
        setStep(3);
      })
      .catch(() => {
        setLoading(false);
        setError('Error verifying OTP');
      });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (strength < 75) {
      setError('Please create a stronger password');
      return;
    }
    setError('');
    setLoading(true);
    resetPasswordApi({ email, password }).then(() => {
      setLoading(false);
      setStep(4);
      setTimeout(() => {
        onClose();
        // Reset form
        setStep(1);
        setEmail('');
        setVerificationCode(['', '', '', '', '', '']);
        setPassword('');
        setConfirmPassword('');
        setError('');
      }, 2000);
    }).catch(() => {
      setLoading(false);
      setError('Error resetting password');
    });
    
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledModal
        open={open}
        onClose={onClose}
        closeAfterTransition
        aria-labelledby='forgot-password-modal'>
        <Fade in={open}>
          <ModalContent>
            <Stack
              direction='row'
              alignItems='center'
              spacing={1}
              sx={{ position: 'absolute', top: 16, right: 16 }}>
              {step > 1 && step < 4 && (
                <IconButton
                  onClick={handleBack}
                  size='small'>
                  <ArrowBackIcon />
                </IconButton>
              )}
              <IconButton
                onClick={onClose}
                size='small'>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack
              spacing={3}
              sx={{ mt: 2 }}>
              <Typography
                variant='h5'
                component='h2'
                align='center'
                color='primary'>
                {step === 1 && 'Forgot Password'}
                {step === 2 && 'Verify Email'}
                {step === 3 && 'Create New Password'}
                {step === 4 && 'Success!'}
              </Typography>

              {error && (
                <Typography
                  variant='body2'
                  color='error'
                  align='center'
                  sx={{
                    backgroundColor: 'error.dark',
                    color: 'white',
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    opacity: 0.9,
                  }}>
                  {error}
                </Typography>
              )}

              {step === 1 && (
                <form
                  onSubmit={handleEmailSubmit}
                  style={{ width: '100%' }}>
                  <Stack spacing={3}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      align='center'>
                      Enter your email address and we'll send you a verification
                      code
                    </Typography>
                    <TextField
                      fullWidth
                      type='email'
                      label='Email Address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                    <Button
                      type='submit'
                      variant='contained'
                      fullWidth
                      size={isMobile ? 'large' : 'medium'}
                      disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : 'Send Code'}
                    </Button>
                  </Stack>
                </form>
              )}

              {step === 2 && (
                <form
                  onSubmit={handleOTPSubmit}
                  style={{ width: '100%' }}>
                  <Stack spacing={3}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      align='center'>
                      Enter the 6-digit code sent to
                      <br />
                      <strong>{email}</strong>
                    </Typography>
                    <Stack
                      direction='row'
                      spacing={isMobile ? 1 : 2}
                      justifyContent='center'>
                      {verificationCode.map((digit, index) => (
                        <CodeInput
                          key={index}
                          inputRef={(el) => (inputRefs.current[index] = el)}
                          value={digit}
                          onChange={(e) =>
                            handleCodeChange(e.target.value, index)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                          inputProps={{ maxLength: 1 }}
                          disabled={loading}
                        />
                      ))}
                    </Stack>
                    <Button
                      type='submit'
                      variant='contained'
                      fullWidth
                      size={isMobile ? 'large' : 'medium'}
                      disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : 'Verify Code'}
                    </Button>
                  </Stack>
                </form>
              )}

              {step === 3 && (
                <form
                  onSubmit={handlePasswordSubmit}
                  style={{ width: '100%' }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      type='password'
                      label='New Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    {password && (
                      <Box>
                        <Typography
                          variant='caption'
                          color='text.secondary'>
                          Password Strength
                        </Typography>
                        <LinearProgress
                          variant='determinate'
                          value={strength}
                          sx={{
                            mt: 0.5,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor:
                                strength <= 25
                                  ? '#EF4444'
                                  : strength <= 50
                                  ? '#F59E0B'
                                  : strength <= 75
                                  ? '#10B981'
                                  : '#059669',
                            },
                          }}
                        />
                      </Box>
                    )}
                    <TextField
                      fullWidth
                      type='password'
                      label='Confirm Password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                    <Button
                      type='submit'
                      variant='contained'
                      fullWidth
                      size={isMobile ? 'large' : 'medium'}
                      disabled={loading}>
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </Stack>
                </form>
              )}

              {step === 4 && (
                <Stack
                  spacing={2}
                  alignItems='center'>
                  <CheckCircleOutlineIcon
                    color='success'
                    sx={{ fontSize: 64, mb: 2 }}
                  />
                  <Typography
                    variant='h6'
                    align='center'>
                    Password Reset Successfully
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    align='center'>
                    You can now log in with your new password
                  </Typography>
                </Stack>
              )}

              {step < 4 && (
                <Button
                  variant='text'
                  fullWidth
                  size={isMobile ? 'large' : 'medium'}
                  onClick={onClose}
                  sx={{ mt: 2 }}>
                  Cancel
                </Button>
              )}
            </Stack>
          </ModalContent>
        </Fade>
      </StyledModal>
    </ThemeProvider>
  );
};

export default ForgotPasswordModal;
