import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { createTaskApi } from '../../apis/Api';
import TaskCard from './TaskCard';

const TaskList = ({
  list,
  lists,
  setLists,
  projectId,
  onTaskClick,
  onDeleteTask,
  onDeleteList,
  onRenameList,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newListName, setNewListName] = useState(list.name);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const { setNodeRef } = useDroppable({
    id: list._id,
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteList = async () => {
    try {
      onDeleteList(list._id);
      setSnackbar({
        open: true,
        message: 'List deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete list',
        severity: 'error',
      });
    }
    handleMenuClose();
  };

  const handleRenameList = async () => {
    if (!newListName.trim()) {
      setSnackbar({
        open: true,
        message: 'List name cannot be empty',
        severity: 'error',
      });
      return;
    }

    try {
      onRenameList(list._id, newListName);
      setSnackbar({
        open: true,
        message: 'List renamed successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to rename list',
        severity: 'error',
      });
    }
    setIsRenaming(false);
    handleMenuClose();
  };

  const handleAddTask = async (e) => {
    e?.preventDefault();

    if (!taskTitle.trim()) {
      setSnackbar({
        open: true,
        message: 'Task name cannot be empty',
        severity: 'error',
      });
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
        setSnackbar({
          open: true,
          message: 'Task added successfully',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add task',
        severity: 'error',
      });
    } finally {
      setTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: 320,
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        borderRadius: 2,
        p: 2,
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
            sx={{ color: 'grey.400' }}
            onClick={handleMenuOpen}>
            <MoreHorizontal />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setIsRenaming(true);
            handleMenuClose();
          }}>
          Rename List
        </MenuItem>
        <MenuItem
          onClick={handleDeleteList}
          sx={{ color: 'error.main' }}>
          Delete List
        </MenuItem>
      </Menu>

      <Dialog
        open={isRenaming}
        onClose={() => setIsRenaming(false)}>
        <DialogTitle>Rename List</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
          <TextField
            autoFocus
            margin='dense'
            label='List Name'
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: 'background.default',
          }}>
          <Button onClick={() => setIsRenaming(false)}>Cancel</Button>
          <Button onClick={handleRenameList}>Save</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SortableContext
          id={list._id}
          items={list.tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}>
          {list.tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              onClick={() => onTaskClick(task)}
              onDelete={() => onDeleteTask(task._id, list._id)}
            />
          ))}
        </SortableContext>

        {isAddingTask ? (
          <form onSubmit={handleAddTask}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder='Enter task title'
                fullWidth
                autoFocus
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  },
                }}
              />
              <Button
                onClick={() => {
                  setIsAddingTask(false);
                  setTaskTitle('');
                }}
                variant='contained'
                color='error'
                sx={{ minWidth: 'auto', p: 1 }}>
                <X />
              </Button>
            </Box>
          </form>
        ) : (
          <Button
            onClick={() => setIsAddingTask(true)}
            sx={{
              py: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'grey.400',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
            }}>
            <Plus sx={{ mr: 1 }} />
            Add Card
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskList;
