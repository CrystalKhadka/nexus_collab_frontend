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
import { getProjectMemberApis } from '../../apis/Api';

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

const AssignUserModal = ({ open, onClose, onAssign }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const params = useParams();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (open) {
      getProjectMemberApis(params.id)
        .then((res) => {
          setMembers(res.data.data);
        })
        .catch((err) => {
          console.error('Error fetching project members:', err);
        });
    }
  }, [open, params.id]);

  const handleAssign = (userId) => {
    onAssign(userId);
    onClose();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledModal
        open={open}
        onClose={onClose}
        aria-labelledby='assign-modal-title'>
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
              Assign User
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
              placeholder='Search project members'
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
              {members
                .filter(
                  (member) =>
                    member.firstName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    member.email
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((member) => (
                  <Box
                    key={member._id}
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
                        {member.firstName}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'text.secondary' }}>
                        {member.email}
                      </Typography>
                    </Box>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleAssign(member._id)}
                      size='medium'>
                      Assign
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

export default AssignUserModal;

// Usage example:
/*
import AssignUserModal from './AssignUserModal';

function App() {
  const [open, setOpen] = useState(false);

  const handleAssign = (userId) => {
    // Handle the assignment here
    console.log('Assigning user:', userId);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Assign User</Button>
      <AssignUserModal
        open={open}
        onClose={() => setOpen(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}
*/
