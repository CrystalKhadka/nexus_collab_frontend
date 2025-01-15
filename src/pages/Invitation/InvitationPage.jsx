import {
  CheckCircleOutline,
  Close,
  Lock,
  LockOpen,
  Schedule,
  Search,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  InputAdornment,
  Pagination,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  acceptProjectInviteApi,
  getInvitedProjectsApi,
  rejectProjectInviteApi,
  searchProjectsApi,
} from '../../apis/Api';

const InvitationPage = () => {
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [invitationSearchTerm, setInvitationSearchTerm] = useState('');
  const [invitationPage, setInvitationPage] = useState(1);
  const invitationsPerPage = 5;

  const [projects, setProjects] = useState([]);
  const [projectPage, setProjectPage] = useState(1);
  const projectsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    getInvitations();
    searchProjects(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const filtered = invitations.filter((invitation) =>
      invitation.name.toLowerCase().includes(invitationSearchTerm.toLowerCase())
    );
    setFilteredInvitations(filtered);
    setInvitationPage(1); // Reset to first page when search changes
  }, [invitationSearchTerm, invitations]);

  const getInvitations = () => {
    getInvitedProjectsApi()
      .then((res) => {
        setInvitations(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInvitation = (id, action) => {
    const invitation = invitations.find((i) => i._id === id);
    const actionText = {
      accepted: 'Accepted',
      held: 'Put on hold',
      rejected: 'Rejected',
    }[action];

    if (action === 'accepted') {
      acceptProjectInviteApi({ projectId: id })
        .then(() => {
          getInvitations();
          showNotification(`${actionText} invitation for ${invitation.name}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (action === 'held') {
      showNotification(`${actionText} invitation for ${invitation.name}`);
    }

    if (action === 'rejected') {
      rejectProjectInviteApi({ id })
        .then(() => {
          getInvitations();
          showNotification(`${actionText} invitation for ${invitation.name}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const searchProjects = (search) => {
    searchProjectsApi(search)
      .then((res) => {
        setProjects(res.data.projects);
        setProjectPage(1); // Reset to first page when search changes
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleProjectJoin = (project) => {
    if (project.isPrivate) {
      showNotification(`Request sent to join ${project.name}`, 'info');
    } else {
      showNotification(`Joined ${project.name} successfully!`);
    }
  };

  // Pagination calculations
  const invitationStartIndex = (invitationPage - 1) * invitationsPerPage;
  const invitationEndIndex = invitationStartIndex + invitationsPerPage;
  const currentInvitations = filteredInvitations.slice(
    invitationStartIndex,
    invitationEndIndex
  );
  const totalInvitationPages = Math.ceil(
    filteredInvitations.length / invitationsPerPage
  );

  const projectStartIndex = (projectPage - 1) * projectsPerPage;
  const projectEndIndex = projectStartIndex + projectsPerPage;
  const currentProjects = projects.slice(projectStartIndex, projectEndIndex);
  const totalProjectPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container
        maxWidth='lg'
        sx={{ py: 3 }}>
        {/* Invitations Section */}
        <section>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}>
            <Typography
              variant='h4'
              sx={{ color: 'common.white' }}>
              Your Invitations
            </Typography>
            <TextField
              placeholder='Search invitations...'
              value={invitationSearchTerm}
              onChange={(e) => setInvitationSearchTerm(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {currentInvitations.length === 0 ? (
            <Typography
              variant='h6'
              gutterBottom
              sx={{ color: 'common.white' }}>
              No invitations found
            </Typography>
          ) : (
            <>
              <Stack
                spacing={2}
                sx={{ mb: 2 }}>
                {currentInvitations.map((invitation) => (
                  <Card
                    key={invitation.id}
                    sx={{
                      opacity: invitation.status !== 'pending' ? 0.75 : 1,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Stack spacing={1}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                            <Typography
                              variant='h6'
                              sx={{ color: 'common.white' }}>
                              {invitation.name}
                            </Typography>
                            {invitation.isPrivate ? (
                              <Lock
                                fontSize='small'
                                sx={{ color: 'text.secondary' }}
                              />
                            ) : (
                              <LockOpen
                                fontSize='small'
                                sx={{ color: 'text.secondary' }}
                              />
                            )}
                          </Box>
                          <Typography color='text.secondary'>
                            Role: Member
                          </Typography>
                        </Stack>

                        <Stack
                          direction='row'
                          spacing={1}>
                          <Button
                            variant='contained'
                            color='success'
                            startIcon={<CheckCircleOutline />}
                            onClick={() =>
                              handleInvitation(invitation._id, 'accepted')
                            }>
                            Accept
                          </Button>
                          <Button
                            variant='outlined'
                            startIcon={<Schedule />}
                            onClick={() =>
                              handleInvitation(invitation._id, 'held')
                            }
                            sx={{ borderColor: 'rgba(255, 255, 255, 0.23)' }}>
                            Hold
                          </Button>
                          <Button
                            variant='outlined'
                            color='error'
                            startIcon={<Close />}
                            onClick={() =>
                              handleInvitation(invitation._id, 'rejected')
                            }>
                            Reject
                          </Button>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              {totalInvitationPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    mb: 4,
                  }}>
                  <Pagination
                    count={totalInvitationPages}
                    page={invitationPage}
                    onChange={(e, page) => setInvitationPage(page)}
                    color='primary'
                  />
                </Box>
              )}
            </>
          )}
        </section>

        {/* Project Discovery Section */}
        <section>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}>
            <Typography
              variant='h4'
              sx={{ color: 'common.white' }}>
              Discover Projects
            </Typography>
            <TextField
              placeholder='Search projects...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Grid
            container
            spacing={2}>
            {currentProjects.map((project) => (
              <Grid
                item
                xs={12}
                md={6}
                key={project._id}>
                <Card sx={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardHeader
                    title={
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant='h6'
                          sx={{ color: 'common.white' }}>
                          {project.name}
                        </Typography>
                        {project.isPrivate ? (
                          <Lock
                            fontSize='small'
                            sx={{ color: 'text.secondary' }}
                          />
                        ) : (
                          <LockOpen
                            fontSize='small'
                            sx={{ color: 'text.secondary' }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography
                      color='text.secondary'
                      sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                    <Button
                      variant={project.isPrivate ? 'outlined' : 'contained'}
                      onClick={() => handleProjectJoin(project)}
                      sx={
                        project.isPrivate
                          ? { borderColor: 'rgba(255, 255, 255, 0.23)' }
                          : {}
                      }>
                      {project.isPrivate ? 'Request to Join' : 'Join Project'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalProjectPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalProjectPages}
                page={projectPage}
                onChange={(e, page) => setProjectPage(page)}
                color='primary'
              />
            </Box>
          )}
        </section>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant='filled'>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default InvitationPage;
