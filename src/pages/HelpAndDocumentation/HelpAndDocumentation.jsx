import React, { useState } from 'react';
import {
  Container, Box, Typography, Paper, TextField, Accordion,
  AccordionSummary, AccordionDetails, List, ListItem,
  ListItemIcon, ListItemText, Divider, IconButton,
  Tooltip, Breadcrumbs, Link
} from '@mui/material';
import { Search, ExpandMore, ArrowForward, Email } from '@mui/icons-material';

const HelpAndDocumentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const helpSections = [
    {
      title: 'User Management',
      content: [
        {
          subtitle: 'Authentication',
          steps: [
            'Register with email: Fill out the registration form with your details',
            'Verify email: Check your inbox for OTP verification',
            'Login: Use your registered email and password',
            'Profile management: Update profile picture and user information',
            'Password recovery: Use forgot password feature if needed'
          ],
        }
      ],
    },
    {
      title: 'Project Management',
      content: [
        {
          subtitle: 'Project Creation and Setup',
          steps: [
            'Create new projects with name, description, and image',
            'Invite team members via email',
            'Manage project settings and member permissions',
            'View joined and invited projects in dashboard',
            'Request access to existing projects'
          ],
        },
        {
          subtitle: 'Task Management',
          steps: [
            'Create and organize lists within projects',
            'Add tasks with descriptions and deadlines',
            'Assign tasks to team members',
            'Set task priorities and labels',
            'Track task status and requirements',
            'Move tasks between lists',
            'Upload cover images for tasks'
          ],
        }
      ],
    },
    {
      title: 'Communication Tools',
      content: [
        {
          subtitle: 'Chat and Messaging',
          steps: [
            'Create communication channels within projects',
            'Send messages to channels or direct messages to users',
            'Share files and attachments',
            'View online team members',
            'Get notifications for important updates'
          ],
        },
        {
          subtitle: 'Video Calls',
          steps: [
            'Start video calls from any channel',
            'Set up audio and video before joining',
            'Join ongoing calls',
            'Leave or end calls',
            'View call participants'
          ],
        }
      ],
    },
    {
      title: 'Project Views',
      content: [
        {
          subtitle: 'Different Project Perspectives',
          steps: [
            'Board View: Kanban-style task management',
            'Calendar View: Timeline of tasks and deadlines',
            'Timeline View: Project progress visualization',
            'Members View: Team member roles and assignments',
            'Settings View: Project configuration'
          ],
        }
      ],
    },
    {
      title: 'Navigation',
      content: [
        {
          subtitle: 'Available Routes',
          steps: [
            'Dashboard: Overview of all projects',
            'Project Board: Task management interface',
            'Chat: Communication channels',
            'Calendar: Schedule view',
            'Timeline: Project progress',
            'Members: Team management',
            'Settings: Project configuration',
            'Profile: Personal settings',
            'Invitations: Manage project invites'
          ],
        }
      ],
    }
  ];

  const filterContent = (content) => {
    if (!searchQuery) return content;
    return content.filter(
      (section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.some(
          (item) =>
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.steps.some((step) =>
              step.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link 
            href="/" 
            underline="hover"
            sx={{ color: 'text.secondary' }}
          >
            Home
          </Link>
          <Typography color="text.primary">Help & Documentation</Typography>
        </Breadcrumbs>

        <Paper 
          elevation={3}
          sx={{ 
            p: 4,
            backgroundColor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Help & Documentation
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Welcome to Nexus Collaboration Platform. This comprehensive guide covers all features and functionalities of the platform.
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
              }
            }}
            InputProps={{
              startAdornment: (
                <Search sx={{ color: 'text.secondary', mr: 1 }} />
              ),
            }}
          />

          {filterContent(helpSections).map((section, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
              sx={{
                mb: 2,
                backgroundColor: 'background.default',
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  borderRadius: 1,
                  '&.Mui-expanded': {
                    minHeight: 48,
                  },
                }}
              >
                <Typography variant="h6">{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.content.map((item, i) => (
                  <Box key={i} sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ 
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main'
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                    <List>
                      {item.steps.map((step, stepIndex) => (
                        <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <ArrowForward 
                              color="primary"
                              fontSize="small"
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={step}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.secondary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Need More Help?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Contact our support team for additional assistance
            </Typography>
            <Tooltip title="Contact Support">
              <IconButton 
                color="primary"
                sx={{
                  backgroundColor: 'background.default',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                  }
                }}
              >
                <Email />
              </IconButton>
            </Tooltip>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              220042@softwarica.edu.np
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default HelpAndDocumentation;