import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  PauseCircle as PauseIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  acceptRequestApi,
  fetchRequestedMembersApi,
  getMeApi,
  getMembersRoleAndTaskApi,
  getProjectByIdApi,
  leaveProjectApi,
  rejectRequestApi,
  removeMemberApi,
} from '../../apis/Api';
import InviteMembersModal from '../../components/InviteUserModal';

const MembersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinRequests, setJoinRequests] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const { id: projectId } = useParams();
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [changes, setChanges] = useState(false);
  const [user, setUser] = useState({});
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null, // 'remove', 'leave', 'accept', 'reject'
    memberId: null,
    memberName: '',
  });

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      type: null,
      memberId: null,
      memberName: '',
    });
  };

  const handleDialogConfirm = async () => {
    const { type, memberId } = dialogState;

    try {
      switch (type) {
        case 'remove':
          await removeMemberApi(projectId, { userId: memberId });
          break;
        case 'leave':
          await leaveProjectApi(projectId);
          // go to dashboard
          window.location.href = '/dashboard';
          break;
        case 'accept':
          await acceptRequestApi(projectId, { id: memberId });
          break;
        case 'reject':
          await rejectRequestApi(projectId, { id: memberId });
          break;
        default:
          break;
      }
      setChanges(!changes);
    } catch (error) {
      console.error('Error:', error);
    }
    closeDialog();
  };

  const getDialogContent = () => {
    const { type, memberName } = dialogState;

    switch (type) {
      case 'remove':
        return {
          title: 'Remove Member',
          description: `Are you sure you want to remove ${memberName} from the project?`,
          confirmText: 'Remove',
          confirmColor: 'error',
          cancelText: 'Cancel',
        };
      case 'leave':
        return {
          title: 'Leave Project',
          description: 'Are you sure you want to leave this project?',
          confirmText: 'Leave',
          confirmColor: 'error',
          cancelText: 'Stay',
        };
      case 'accept':
        return {
          title: 'Accept Request',
          description: `Are you sure you want to accept ${memberName}'s join request?`,
          confirmText: 'Accept',
          confirmColor: 'success',
          cancelText: 'Cancel',
        };
      case 'reject':
        return {
          title: 'Reject Request',
          description: `Are you sure you want to reject ${memberName}'s join request?`,
          confirmText: 'Reject',
          confirmColor: 'error',
          cancelText: 'Cancel',
        };
      default:
        return {
          title: '',
          description: '',
          confirmText: 'Confirm',
          confirmColor: 'primary',
          cancelText: 'Cancel',
        };
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await getProjectByIdApi(projectId);
        setCurrentProject(projectResponse.data.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const fetchMembers = async () => {
      try {
        const membersResponse = await getMembersRoleAndTaskApi(projectId);
        setMembers(membersResponse.data.data);
        setFilteredMembers(membersResponse.data.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    const fetchRequest = async () => {
      try {
        const membersResponse = await fetchRequestedMembersApi(projectId);
        setJoinRequests(membersResponse.data.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await getMeApi();
        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    if (projectId) {
      fetchProjectData();
      fetchMembers();
      fetchRequest();
      fetchUser();
    }
  }, [projectId, changes]);

  const handleAccept = async (id) => {
    acceptRequestApi(projectId, {
      id: id,
    })
      .then((res) => {
        if (res.status === 200) {
          setChanges(!changes);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReject = async (id) => {
    rejectRequestApi(projectId, {
      id: id,
    })
      .then((res) => {
        if (res.status === 200) {
          setChanges(!changes);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchUser = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(searchValue) ||
        member.lastName.toLowerCase().includes(searchValue) ||
        member.email.toLowerCase().includes(searchValue) ||
        member.role.toLowerCase().includes(searchValue)
    );

    setFilteredMembers(filtered);
  };

  const isAdmin = (id) => {
    return currentProject?.admin.includes(id);
  };

  const removeMember = (id) => {
    removeMemberApi(projectId, {
      userId: id,
    })
      .then((res) => {
        if (res.status === 200) {
          setChanges(!changes);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isMe = (id) => {
    return user._id === id;
  };

  const ActionButton = ({ text, variant, onClick, tooltipText, member }) => {
    const handleClick = () => {
      if (
        variant === 'leave' ||
        variant === 'remove' ||
        variant === 'accept' ||
        variant === 'reject'
      ) {
        setDialogState({
          isOpen: true,
          type: variant,
          memberId: member._id,
          memberName: `${member.firstName} ${member.lastName}`,
        });
      } else {
        onClick?.();
      }
    };

    const getButtonProps = () => {
      switch (variant) {
        case 'leave':
          return {
            color: 'error',
            startIcon: <DeleteIcon />,
          };
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

    const button = (
      <Button
        variant='contained'
        size={isMobile ? 'small' : 'medium'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: theme.shadows[2],
          },
        }}
        {...getButtonProps()}
        onClick={handleClick}>
        {text}
      </Button>
    );

    return tooltipText ? (
      <Tooltip title={tooltipText}>{button}</Tooltip>
    ) : (
      button
    );
  };

  const MemberCard = ({ member }) => (
    <Fade
      in
      timeout={500}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
            }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 48,
                height: 48,
              }}>
              {member.firstName[0] + member.lastName[0]}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant='h6'
                gutterBottom={!isMobile}>
                {member.firstName + ' ' + member.lastName}
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'>
                {member.email}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mt: { xs: 2, sm: 0 } }}>
              <Chip
                label={`${member.tasks.length} Tasks`}
                variant='outlined'
                size={isMobile ? 'small' : 'medium'}
                sx={{ borderRadius: 1 }}
              />
              <Chip
                label={member.role}
                variant='outlined'
                color='primary'
                size={isMobile ? 'small' : 'medium'}
                sx={{ borderRadius: 1 }}
              />
              <ActionButton
                text={
                  isMe(member._id)
                    ? 'Leave'
                    : isAdmin(member._id)
                    ? 'Admin'
                    : 'Remove'
                }
                variant={
                  isMe(member._id)
                    ? 'leave'
                    : isAdmin(member._id)
                    ? ''
                    : 'remove'
                }
                tooltipText={
                  isMe(member._id)
                    ? 'Leave project'
                    : isAdmin(member._id)
                    ? "Can't remove admin"
                    : 'Remove member'
                }
                member={member}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Dialog
        open={dialogState.isOpen}
        onClose={closeDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%',
            maxWidth: 400,
          },
        }}>
        <DialogTitle id='alert-dialog-title'>
          {getDialogContent().title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {getDialogContent().description}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={closeDialog}
            variant='outlined'
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}>
            {getDialogContent().cancelText}
          </Button>
          <Button
            onClick={handleDialogConfirm}
            variant='contained'
            color={getDialogContent().confirmColor}
            autoFocus
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: theme.shadows[2],
              },
            }}>
            {getDialogContent().confirmText}
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth='lg'>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: 'background.default',
            border: `1px solid ${theme.palette.divider}`,
          }}>
          <Grid
            container
            spacing={3}
            alignItems='center'>
            <Grid
              item
              xs={12}
              sm>
              <Stack
                direction='row'
                spacing={2}
                alignItems='center'>
                <Typography
                  variant='h4'
                  component='h1'>
                  {currentProject?.name || 'Project 1'}
                </Typography>
                <Tooltip title='Edit project'>
                  <IconButton
                    color='primary'
                    size='small'>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              sm='auto'>
              <Button
                variant='contained'
                startIcon={<PersonAddIcon />}
                onClick={() => setIsInviteModalVisible(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[2],
                  },
                }}>
                Invite Members
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Search and Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}>
          <Grid
            container
            spacing={2}
            alignItems='center'>
            <Grid
              item
              xs={12}
              sm>
              <TextField
                fullWidth
                variant='outlined'
                placeholder='Search members...'
                value={searchTerm}
                onChange={searchUser}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon color='action' />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm='auto'>
              <Button
                startIcon={<FilterListIcon />}
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}>
                Filter
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Project Members Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}>
          <Typography
            variant='h5'
            gutterBottom>
            Project Members ({filteredMembers.length})
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {filteredMembers.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
              />
            ))}
            {filteredMembers.length === 0 && (
              <Typography
                variant='body1'
                color='text.secondary'
                align='center'
                sx={{ py: 4 }}>
                No members found matching your search criteria
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* Join Requests Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mb={3}>
            <Typography variant='h5'>Join Requests</Typography>
            <Button
              variant='outlined'
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}>
              Show All
            </Button>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {joinRequests.map((request) => (
              <Fade
                key={request._id}
                in
                timeout={500}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}>
                  <CardContent>
                    <Grid
                      container
                      spacing={2}
                      alignItems='center'>
                      <Grid item>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.secondary.main,
                            width: 48,
                            height: 48,
                          }}
                          src={`http://localhost:5000/profilePic/${request.image}`}></Avatar>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm>
                        <Typography
                          variant='h6'
                          gutterBottom={!isMobile}>
                          {request.firstName} {request.lastName}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'>
                          {request.email}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm='auto'>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}>
                          <ActionButton
                            text='Accept'
                            variant='accept'
                            onClick={() => {
                              handleAccept(request._id);
                            }}
                            member={request}
                            tooltipText={
                              request._id === user._id
                                ? 'You cannot accept your own request'
                                : ''
                            }
                          />
                          <ActionButton
                            text='Hold'
                            variant='hold'
                          />
                          <ActionButton
                            text='Reject'
                            variant='reject'
                            onClick={() => {
                              handleReject(request._id);
                            }}
                            member={request}
                            tooltipText={
                              request._id === user._id
                                ? 'You cannot reject your own request'
                                : ''
                            }
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Fade>
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
