import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  deleteProjectApi,
  getProjectByIdApi,
  updateProjectApi,
} from '../../apis/Api';

const SettingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [projectName, setProjectName] = useState('Project 1');
  const [isEditing, setIsEditing] = useState(false);
  const [projectJoinType, setProjectJoinType] = useState('request'); // 'open', 'request', 'closed'
  const [permissions, setPermissions] = useState({
    commenting: 'Member',
    taskView: 'Member',
    taskEditing: 'Member',
    taskDelete: 'Member',
    taskMove: 'Member',
    listCreate: 'Admin',
    listDelete: 'Admin',
    chat: 'Member',
    channelCreate: 'Admin',
  });
  const [project, setProject] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getProjectByIdApi(id).then((response) => {
      setProject(response.data.data);
      setProjectName(response.data.data.name);
      setProjectJoinType(response.data.data.isPrivate ? 'closed' : 'open');
      setPermissions(response.data.data.permissions);
    });
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePermissionChange = (key, value) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
    setHasChanges(true);
  };

  const handleJoinTypeChange = (e) => {
    setProjectJoinType(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving changes:', {
      projectName,
      permissions,
      projectJoinType,
    });
    const data = {
      name: projectName,
      permissions,
      isPrivate: projectJoinType === 'closed',
    };
    updateProjectApi(id, data)
      .then((response) => {
        if (response.status === 200) {
          getProjectByIdApi(id).then((response) => {
            setProject(response.data.data);
            setProjectName(response.data.data.name);
            setProjectJoinType(
              response.data.data.isPrivate ? 'closed' : 'open'
            );
            setPermissions(response.data.data.permissions);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    getProjectByIdApi(id).then((response) => {
      setProject(response.data.data);
      setProjectName(response.data.data.name);
      setProjectJoinType(response.data.data.isPrivate ? 'closed' : 'open');
      setPermissions(response.data.data.permissions);
    });
    setHasChanges(false);
    setIsEditing(false);
  };

  const formatPermissionKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      <div className='flex'>
        <main className='flex-1 overflow-auto'>
          <div className='min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8'>
            <div className='max-w-7xl mx-auto'>
              <div className='bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6 md:p-8'>
                {/* Header */}
                <div
                  className={`flex ${
                    isMobile ? 'flex-col gap-4' : 'items-center justify-between'
                  } mb-6`}>
                  <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    component='h1'
                    className='text-white font-semibold'>
                    Project Settings
                  </Typography>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(!isEditing)}
                    variant='contained'
                    className={`${
                      isEditing
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                    {isEditing ? 'Editing...' : 'Edit'}
                  </Button>
                </div>

                <div className='h-px bg-gray-700 mb-6' />

                {/* Project Name */}
                <div className='mb-6'>
                  <Typography
                    variant='h6'
                    className='text-gray-300 mb-3'>
                    Project Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={projectName}
                    onChange={handleProjectNameChange}
                    disabled={!isEditing}
                    className='bg-gray-700'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(75, 85, 99, 1)',
                        },
                      },
                    }}
                  />
                </div>

                {/* Project Join Settings */}
                <div className='mb-6'>
                  <Typography
                    variant='h6'
                    className='text-gray-300 mb-3'>
                    Project Access
                  </Typography>
                  <div className='bg-gray-700 rounded-lg p-4 border border-gray-600'>
                    <FormControl disabled={!isEditing}>
                      <RadioGroup
                        value={projectJoinType}
                        onChange={handleJoinTypeChange}>
                        <FormControlLabel
                          value='open'
                          control={<Radio />}
                          label='Request - Anyone can join'
                          className='text-gray-200'
                        />

                        <FormControlLabel
                          value='closed'
                          control={<Radio />}
                          label='Closed - Invite only'
                          className='text-gray-200'
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>

                {/* Permissions */}
                <div className='mb-6'>
                  <Typography
                    variant='h6'
                    className='text-gray-300 mb-3'>
                    Permissions
                  </Typography>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {Object.entries(permissions).map(([key, value]) => (
                      <div
                        key={key}
                        className='bg-gray-700 rounded-lg p-4 border border-gray-600'>
                        <div className='flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center'>
                          <Typography className='text-gray-200 min-w-[120px]'>
                            {formatPermissionKey(key)}
                          </Typography>
                          <Select
                            value={value}
                            onChange={(e) =>
                              handlePermissionChange(key, e.target.value)
                            }
                            disabled={!isEditing}
                            size='small'
                            className={`min-w-[120px] ${
                              isEditing ? 'bg-gray-600' : 'bg-gray-800'
                            }`}
                            sx={{
                              '&.Mui-disabled': {
                                color: 'rgb(156, 163, 175)',
                              },
                            }}>
                            <MenuItem value='all'>Member</MenuItem>
                            <MenuItem value='Admin'>Admin</MenuItem>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap justify-end gap-3 mt-6'>
                  <Tooltip
                    title='Delete Project'
                    arrow>
                    <span>
                      <Button
                        variant='contained'
                        color='error'
                        startIcon={<DeleteIcon />}
                        onClick={() => setShowDeleteModal(true)}
                        disabled={!isEditing}
                        className='min-w-[40px]'>
                        {!isMobile && 'Delete'}
                      </Button>
                    </span>
                  </Tooltip>

                  {hasChanges && (
                    <>
                      <Tooltip
                        title='Cancel Changes'
                        arrow>
                        <Button
                          variant='contained'
                          className='bg-amber-600 hover:bg-amber-700'
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}>
                          {!isMobile && 'Cancel'}
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title='Save Changes'
                        arrow>
                        <Button
                          variant='contained'
                          className='bg-green-600 hover:bg-green-700'
                          startIcon={<SaveIcon />}
                          onClick={handleSave}>
                          {!isMobile && 'Save'}
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        PaperProps={{
          className: 'bg-gray-800 text-white',
        }}>
        <DialogTitle className='text-red-400'>Delete Project</DialogTitle>
        <DialogContent>
          <Typography className='text-gray-300'>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteModal(false)}
            className='text-gray-300'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteProjectApi(id).then(() => {
                setShowDeleteModal(false);
                window.location.href = '/';
              });
            }}
            color='error'
            variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
