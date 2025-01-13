import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  PauseCircle as PauseIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectByIdApi, searchUserApi } from '../../apis/Api';
import InviteMembersModal from '../../components/InviteUserModal';

const MembersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [members, setMembers] = useState([]);
  const [joinRequests] = useState([
    { id: 1, name: 'Safal Pandey' },
    { id: 2, name: 'Pramesh Pathak' },
  ]);
  const [currentProject, setCurrentProject] = useState(null);
  const { id: projectId } = useParams();
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await getProjectByIdApi(projectId);
        setCurrentProject(projectResponse.data.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const searchUser = (e) => {
    const search = e.target.value;
    searchUserApi(search)
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isAdmin = (id) => {
    return currentProject?.admin.includes(id);
  };

  const ActionButton = ({ text, variant, onClick }) => {
    const getButtonProps = () => {
      switch (variant) {
        case 'leave':
        case 'reject':
          return {
            color: 'error',
            startIcon: <ClearIcon />,
          };
        case 'remove':
          return {
            color: 'error',
            startIcon: <DeleteIcon />,
          };
        case 'accept':
          return {
            color: 'success',
            startIcon: <CheckIcon />,
          };
        case 'hold':
          return {
            color: 'warning',
            startIcon: <PauseIcon />,
          };
        default:
          return {
            color: 'inherit',
            disabled: true,
          };
      }
    };

    return (
      <Button
        variant='contained'
        size={isMobile ? 'small' : 'medium'}
        {...getButtonProps()}
        onClick={onClick}>
        {text}
      </Button>
    );
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth='lg'>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='space-between'
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          mb={4}>
          <Stack
            direction='row'
            spacing={2}
            alignItems='center'>
            <Typography
              variant='h4'
              component='h1'>
              {currentProject?.name || 'Project 1'}
            </Typography>
            <IconButton
              color='primary'
              size='small'>
              <EditIcon />
            </IconButton>
          </Stack>

          <Button
            variant='contained'
            startIcon={<PersonAddIcon />}
            onClick={() => setIsInviteModalVisible(true)}>
            Invite Members
          </Button>
        </Stack>

        {/* Project Members Section */}
        <Paper
          elevation={2}
          sx={{ p: 3, mb: 4 }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mb={3}>
            <Typography variant='h5'>Project Members</Typography>
            <Button
              startIcon={<FilterListIcon />}
              variant='outlined'>
              Filter
            </Button>
          </Stack>

          <Stack spacing={2}>
            {currentProject?.members.map((member) => (
              <Card
                key={member._id}
                variant='outlined'>
                <CardContent>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}>
                    <Stack spacing={1}>
                      <Typography variant='h6'>
                        {member.firstName + ' ' + member.lastName}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'>
                        {member.email}
                      </Typography>
                    </Stack>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Chip
                        label={`Tasks: ${member.tasksAssigned}`}
                        variant='outlined'
                        size={isMobile ? 'small' : 'medium'}
                      />
                      <Chip
                        label={member.role}
                        variant='outlined'
                        size={isMobile ? 'small' : 'medium'}
                      />
                      <ActionButton
                        text='Remove'
                        variant={isAdmin(member._id) ? '' : 'remove'}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>

        {/* Join Requests Section */}
        <Paper
          elevation={2}
          sx={{ p: 3 }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mb={3}>
            <Typography variant='h5'>Join Requests</Typography>
            <Button variant='outlined'>Show All</Button>
          </Stack>

          <Stack spacing={2}>
            {joinRequests.map((request) => (
              <Card
                key={request.id}
                variant='outlined'>
                <CardContent>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}>
                    <Stack
                      direction='row'
                      spacing={2}
                      alignItems='center'>
                      <Avatar>{request.name[0]}</Avatar>
                      <Typography variant='h6'>{request.name}</Typography>
                    </Stack>

                    <Stack
                      direction='row'
                      spacing={1}
                      sx={{ flexWrap: 'wrap', gap: 1 }}>
                      <ActionButton
                        text='Accept'
                        variant='accept'
                      />
                      <ActionButton
                        text='Hold'
                        variant='hold'
                      />
                      <ActionButton
                        text='Reject'
                        variant='reject'
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>

        {/* Invite Members Modal */}
        <InviteMembersModal
          open={isInviteModalVisible}
          onClose={() => setIsInviteModalVisible(false)}
        />
      </Container>
    </Box>
  );
};

export default MembersPage;
