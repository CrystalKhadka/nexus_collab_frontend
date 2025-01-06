import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { createTaskApi } from '../../apis/Api';
import TaskCard from './TaskCard';

const TaskList = ({
  list,
  lists,
  setLists,
  projectId,
  searchQuery,
  onTaskClick,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleAddTask = async (e) => {
    e?.preventDefault();

    if (!taskTitle.trim()) {
      showSnackbar('Task title cannot be empty', 'error');
      return;
    }

    try {
      const newTask = {
        name: taskTitle,
        index: list.tasks.length + 1,
        listId: list._id,
        projectId: projectId,
      };

      const response = await createTaskApi(newTask);

      if (response.status === 201) {
        const updatedLists = lists.map((l) => {
          if (l._id === list._id) {
            return {
              ...l,
              tasks: [...l.tasks, response.data.data],
            };
          }
          return l;
        });
        setLists(updatedLists);
        showSnackbar('Task added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      showSnackbar(
        error.response?.data?.message || 'Failed to add task',
        'error'
      );
    } finally {
      setTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <Box
      sx={{
        minWidth: '320px',
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        padding: 2,
        height: 'fit-content',
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
          sx={{ color: 'white', fontWeight: 600 }}>
          {list.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant='body2'
            sx={{ color: 'grey.400' }}>
            {list.tasks.length} {list.tasks.length === 1 ? 'task' : 'tasks'}
          </Typography>
          <IconButton
            sx={{
              color: 'grey.400',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}>
            <MoreHorizontal className='w-5 h-5' />
          </IconButton>
        </Box>
      </Box>

      <Droppable droppableId={list._id}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {list.tasks
              .filter((task) =>
                task.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  listId={list._id}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            {provided.placeholder}

            {isAddingTask ? (
              <form
                onSubmit={handleAddTask}
                className='w-full flex gap-2'>
                <TextField
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder='Enter task title'
                  sx={{
                    flexGrow: 1,
                    '& .MuiInputBase-root': {
                      color: 'white',
                      backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  autoFocus
                />
                <Button
                  onClick={() => {
                    setIsAddingTask(false);
                    setTaskTitle('');
                  }}
                  variant='contained'
                  color='error'
                  sx={{ minWidth: 'auto', p: 1 }}>
                  <X className='w-4 h-4' />
                </Button>
              </form>
            ) : (
              <Button
                onClick={() => setIsAddingTask(true)}
                sx={{
                  width: '100%',
                  py: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'grey.400',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                  display: 'flex',
                  gap: 1,
                }}>
                <Plus className='w-5 h-5' />
                Add Card
              </Button>
            )}
          </Box>
        )}
      </Droppable>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskList;
