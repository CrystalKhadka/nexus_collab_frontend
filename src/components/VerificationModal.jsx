import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  createTheme,
  IconButton,
  Modal,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useRef, useState } from 'react';

// Create custom dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#1A1A1A',
    },
    primary: {
      main: '#90CAF9',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Styled components
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.32)',
  padding: theme.spacing(4),
  maxWidth: '440px',
  width: '90%',
  position: 'relative',
}));

const CodeInput = styled(TextField)(({ theme }) => ({
  width: '52px',
  '& .MuiInputBase-input': {
    height: '52px',
    padding: 0,
    fontSize: '24px',
    textAlign: 'center',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
}));

const VerificationModal = ({ open, onClose, onVerify, email }) => {
  const [verificationCode, setVerificationCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const inputRefs = useRef([]);

  const handleCodeChange = (value, index) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
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

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledModal
        open={open}
        onClose={onClose}
        aria-labelledby='verification-modal'
        aria-describedby='verification-modal-description'>
        <ModalContent>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
            onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <Stack
            spacing={3}
            alignItems='center'>
            <Typography
              variant='h5'
              component='h2'
              fontWeight={600}
              style={{
                color: darkTheme.palette.primary.main,
              }}>
              Verify your account
            </Typography>

            <Typography
              variant='body1'
              color='text.secondary'>
              Enter verification code sent to {email}
            </Typography>

            <Stack
              direction='row'
              spacing={2}
              justifyContent='center'>
              {verificationCode.map((digit, index) => (
                <CodeInput
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  inputProps={{ maxLength: 1 }}
                />
              ))}
            </Stack>

            <Stack
              direction='row'
              spacing={2}
              sx={{ width: '100%' }}>
              <Button
                variant='outlined'
                size='large'
                fullWidth
                onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant='contained'
                size='large'
                fullWidth
                onClick={() => onVerify(verificationCode.join(''))}>
                Verify
              </Button>
            </Stack>
          </Stack>
        </ModalContent>
      </StyledModal>
    </ThemeProvider>
  );
};

export default VerificationModal;

// Usage example:
/*
import VerificationModal from './VerificationModal';

function App() {
  const [open, setOpen] = useState(false);

  const handleVerify = (code) => {
    console.log('Verification code:', code);
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Verification</Button>
      <VerificationModal
        open={open}
        onClose={() => setOpen(false)}
        onVerify={handleVerify}
        email="user@example.com"
      />
    </div>
  );
}
*/
