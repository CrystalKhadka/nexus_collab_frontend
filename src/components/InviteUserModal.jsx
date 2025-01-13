import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  createTheme,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchUserApi, sendProjectInviteApi } from '../apis/Api';

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
  padding: theme.spacing(0),
  maxWidth: '600px',
  width: '90%',
  position: 'relative',
  maxHeight: '80vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.default,
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
}));

const InviteMembersModal = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Example user data - replace with your actual data
  const [users, setUsers] = useState([]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const param = useParams();

  useEffect(() => {
    searchUserApi(searchQuery)
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchQuery]);

  const inviteUser = (userId) => {
    console.log(userId);
    sendProjectInviteApi({
      id: param.id,
      userId: userId,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledModal
        open={open}
        onClose={onClose}
        aria-labelledby='invite-modal-title'>
        <ModalContent>
          {/* Modal Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Typography
              variant='h6'
              component='h2'>
              Invite Members
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: 'text.secondary' }}
              aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
            <SearchTextField
              fullWidth
              placeholder='Search members by name or email'
              variant='outlined'
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Stack spacing={2}>
              {users.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}>
                  <Box>
                    <Typography
                      variant='body1'
                      sx={{ color: 'text.primary' }}>
                      {user.firstName}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ color: 'text.secondary' }}>
                      {user.email}
                    </Typography>
                  </Box>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => inviteUser(user._id)}
                    size='medium'>
                    Invite
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </ModalContent>
      </StyledModal>
    </ThemeProvider>
  );
};

export default InviteMembersModal;

// Usage example:
/*
import InviteMembersModal from './InviteMembersModal';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Invite Modal</Button>
      <InviteMembersModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
*/
