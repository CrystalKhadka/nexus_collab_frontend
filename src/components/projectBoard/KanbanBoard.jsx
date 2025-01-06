import { Alert, Button, Snackbar, TextField } from '@mui/material';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { addListToProjectApi, createListApi } from '../../apis/Api';
import TaskList from './TaskList';

const KanbanBoard = ({ lists, setLists, projectId, onTaskClick }) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [listName, setListName] = useState('');
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

  const addNewList = async () => {
    const title = listName.trim() || 'New List';
    const index = lists.length + 1;

    try {
      const listResponse = await createListApi({
        name: title,
        projectId: projectId,
        index: index,
      });

      if (listResponse.status === 201) {
        const newList = listResponse.data.data;

        await addListToProjectApi({
          id: projectId,
          data: { listId: newList._id },
        });

        setLists([...lists, { ...newList, tasks: [] }]);
        showSnackbar('List added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding list:', error);
      showSnackbar(
        error.response?.data?.message || 'Failed to add list',
        'error'
      );
    } finally {
      setListName('');
      setIsAddingList(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewList();
  };

  return (
    <div className='flex gap-6'>
      {lists.map((list) => (
        <TaskList
          key={list._id}
          list={list}
          lists={lists}
          setLists={setLists}
          projectId={projectId}
          onTaskClick={onTaskClick}
          searchQuery={''}
        />
      ))}

      {isAddingList ? (
        <div className='min-w-[320px]'>
          <form
            onSubmit={handleSubmit}
            className='w-full flex gap-2 border-dashed border-2 border-white/20 p-4 rounded-xl'>
            <TextField
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder='Enter list title'
              sx={{
                flexGrow: 1,
                '& .MuiInputBase-root': {
                  color: 'white',
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
              autoFocus
            />
            <Button
              onClick={() => setIsAddingList(false)}
              variant='contained'
              color='error'
              sx={{ minWidth: 'auto', p: 1 }}>
              <X className='w-4 h-4' />
            </Button>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingList(true)}
          variant='outlined'
          sx={{
            minWidth: '320px',
            py: 2,
            borderRadius: 3,
            backgroundColor: 'rgba(31, 41, 55, 0.3)',
            backdropFilter: 'blur(8px)',
            borderStyle: 'dashed',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'gray.400',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
              color: 'white',
            },
            display: 'flex',
            gap: 1,
          }}>
          <Plus className='w-5 h-5' />
          Add Another List
        </Button>
      )}

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
    </div>
  );
};

export default KanbanBoard;
