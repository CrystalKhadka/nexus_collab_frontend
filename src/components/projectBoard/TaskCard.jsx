import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

const availableLabels = [
  { id: 1, color: '#ef4444', name: 'Urgent' },
  { id: 2, color: '#eab308', name: 'In Review' },
  { id: 3, color: '#22c55e', name: 'Approved' },
  { id: 4, color: '#3b82f6', name: 'Feature' },
  { id: 5, color: '#a855f7', name: 'Bug' },
];

const TaskCard = ({ task, index, listId, onClick, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}>
      <Paper
        sx={{
          backgroundColor: 'rgb(31, 41, 55)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: 'none',
        }}>
        {task.taskCover && (
          <Box
            component='img'
            src={`http://localhost:5000/task/cover/${task.taskCover}`}
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
              {task.taskLabel?.slice(0, 2).map((label) => (
                <Chip
                  key={label._id}
                  label={label.name}
                  size='small'
                  sx={{
                    backgroundColor: label.color,
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskCard;
