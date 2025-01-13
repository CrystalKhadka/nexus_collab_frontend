import {
  AttachFile,
  CheckCircle as Complete,
  Event as DateIcon,
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
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import AssignUserModal from './projectBoard/AssignUserModal';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgb(17, 24, 39)',
    width: '95vw',
    height: '95vh',
    margin: theme.spacing(1),
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      width: '90vw',
      height: '90vh',
      margin: theme.spacing(2),
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: 'rgb(209, 213, 219)',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color']),
    '&:hover': {
      backgroundColor: 'rgba(31, 41, 55, 0.7)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputBase-inputMultiline': {
    padding: theme.spacing(2),
  },
}));

const ActionButton = styled(Button)(({ theme, color }) => ({
  backgroundColor: color || 'rgba(31, 41, 55, 0.5)',
  color: 'white',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: color ? `${color}CC` : 'rgba(31, 41, 55, 0.7)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    padding: theme.spacing(0.5, 1),
  },
}));

const TaskDetailsDialog = ({
  open,
  onClose,
  selectedTask,
  handleNameChange,
  handleDescriptionChange,
  onDeleteTask,
  handleAssign,
  handleDateChange,
  handleStatusChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false);
  const [listMenuAnchor, setListMenuAnchor] = useState(null);
  const [task, setTask] = useState(null);
  const [newDescription, setNewDescription] = useState(
    selectedTask?.description
  );
  const [newName, setNewName] = useState(selectedTask?.name);
  const [changingName, setChangingName] = useState(false);
  const [startDate, setStartDate] = useState(selectedTask?.startDate || null);
  const [endDate, setDueDate] = useState(selectedTask?.endDate || null);
  const [completed, setCompleted] = useState(
    selectedTask?.status === 'completed'
  );

  useEffect(() => {
    if (!selectedTask) return;
    setTask(selectedTask);
    setNewDescription(selectedTask.description);
    setNewName(selectedTask.name);
    setStartDate(selectedTask.startDate);
    setDueDate(selectedTask.endDate);
    setCompleted(selectedTask.status === 'completed');

    // Check if task is overdue
    if (
      selectedTask.endDate &&
      new Date(selectedTask.endDate) < new Date() &&
      selectedTask.status !== 'completed'
    ) {
      handleStatusChange(selectedTask._id, 'overdue');
    }
  }, [selectedTask]);

  const handleComplete = (event) => {
    setCompleted(event.target.checked);
    handleStatusChange(
      selectedTask._id,
      event.target.checked ? 'completed' : 'in-progress'
    );
  };

  const getPriorityColor = (priority) =>
    ({
      low: '#3B82F6',
      medium: '#F59E0B',
      high: '#EF4444',
    }[priority] || '#3B82F6');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'overdue':
        return '#EF4444';
      case 'in-progress':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
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
            p: { xs: 1, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <ListIcon sx={{ color: 'rgb(96, 165, 250)' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StyledTextField
                  variant='standard'
                  value={newName}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      fontSize: isMobile ? '1rem' : '1.25rem',
                      fontWeight: 500,
                    },
                  }}
                  onChange={(e) => setNewName(e.target.value)}
                  onClick={() => setChangingName(true)}
                />
                {changingName && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <ActionButton
                      size={isMobile ? 'small' : 'medium'}
                      onClick={() => {
                        setChangingName(false);
                        handleNameChange(newName, selectedTask?._id);
                      }}>
                      Save
                    </ActionButton>
                    <ActionButton
                      size={isMobile ? 'small' : 'medium'}
                      onClick={() => {
                        setChangingName(false);
                        setNewName(selectedTask?.name);
                      }}>
                      Cancel
                    </ActionButton>
                  </Box>
                )}
              </Box>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={completed}
                      onChange={handleComplete}
                      icon={<Complete />}
                      checkedIcon={<Complete />}
                      sx={{ color: 'rgb(156, 163, 175)' }}
                    />
                  }
                  label='Complete'
                />
                <Chip
                  label={selectedTask?.status || 'pending'}
                  onClick={(e) => setListMenuAnchor(e.currentTarget)}
                  sx={{
                    backgroundColor: getStatusColor(selectedTask?.status),
                    color: 'white',
                    '&:hover': {
                      backgroundColor: `${getStatusColor(
                        selectedTask?.status
                      )}CC`,
                    },
                  }}
                />
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
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            flexDirection: { xs: 'column', md: 'row' },
          }}>
          {/* Left Panel */}
          <Box sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 }, overflowY: 'auto' }}>
            <Grid
              container
              spacing={2}>
              {/* Quick Actions */}
              <Grid
                item
                xs={12}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <ActionButton startIcon={<Members />}>
                    Members ({selectedTask?.members?.length || 0})
                  </ActionButton>
                  <ActionButton startIcon={<Labels />}>
                    Labels ({selectedTask?.taskLabel?.length || 0})
                  </ActionButton>
                  <ActionButton
                    startIcon={<Priority />}
                    sx={{ color: getPriorityColor(selectedTask?.priority) }}>
                    {selectedTask?.priority || 'low'}
                  </ActionButton>
                </Box>
              </Grid>

              {/* Dates Section - Only show if dates exist */}
              {(startDate || endDate) && (
                <Grid
                  item
                  xs={12}>
                  <Card sx={{ bgcolor: 'rgba(31, 41, 55, 0.3)' }}>
                    <CardContent>
                      <Typography
                        variant='h6'
                        sx={{ color: 'white', mb: 2 }}>
                        <DateIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Dates
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <DatePicker
                            label='Start Date'
                            value={startDate}
                            onChange={(newDate) => {
                              setStartDate(newDate);
                              handleDateChange(
                                selectedTask._id,
                                'startDate',
                                newDate
                              );
                            }}
                            renderInput={(params) => (
                              <StyledTextField {...params} />
                            )}
                          />
                          <DatePicker
                            label='Due Date'
                            value={endDate}
                            onChange={(newDate) => {
                              setDueDate(newDate);
                              handleDateChange(
                                selectedTask._id,
                                'endDate',
                                newDate
                              );
                            }}
                            renderInput={(params) => (
                              <StyledTextField {...params} />
                            )}
                          />
                        </Box>
                      </LocalizationProvider>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Description */}
              <Grid
                item
                xs={12}>
                <Card sx={{ bgcolor: 'rgba(31, 41, 55, 0.3)' }}>
                  <CardContent>
                    <Typography
                      variant='h6'
                      sx={{ color: 'white', mb: 2 }}>
                      <Description sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Description
                    </Typography>
                    <StyledTextField
                      multiline
                      rows={4}
                      fullWidth
                      placeholder='Add a detailed description...'
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <ActionButton
                        onClick={() =>
                          handleDescriptionChange(
                            newDescription,
                            selectedTask?._id
                          )
                        }>
                        Save
                      </ActionButton>
                      <ActionButton
                        onClick={() =>
                          setNewDescription(selectedTask?.description)
                        }>
                        Cancel
                      </ActionButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Progress Section */}
              <Grid
                item
                xs={12}>
                <Card sx={{ bgcolor: 'rgba(31, 41, 55, 0.3)' }}>
                  <CardContent>
                    <Typography
                      variant='h6'
                      sx={{ color: 'white', mb: 2 }}>
                      <Requirements sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Progress
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant='determinate'
                        value={completed ? 100 : selectedTask?.progress || 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(31, 41, 55, 0.5)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: completed
                              ? '#10B981'
                              : 'rgb(96, 165, 250)',
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography
                        variant='body2'
                        sx={{
                          color: 'rgb(156, 163, 175)',
                          textAlign: 'right',
                          mt: 1,
                        }}>
                        {completed ? 100 : selectedTask?.progress || 0}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Right Sidebar - Collapsible on mobile */}
          {!isMobile && (
            <Box
              sx={{
                width: { sm: '200px', md: '240px' },
                borderLeft: '1px solid rgba(75, 85, 99, 0.5)',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}>
              <ActionButton startIcon={<Leave />}>Leave</ActionButton>
              <ActionButton
                startIcon={<Members />}
                onClick={() => setAssignUserModalOpen(true)}>
                Members
              </ActionButton>
              <ActionButton startIcon={<Labels />}>Labels</ActionButton>
              <ActionButton startIcon={<Requirements />}>
                Requirements
              </ActionButton>
              <ActionButton startIcon={<AttachFile />}>Attachment</ActionButton>
              <ActionButton
                startIcon={<DateIcon />}
                onClick={() => {
                  if (!startDate && !endDate) {
                    setStartDate(new Date());
                    setDueDate(new Date());
                    handleDateChange(selectedTask._id, 'startDate', new Date());
                    handleDateChange(selectedTask._id, 'endDate', new Date());
                  }
                }}>
                Set Dates
              </ActionButton>
              <ActionButton
                startIcon={<Trash />}
                onClick={() => onDeleteTask(selectedTask._id)}
                sx={{
                  backgroundColor: 'rgb(220, 38, 38)',
                  marginTop: 'auto',
                  '&:hover': { backgroundColor: 'rgb(185, 28, 28)' },
                }}>
                Delete
              </ActionButton>
            </Box>
          )}
        </Box>
      </Box>

      <AssignUserModal
        open={assignUserModalOpen}
        onClose={() => setAssignUserModalOpen(false)}
        onAssign={(userId) => {
          const data = {
            userId,
          };
          handleAssign(selectedTask._id, data);
        }}
      />

      <Menu
        anchorEl={listMenuAnchor}
        open={Boolean(listMenuAnchor)}
        onClose={() => setListMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            handleStatusChange(selectedTask._id, 'pending');
            setListMenuAnchor(null);
          }}>
          Pending
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleStatusChange(selectedTask._id, 'in-progress');
            setListMenuAnchor(null);
          }}>
          In Progress
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleStatusChange(selectedTask._id, 'completed');
            setCompleted(true);
            setListMenuAnchor(null);
          }}>
          Completed
        </MenuItem>
      </Menu>
    </StyledDialog>
  );
};

export default TaskDetailsDialog;
