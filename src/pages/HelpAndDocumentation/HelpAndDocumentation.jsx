import { ArrowForward, ExpandMore, Search } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Container,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const HelpAndDocumentation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpSections = [
    {
      title: 'Getting Started',
      content: [
        {
          subtitle: 'Creating Your First Project',
          steps: [
            'Click on "Create More" in the My Projects section',
            'Enter project name and description',
            'Optionally upload a project image',
            'Click Create Project to finish',
          ],
        },
        {
          subtitle: 'Managing Tasks and Lists',
          steps: [
            'Navigate to your project board',
            'Click "Add List" to create a new list',
            'Add tasks to lists using the "+" button',
            'Drag and drop tasks between lists',
          ],
        },
      ],
    },
    {
      title: 'Collaboration Features',
      content: [
        {
          subtitle: 'Project Invitations',
          steps: [
            'Go to the Project Settings',
            'Click on "Invite Members"',
            'Enter email addresses',
            'Set member permissions',
            'Send invitations',
          ],
        },
        {
          subtitle: 'Real-time Communication',
          steps: [
            'Use the chat feature for quick messages',
            'Start video calls from the meeting tab',
            'Share screens during calls',
            'Use @mentions to notify team members',
          ],
        },
      ],
    },
    {
      title: 'Troubleshooting',
      content: [
        {
          subtitle: 'Common Issues',
          steps: [
            'Check your internet connection if experiencing sync issues',
            'Clear browser cache if facing loading problems',
            'Ensure notifications are enabled in browser settings',
            'Contact support for persistent issues',
          ],
        },
      ],
    },
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
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href='/'>Home</Link>
          <Typography color='text.primary'>Help & Documentation</Typography>
        </Breadcrumbs>

        <Paper
          elevation={0}
          sx={{ p: 4 }}>
          <Typography
            variant='h4'
            gutterBottom>
            Help & Documentation
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            paragraph>
            Welcome to Nexus Collaboration Platform's help center.
          </Typography>

          <Box sx={{ my: 4 }}>
            <TextField
              fullWidth
              variant='outlined'
              placeholder='Search documentation...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
            />
          </Box>

          {filterContent(helpSections).map((section, index) => (
            <Accordion
              key={index}
              sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant='h6'>{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.content.map((item, i) => (
                  <Box
                    key={i}
                    sx={{ mb: 3 }}>
                    <Typography
                      variant='subtitle1'
                      sx={{ mb: 1, fontWeight: 'bold' }}>
                      {item.subtitle}
                    </Typography>
                    <List>
                      {item.steps.map((step, stepIndex) => (
                        <ListItem key={stepIndex}>
                          <ListItemIcon>
                            <ArrowForward
                              color='primary'
                              fontSize='small'
                            />
                          </ListItemIcon>
                          <ListItemText primary={step} />
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
              variant='h6'
              gutterBottom>
              Need More Help?
            </Typography>
            <Typography
              variant='body1'
              color='text.secondary'>
              Contact our support team for additional assistance
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Tooltip title='Contact Support'>
                <IconButton
                  color='primary'
                  size='small'>
                  220042@softwarica.edu.np
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default HelpAndDocumentation;
