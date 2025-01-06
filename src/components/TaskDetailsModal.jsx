import {
  AttachFile,
  CalendarToday as Calendar,
  Description,
  LocalOffer as Labels,
  ExitToApp as Leave,
  ViewList as ListIcon,
  Groups as Members,
  Flag as Priority,
  CheckBox as Requirements,
  Delete as Trash,
  Close as X,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgb(17, 24, 39)',
    maxWidth: '90vw',
    width: '90vw',
    height: '90vh',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: 'rgb(209, 213, 219)',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: 'rgba(31, 41, 55, 0.7)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    color: 'rgb(209, 213, 219)',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    '&:hover': {
      backgroundColor: 'rgba(31, 41, 55, 0.7)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const TaskDetailsDialog = ({
  open,
  onClose,
  selectedTask,
  handleNameChange,
}) => {
  const [listMenuAnchor, setListMenuAnchor] = useState(null);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newDescription, setNewDescription] = useState(
    selectedTask?.description
  );
  const [newName, setNewName] = useState(selectedTask?.name);
  const [changingName, setChangingName] = useState(false);

  useEffect(() => {
    if (!selectedTask) return;

    setTask(selectedTask);
    console.log(selectedTask);
  }, [selectedTask]);

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#3B82F6', // blue-500
      medium: '#F59E0B', // yellow-500
      high: '#EF4444', // red-500
    };
    return colors[priority] || colors.low;
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ListIcon sx={{ color: 'rgb(96, 165, 250)' }} />
            <Box>
              <div className='flex items-center'>
                <StyledTextField
                  variant='standard'
                  defaultValue={selectedTask?.name}
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: '1.25rem', fontWeight: 500 },
                  }}
                  onChange={(e) => setNewName(e.target.value)}
                  onClick={() => {
                    setChangingName(true);
                  }}
                />
                {changingName && (
                  // Ok Field
                  <Button
                    onClick={() => {
                      setChangingName(false);
                      handleNameChange(newName, selectedTask?._id);
                    }}>
                    OK
                  </Button>
                )}

                {changingName && (
                  // Cancel Field
                  <Button
                    onClick={() => {
                      setChangingName(true);
                      setNewName(selectedTask?.name);
                    }}>
                    Cancel
                  </Button>
                )}

                {!changingName && (
                  // Edit Field
                  <Button
                    onClick={() => {
                      setChangingName(true);
                      setNewName(selectedTask?.name);
                    }}>
                    Edit
                  </Button>
                )}
              </div>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography
                  variant='body2'
                  sx={{ color: 'rgb(156, 163, 175)' }}>
                  in list
                </Typography>
                <Button
                  onClick={(e) => setListMenuAnchor(e.currentTarget)}
                  sx={{
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(31, 41, 55, 0.7)',
                    },
                  }}>
                  {selectedTask?.status || 'pending'}
                </Button>
                <Menu
                  anchorEl={listMenuAnchor}
                  open={Boolean(listMenuAnchor)}
                  onClose={() => setListMenuAnchor(null)}>
                  <MenuItem>pending</MenuItem>
                  <MenuItem>in-progress</MenuItem>
                  <MenuItem>completed</MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: 'rgb(156, 163, 175)' }}>
            <X />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Panel */}
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                startIcon={<Members />}
                sx={{
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
                }}>
                Members
                {selectedTask?.taskMembers?.length || 0}
              </Button>
              <Button
                startIcon={<Labels />}
                sx={{
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
                }}>
                Labels ({selectedTask?.taskLabel?.length || 0})
              </Button>
              <Button
                startIcon={<Priority />}
                sx={{
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  color: getPriorityColor(selectedTask?.priority),
                  '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
                }}>
                {selectedTask?.priority || 'low'}
              </Button>
            </Box>

            {/* Dates Section */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Calendar sx={{ color: 'rgb(156, 163, 175)' }} />
                <Typography sx={{ color: 'white' }}>Dates</Typography>
              </Box>
              <Button
                sx={{
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  color: 'white',
                  width: '100%',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
                }}>
                Dec 5 - Dec 11, 11:59 PM
                <Chip
                  label='Overdue'
                  size='small'
                  sx={{
                    ml: 1,
                    backgroundColor: 'rgb(220, 38, 38)', // bg-red-600
                    color: 'white',
                  }}
                />
              </Button>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Description sx={{ color: 'rgb(156, 163, 175)' }} />
                <Typography sx={{ color: 'white' }}>Description</Typography>
              </Box>
              <StyledTextField
                multiline
                rows={4}
                fullWidth
                placeholder='Add a more detailed description...'
                value={selectedTask?.description || ''}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Box>

            {/* Attachments */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachFile sx={{ color: 'rgb(156, 163, 175)' }} />
                <Typography sx={{ color: 'white' }}>Attachments</Typography>
              </Box>
              {selectedTask?.attachments?.length > 0 ? (
                <Box
                  sx={{
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    borderRadius: 1,
                    p: 2,
                  }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component='img'
                      src='path_to_screenshot.png'
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <Box>
                      <Typography sx={{ color: 'white' }}>
                        Screenshot 2024-08-17.png
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: 'rgb(156, 163, 175)' }}>
                        Added 1 day ago
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ color: 'rgb(156, 163, 175)' }}>
                  No attachments yet
                </Typography>
              )}
            </Box>

            {/* Progress */}
            <Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Requirements sx={{ color: 'rgb(156, 163, 175)' }} />
                <Typography sx={{ color: 'white' }}>Progress</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant='determinate'
                  value={
                    selectedTask?.progress
                      ? Math.round(selectedTask?.progress / 100) * 100
                      : 0
                  }
                  sx={{
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'rgb(96, 165, 250)', // text-blue-400
                    },
                  }}
                />
                <Typography
                  variant='body2'
                  sx={{
                    color: 'rgb(156, 163, 175)',
                    textAlign: 'right',
                    mt: 0.5,
                  }}>
                  {selectedTask?.progress
                    ? Math.round(selectedTask?.progress / 100) * 100
                    : 0}
                  %
                </Typography>
              </Box>
              {/* Requirements List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {selectedTask?.requirements?.map((requirement, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: 'rgba(31, 41, 55, 0.5)',
                      borderRadius: 1,
                      p: 2,
                    }}>
                    <Typography sx={{ color: 'white' }}>
                      {requirement}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar */}
          <Box
            sx={{
              width: 240,
              borderLeft: '1px solid rgba(75, 85, 99, 0.5)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
            <Button
              startIcon={<Leave />}
              sx={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
              }}>
              Leave
            </Button>
            <Button
              startIcon={<Members />}
              sx={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
              }}>
              Members
            </Button>
            <Button
              startIcon={<Labels />}
              sx={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
              }}>
              Labels
            </Button>
            <Button
              startIcon={<Requirements />}
              sx={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
              }}>
              Requirements
            </Button>
            <Button
              startIcon={<AttachFile />}
              sx={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.7)' },
              }}>
              Attachment
            </Button>
            <Button
              startIcon={<Trash />}
              sx={{
                backgroundColor: 'rgb(220, 38, 38)', // bg-red-600
                color: 'white',
                '&:hover': { backgroundColor: 'rgb(185, 28, 28)' }, // bg-red-700
                mt: 'auto',
              }}>
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </StyledDialog>
  );
};

export default TaskDetailsDialog;
