import {
  ArrowForward as ArrowForwardIcon,
  Help as HelpIcon,
  Message as MessageIcon,
  People as PeopleIcon,
  AccountTree as WorkflowIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Link,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
  borderRadius: theme.shape.borderRadius,
  padding: '10px 30px',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #2E7D32 30%, #1B5E20 90%)',
  },
}));

const features = [
  {
    icon: WorkflowIcon,
    title: 'Task Management',
    description: 'Organize and track project tasks efficiently',
  },
  {
    icon: MessageIcon,
    title: 'Real-time Chat',
    description: 'Communicate instantly with team members',
  },
  {
    icon: PeopleIcon,
    title: 'Team Collaboration',
    description: 'Work together seamlessly on projects',
  },
];

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'rgb(17, 24, 39)',
        position: 'relative',
        overflow: 'auto',
      }}>
      <AppBar
        position='fixed'
        sx={{
          backgroundColor: 'background.default',
          backdropFilter: 'blur(10px)',
        }}>
        <Toolbar>
          <Box
            component='img'
            src='/images/logo1.png'
            sx={{ height: 40, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color='inherit'
            component={Link}
            href='/help'
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
            }}>
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ pt: 12, pb: 8, bgcolor: 'rgba(31, 41, 55, 0.5)' }}>
        <Grid
          container
          spacing={4}
          alignItems='center'>
          <Grid
            item
            xs={12}
            md={6}>
            <Box
              component='img'
              src='/images/nexus_logo.png'
              sx={{
                width: '100%',
                maxWidth: 500,
                height: 'auto',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-20px)' },
                },
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component='h1'
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff, #ccc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Nexus Collaboration
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <Grid
                  item
                  xs={12}
                  key={index}>
                  <StyledPaper>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <feature.icon
                        sx={{ fontSize: 32, color: theme.palette.primary.main }}
                      />
                      <Box>
                        <Typography
                          variant='h6'
                          sx={{ color: 'white' }}>
                          {feature.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledPaper>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
              }}>
              <GradientButton
                fullWidth
                size='large'
                endIcon={<ArrowForwardIcon />}
                onClick={() => (window.location.href = '/register')}>
                Get Started
              </GradientButton>

              <Typography
                variant='body2'
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Already have an account?{' '}
                <Link
                  href='/login'
                  sx={{ color: '#4CAF50', '&:hover': { color: '#2E7D32' } }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
