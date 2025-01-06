import { AddPhotoAlternate, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const CreateProjectModal = ({ open, onClose, onSubmit, onImageUpload }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onImageUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };

      reader.readAsDataURL(file);
      // Clear error when image is uploaded
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: '',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    if (!imageUrl) {
      newErrors.image = 'Project image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        await onSubmit({ ...formData, image: imageUrl });
        handleReset();
        // onClose();
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({ name: '', description: '' });
    setImageUrl(null);
    setErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className='overflow-y-auto'
      aria-labelledby='create-project-modal'
      aria-describedby='create-project-form'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}>
          <Typography
            variant='h6'
            component='h2'>
            Create New Project
          </Typography>
          <IconButton
            onClick={onClose}
            size='small'>
            <Close />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label='Project Name'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          error={!!errors.name}
          helperText={errors.name}
          margin='normal'
        />

        <TextField
          fullWidth
          label='Project Description'
          name='description'
          value={formData.description}
          onChange={handleInputChange}
          error={!!errors.description}
          helperText={errors.description}
          margin='normal'
          multiline
          rows={4}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            accept='image/*'
            id='project-image-upload'
            type='file'
            hidden
            onChange={handleImageChange}
          />
          <label htmlFor='project-image-upload'>
            <Button
              variant='outlined'
              component='span'
              startIcon={<AddPhotoAlternate />}
              fullWidth
              sx={{ mb: 1 }}>
              Upload Project Image
            </Button>
          </label>
          {errors.image && (
            <Typography
              color='error'
              variant='caption'
              display='block'>
              {errors.image}
            </Typography>
          )}
          {imageUrl && (
            <Box sx={{ mt: 2, position: 'relative' }}>
              <img
                src={imageUrl}
                alt='Project preview'
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <IconButton
                size='small'
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  },
                  color: 'white',
                }}
                onClick={() => setImageUrl(null)}>
                <Close />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box
          sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant='outlined'
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;
