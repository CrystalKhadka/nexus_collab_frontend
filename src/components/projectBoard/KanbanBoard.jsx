import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Alert, Button, Snackbar, TextField } from '@mui/material';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { addListToProjectApi, createListApi } from '../../apis/Api';
import TaskList from './TaskList';

// Sortable wrapper component for TaskList
const SortableTaskList = ({ list, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      <TaskList
        list={list}
        {...props}
      />
    </div>
  );
};

const KanbanBoard = ({
  lists,
  setLists,
  projectId,
  onTaskClick,
  onDeleteTask,
  onMoveList,
}) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [listName, setListName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = lists.findIndex((list) => list._id === active.id);
    const newIndex = lists.findIndex((list) => list._id === over.id);

    const newLists = arrayMove(lists, oldIndex, newIndex);
    setLists(newLists);
    onMoveList(active.id, { index: newIndex });
    onMoveList(over.id, { index: oldIndex });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <div className='flex gap-6 p-4 '>
        <SortableContext
          items={lists.map((list) => list._id)}
          strategy={horizontalListSortingStrategy}>
          {lists.map((list, index) => (
            <SortableTaskList
              key={list._id}
              list={list}
              lists={lists}
              setLists={setLists}
              projectId={projectId}
              onTaskClick={onTaskClick}
              searchQuery={''}
              onDeleteTask={onDeleteTask}
              index={index}
            />
          ))}
        </SortableContext>

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
      </div>

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
    </DndContext>
  );
};

export default KanbanBoard;
