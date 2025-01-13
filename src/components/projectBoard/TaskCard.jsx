import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const availableLabels = [
  { id: 1, color: '#ef4444', name: 'Urgent' }, // red-500
  { id: 2, color: '#eab308', name: 'In Review' }, // yellow-500
  { id: 3, color: '#22c55e', name: 'Approved' }, // green-500
  { id: 4, color: '#3b82f6', name: 'Feature' }, // blue-500
  { id: 5, color: '#a855f7', name: 'Bug' }, // purple-500
];

const TaskCard = ({ task, index, listId, onClick, onDelete }) => (
  <Draggable
    draggableId={task._id}
    index={listId}>
    {(provided, snapshot) => (
      <Box
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={onClick}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}>
        <Paper
          elevation={snapshot.isDragging ? 8 : 1}
          sx={{
            backgroundColor: 'rgb(31, 41, 55)', // bg-gray-800
            borderRadius: '12px',
            overflow: 'hidden',
            border: snapshot.isDragging
              ? '2px solid rgba(255, 255, 255, 0.2)'
              : 'none',
          }}>
          {task.taskCover && (
            <Box
              component='img'
              src={task.taskCover}
              alt={task.name}
              sx={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
              }}
            />
          )}

          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1,
              }}>
              <Typography
                variant='h6'
                sx={{ color: 'white', fontWeight: 500 }}>
                {task.name}
              </Typography>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                }}
                sx={{
                  color: 'grey.400',
                  p: 0.5,
                  '&:hover': {
                    color: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  },
                }}>
                <X className='w-4 h-4' />
              </IconButton>
            </Box>

            {task.description && (
              <Typography
                variant='body2'
                sx={{
                  color: 'grey.400',
                  mb: 1.5,
                }}>
                {task.description}
              </Typography>
            )}

            {task.startDate && task.endDate && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography
                  variant='body2'
                  sx={{ color: 'grey.400' }}>
                  Due:
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'white' }}>
                  {dayjs(task.startDate).format('DD MMM YYYY')}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'grey.400' }}>
                  to
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'white' }}>
                  {dayjs(task.endDate).format('DD MMM YYYY')}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Box>
                {task.members?.length > 0 ? (
                  <AvatarGroup
                    max={3}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        border: '2px solid rgb(31, 41, 55)',
                      },
                    }}>
                    {task.members.map((member) => (
                      <>
                        <Avatar
                          key={member._id}
                          src={`http://localhost:5000/profilePic/${member.image}`}
                          alt={member.name}
                          title={
                            member.firstName.slice(0, 1) +
                            '' +
                            member.lastName.slice(0, 1)
                          }
                        />
                      </>
                    ))}
                  </AvatarGroup>
                ) : (
                  <Typography
                    variant='caption'
                    sx={{ color: 'grey.400' }}>
                    No members
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {task.taskLabel?.slice(0, 2).map((labelId) => {
                  const label = availableLabels.find((l) => l.id === labelId);
                  if (label) {
                    return (
                      <Chip
                        key={labelId}
                        label={label.name}
                        size='small'
                        sx={{
                          backgroundColor: label.color,
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    )}
  </Draggable>
);

export default TaskCard;
