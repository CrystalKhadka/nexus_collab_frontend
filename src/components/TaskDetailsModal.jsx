import {
  Image as Camera,
  CheckCircle as Complete,
  Event as DateIcon,
  Description,
  Image as ImageIcon,
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
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Modal,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
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
import { getMeApi } from '../apis/Api';
import AssignUserModal from './projectBoard/AssignUserModal';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgb(17, 24, 39)',
    width: '100vw',
    height: '100vh',
    margin: 0,
    borderRadius: 0,
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: '95vw',
      height: '95vh',
      margin: theme.spacing(1),
      borderRadius: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      width: '90vw',
      height: '90vh',
      margin: theme.spacing(2),
      borderRadius: theme.spacing(2),
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

const RequirementsDialog = ({
  open,
  onClose,
  selectedTask,
  handleRequirementChange,
}) => {
  const [newRequirement, setNewRequirement] = useState('');
  const [requirements, setRequirements] = useState(
    selectedTask?.taskRequirements || []
  );

  useEffect(() => {
    setRequirements(selectedTask?.taskRequirements || []);
  }, [selectedTask]);

  const handleAddRequirement = async () => {
    if (newRequirement.trim()) {
      const data = {
        text: newRequirement,
        completed: false,
        type: 'add',
      };

      await handleRequirementChange(selectedTask._id, data);

      setNewRequirement('');
    }
  };

  const handleToggleRequirement = (reqId) => {
    const data = {
      completed: !requirements.find((req) => req._id === reqId).completed,
      reqId,
      type: 'toggle',
    };
    handleRequirementChange(selectedTask._id, data);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgb(17, 24, 39)',
          color: 'white',
          width: '100%',
          maxWidth: '500px',
        },
      }}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}>
          <Typography variant='h6'>Requirements</Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: 'rgb(156, 163, 175)' }}>
            <X />
          </IconButton>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder='Add a new requirement...'
            variant='outlined'
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(31, 41, 55, 0.7)',
                },
              },
            }}
          />
          <Button
            onClick={handleAddRequirement}
            variant='contained'
            sx={{
              mt: 1,
              backgroundColor: 'rgb(96, 165, 250)',
              '&:hover': {
                backgroundColor: 'rgb(59, 130, 246)',
              },
            }}>
            Add Requirement
          </Button>
        </Box>

        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          {requirements.map((req) => (
            <Card
              key={req._id}
              sx={{ mb: 1, backgroundColor: 'rgba(31, 41, 55, 0.3)' }}>
              <CardContent
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Checkbox
                  checked={req.completed}
                  onChange={() => handleToggleRequirement(req._id)}
                  sx={{ color: 'rgb(156, 163, 175)' }}
                />
                <Typography
                  sx={{
                    textDecoration: req.completed ? 'line-through' : 'none',
                    color: req.completed ? 'rgb(156, 163, 175)' : 'white',
                  }}>
                  {req.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Dialog>
  );
};

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
  handleLabelChange,
  handlePriorityChange,
  handleCoverChange,
  handleRequirementChange,
  handleJoinOrLeaveTask,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false);
  const [listMenuAnchor, setListMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
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
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [priorityMenuAnchor, setPriorityMenuAnchor] = useState(null);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [requirementsDialogOpen, setRequirementsDialogOpen] = useState(false);
  const fileInputRef = React.useRef();

  const handleCoverClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = () => {
    if (selectedTask?.taskCover) {
      setOpenModal(true);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleCoverChange(selectedTask._id, file);
    }
  };

  const priorityOptions = [
    { label: 'Low', color: '#3B82F6' },
    { label: 'Medium', color: '#F59E0B' },
    { label: 'High', color: '#EF4444' },
  ];

  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!selectedTask) return;
    setTask(selectedTask);
    setNewDescription(selectedTask.description);
    setNewName(selectedTask.name);
    setStartDate(
      selectedTask.startDate ? new Date(selectedTask.startDate) : null
    );
    setDueDate(selectedTask.endDate ? new Date(selectedTask.endDate) : null);
    setCompleted(selectedTask.status === 'completed');

    // Overdue
    if (selectedTask.status === 'in-progress') {
      const now = new Date();
      if (now > selectedTask.endDate) {
        handleStatusChange(selectedTask._id, 'overdue');
      }
    }
  }, [selectedTask, handleStatusChange]);

  useEffect(() => {
    getMeApi()
      .then((response) => {
        if (response.status === 200) {
          const me = response.data.user;
          setIsJoined(
            selectedTask.members.some((member) => member._id === me._id)
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
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

  const LabelDialog = () => {
    const [labelName, setLabelName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#3B82F6');

    const labelColors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#6B7280', // Gray
    ];

    const handleLabelAdd = () => {
      if (labelName.trim()) {
        handleLabelChange(selectedTask._id, {
          name: labelName,
          color: selectedColor,
          type: 'add',
        });
        setLabelName('');
        onClose();
      }
    };

    return (
      <Dialog
        open={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgb(17, 24, 39)',
            color: 'white',
            width: '100%',
            maxWidth: '400px',
            margin: 2,
          },
        }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}>
            <Typography variant='h6'>Labels</Typography>
            <IconButton
              onClick={() => setLabelModalOpen(false)}
              sx={{ color: 'rgb(156, 163, 175)' }}>
              <X />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label='Label Name'
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              variant='outlined'
              sx={{ mb: 2 }}
            />

            <Typography
              variant='subtitle2'
              sx={{ mb: 1 }}>
              Select Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {labelColors.map((color) => (
                <IconButton
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    backgroundColor: color,
                    width: 32,
                    height: 32,
                    border:
                      selectedColor === color ? '2px solid white' : 'none',
                    '&:hover': {
                      backgroundColor: color,
                    },
                  }}
                />
              ))}
            </Box>

            <ActionButton
              fullWidth
              onClick={() => {
                handleLabelAdd();
                if (labelName.trim()) {
                  setLabelModalOpen(false);
                }
              }}
              sx={{ backgroundColor: selectedColor }}>
              Add Label
            </ActionButton>
          </Box>

          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            {selectedTask?.taskLabel?.map((label) => (
              <Chip
                key={label._id}
                label={label.name}
                onDelete={() => {
                  setLabelModalOpen(false);
                  handleLabelChange(selectedTask._id, {
                    labelId: label._id,
                    type: 'remove',
                  });
                  selectedTask.taskLabel = selectedTask.taskLabel.filter(
                    (l) => l._id !== label._id
                  );
                }}
                sx={{
                  backgroundColor: label.color,
                  color: 'white',
                  m: 0.5,
                }}
              />
            ))}
          </Box>
        </Box>
      </Dialog>
    );
  };

  const actions = [
    {
      icon: <Members />,
      name: 'Members',
      onClick: () => setAssignUserModalOpen(true),
    },
    {
      icon: <Labels />,
      name: 'Labels',
      onClick: () => setLabelModalOpen(true),
    },
    {
      icon: <Priority />,
      name: 'Priority',
      onClick: (event) => setPriorityMenuAnchor(event.currentTarget),
    },
    {
      icon: <Requirements />,
      name: 'Requirements',
      onClick: () => setRequirementsDialogOpen(true),
    },

    {
      icon: <DateIcon />,
      name: 'Dates',
      onClick: () => {
        if (!startDate && !endDate) {
          setStartDate(new Date());
          setDueDate(new Date());
          handleDateChange(selectedTask._id, 'startDate', new Date());
          handleDateChange(selectedTask._id, 'endDate', new Date());
        }
      },
    },

    {
      // Join or leave
      icon: <Leave />,
      name: isJoined ? 'Leave' : 'Join',
      onClick: () => {
        handleJoinOrLeaveTask(selectedTask._id);
      },
    },
    {
      icon: <Trash />,
      name: 'Delete',
      color: 'rgb(220, 38, 38)',
      onClick: () => onDeleteTask(selectedTask._id),
    },
  ];

  const calculateRequirementsProgress = () => {
    const reqs = selectedTask?.taskRequirements || [];
    if (reqs.length === 0) return 0;
    const completedReqs = reqs.filter((req) => req.completed).length;
    return Math.round((completedReqs / reqs.length) * 100);
  };

  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='lg'>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Close Icon*/}
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={onClose}
              sx={{
                backgroundColor: 'rgb(220, 38, 38)',
                position: 'absolute',
                top: 10,
                right: 10,
                '&:hover': {
                  backgroundColor: 'rgb(185, 28, 28)',
                },
                zIndex: 1,
              }}>
              <X />
            </IconButton>

            <Box
              onClick={handleImageClick}
              sx={{
                position: 'relative',
                width: '100%',
                height: '200px',
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                backgroundImage: selectedTask?.taskCover
                  ? `url(http://localhost:5000/task/cover/${selectedTask.taskCover})`
                  : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
                mr: 5,
                transition: 'background-image 0.3s ease-in-out',
              }}>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                accept='image/*'
                style={{ display: 'none' }}
              />

              {/* Change Cover Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                  display: 'none',
                  '.MuiBox-root:hover &': {
                    display: 'flex',
                  },
                }}>
                <Camera />
              </IconButton>

              {/* Empty State */}
              {!selectedTask?.taskCover && (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'white',
                  }}>
                  <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant='body1'>Add Cover</Typography>
                </Box>
              )}
            </Box>

            {/* Full Image Modal */}
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}>
              <Fade in={openModal}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    outline: 'none',
                  }}>
                  <img
                    src={`http://localhost:5000/task/cover/${selectedTask?.taskCover}`}
                    alt='Task Cover'
                    style={{
                      maxWidth: '100%',
                      maxHeight: '90vh',
                      objectFit: 'contain',
                    }}
                  />
                  <IconButton
                    onClick={() => setOpenModal(false)}
                    sx={{
                      position: 'absolute',
                      top: -40,
                      right: -40,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      },
                    }}>
                    <X />
                  </IconButton>
                </Box>
              </Fade>
            </Modal>
          </Box>

          {/* Header */}

          {/* Main Content */}
          <Box sx={{ display: 'flex', flex: 1, overflow: 'auto' }}>
            {/* Left Panel */}
            <Box
              sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 }, overflowY: 'auto' }}>
              <Grid
                container
                spacing={2}>
                {/* Quick Actions */}
                <Box
                  sx={{
                    p: { xs: 1, sm: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flex: 1,
                    }}>
                    <ListIcon sx={{ color: 'rgb(96, 165, 250)' }} />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                          fullWidth
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
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 1,
                          flexWrap: 'wrap',
                        }}>
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
                            backgroundColor: getStatusColor(
                              selectedTask?.status
                            ),
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
                </Box>
                <Grid
                  item
                  xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <ActionButton
                      startIcon={<Members />}
                      onClick={() => setAssignUserModalOpen(true)}>
                      Members ({selectedTask?.members?.length || 0})
                    </ActionButton>
                    <ActionButton
                      startIcon={<Labels />}
                      onClick={() => setLabelModalOpen(true)}>
                      Labels ({selectedTask?.taskLabel?.length || 0})
                    </ActionButton>
                    <ActionButton
                      startIcon={<Priority />}
                      onClick={(e) => setPriorityMenuAnchor(e.currentTarget)}
                      sx={{ color: getPriorityColor(selectedTask?.priority) }}>
                      {selectedTask?.priority || 'low'}
                    </ActionButton>
                  </Box>
                </Grid>

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
                        rows={2}
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

                {/* Dates Section */}
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
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: isMobile ? 'column' : 'row',
                          }}>
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
                              <StyledTextField
                                {...params}
                                fullWidth
                              />
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
                              <StyledTextField
                                {...params}
                                fullWidth
                              />
                            )}
                          />
                        </Box>
                      </LocalizationProvider>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid
                  item
                  xs={12}>
                  <Card sx={{ bgcolor: 'rgba(31, 41, 55, 0.3)' }}>
                    <CardContent>
                      <Typography
                        variant='h6'
                        sx={{ color: 'white', mb: 2 }}>
                        <Requirements sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Requirements Progress
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          variant='determinate'
                          value={calculateRequirementsProgress()}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(31, 41, 55, 0.5)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 'rgb(96, 165, 250)',
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
                          {calculateRequirementsProgress()}% Complete
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ color: 'rgb(156, 163, 175)', mt: 1 }}>
                          {selectedTask?.taskRequirements?.filter(
                            (r) => r.completed
                          ).length || 0}{' '}
                          of {selectedTask?.taskRequirements?.length || 0}{' '}
                          requirements completed
                        </Typography>

                        {/* Map requirements */}
                        {selectedTask?.taskRequirements?.map((req) => (
                          <Box
                            key={req._id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mt: 1,
                            }}>
                            <Checkbox
                              checked={req.completed}
                              onChange={() => {
                                handleRequirementChange(selectedTask._id, {
                                  completed: !req.completed,
                                  reqId: req._id,
                                  type: 'toggle',
                                });
                              }}
                            />
                            <Typography
                              variant='body2'
                              sx={{
                                color: 'rgb(156, 163, 175)',
                                textDecoration: req.completed
                                  ? 'line-through'
                                  : 'none',
                              }}>
                              {req.text}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Right Sidebar - Only shown on larger screens */}
            {!isTablet && (
              <Box
                sx={{
                  width: 240,
                  borderLeft: '1px solid rgba(75, 85, 99, 0.5)',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  overflowY: 'auto',
                }}>
                {actions.map((action) => (
                  <ActionButton
                    key={action.name}
                    startIcon={action.icon}
                    onClick={action.onClick}
                    sx={{
                      backgroundColor: action.color || undefined,
                      '&:hover': {
                        backgroundColor: action.color
                          ? `${action.color}CC`
                          : undefined,
                      },
                      ...(action.name === 'Delete' && { marginTop: 'auto' }),
                    }}>
                    {action.name}
                  </ActionButton>
                ))}
              </Box>
            )}

            {/* Mobile Speed Dial */}
            {isTablet && (
              <SpeedDial
                ariaLabel='Task actions'
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  '& .MuiFab-primary': {
                    backgroundColor: 'rgb(96, 165, 250)',
                    '&:hover': {
                      backgroundColor: 'rgb(59, 130, 246)',
                    },
                  },
                }}
                icon={<SpeedDialIcon />}>
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                    sx={{
                      backgroundColor: action.color || 'rgba(31, 41, 55, 0.8)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: action.color
                          ? `${action.color}CC`
                          : 'rgba(31, 41, 55, 1)',
                      },
                    }}
                  />
                ))}
              </SpeedDial>
            )}
          </Box>
        </Box>
      </StyledDialog>

      {/* Labels Dialog */}
      <LabelDialog />

      {/* Priority Menu */}
      <Menu
        anchorEl={priorityMenuAnchor}
        open={Boolean(priorityMenuAnchor)}
        onClose={() => setPriorityMenuAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgb(31, 41, 55)',
            color: 'white',
          },
        }}>
        {priorityOptions.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              handlePriorityChange(
                selectedTask._id,
                option.label.toLowerCase()
              );
              selectedTask.priority = option.label.toLowerCase();
              setPriorityMenuAnchor(null);
            }}
            sx={{
              color: option.color,
              '&:hover': {
                backgroundColor: 'rgba(75, 85, 99, 0.4)',
              },
            }}>
            <Priority sx={{ mr: 1 }} />
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Status Menu */}
      <Menu
        anchorEl={listMenuAnchor}
        open={Boolean(listMenuAnchor)}
        onClose={() => setListMenuAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgb(31, 41, 55)',
            color: 'white',
            '& .MuiMenuItem-root': {
              '&:hover': {
                backgroundColor: 'rgba(75, 85, 99, 0.4)',
              },
            },
          },
        }}>
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

      {/* AssignUserModal */}
      <AssignUserModal
        open={assignUserModalOpen}
        onClose={() => setAssignUserModalOpen(false)}
        onAssign={(userId) => {
          handleAssign(selectedTask._id, { userId });
        }}
      />

      <RequirementsDialog
        open={requirementsDialogOpen}
        onClose={() => setRequirementsDialogOpen(false)}
        selectedTask={selectedTask}
        handleRequirementChange={handleRequirementChange}
      />
    </>
  );
};

export default TaskDetailsDialog;
