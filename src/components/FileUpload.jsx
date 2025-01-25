import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  CardMedia,
  CircularProgress,
  IconButton,
  Link,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';

const MediaMessage = ({ message, currentUserId }) => {
  const [open, setOpen] = useState(false);
  const isOwn = message.sender._id === currentUserId;
  const fileName = message.file.split('/').pop();
  const isImage = message.type === 'image';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isOwn ? 'row-reverse' : 'row',
          mb: 2,
          gap: 1,
        }}>
        <Avatar
          src={`/api/profilePic/${message.sender.image}`}
          alt={`${message.sender.firstName} ${message.sender.lastName}`}
        />
        <Box sx={{ maxWidth: '70%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isOwn ? 'row-reverse' : 'row',
              gap: 1,
              mb: 0.5,
            }}>
            <Typography variant='subtitle2'>
              {message.sender.firstName} {message.sender.lastName}
            </Typography>
            <Typography
              variant='caption'
              color='text.secondary'>
              {new Date(message.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              bgcolor: isOwn ? 'primary.main' : 'background.paper',
              color: isOwn ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              cursor: isImage ? 'pointer' : 'default',
            }}
            onClick={() => isImage && setOpen(true)}>
            {isImage ? (
              <CardMedia
                component='img'
                image={`/api/uploads/${message.file}`}
                alt='Shared image'
                sx={{
                  maxHeight: 200,
                  maxWidth: 300,
                  borderRadius: 1,
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachFileIcon />
                <Link
                  href={`/api/uploads/${message.file}`}
                  target='_blank'
                  rel='noopener'
                  sx={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography>{fileName}</Typography>
                </Link>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {isImage && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Box
            sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                position: 'absolute',
                right: -40,
                top: -40,
                color: 'white',
              }}>
              <CloseIcon />
            </IconButton>
            <CardMedia
              component='img'
              image={`/api/uploads/${message.file}`}
              alt='Shared image'
              sx={{
                maxHeight: '90vh',
                maxWidth: '90vw',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

const MediaUpload = ({ onUpload, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleUpload = async (file, type) => {
    if (!file) return;

    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file, type);
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type='file'
        ref={fileInputRef}
        onChange={(e) => handleUpload(e.target.files?.[0], 'file')}
        style={{ display: 'none' }}
      />
      <input
        type='file'
        accept='image/*'
        ref={imageInputRef}
        onChange={(e) => handleUpload(e.target.files?.[0], 'image')}
        style={{ display: 'none' }}
      />
      <IconButton
        size='small'
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || uploading}>
        {uploading ? <CircularProgress size={24} /> : <AttachFileIcon />}
      </IconButton>
      <IconButton
        size='small'
        onClick={() => imageInputRef.current?.click()}
        disabled={disabled || uploading}>
        {uploading ? <CircularProgress size={24} /> : <ImageIcon />}
      </IconButton>
    </>
  );
};

export { MediaMessage, MediaUpload };
