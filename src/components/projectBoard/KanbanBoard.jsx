import {
  DndContext,
  DragOverlay,
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
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import {
  addListToProjectApi,
  createListApi,
  moveListApi,
  moveTaskApi,
} from '../../apis/Api';
import TaskCard from './TaskCard';
import TaskList from './TaskList';

const SortableList = ({ list, children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list._id });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      component={motion.div}
      layout
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      sx={{
        height: '100%',
        bgcolor: 'rgba(31, 41, 55, 0.3)',
        backdropFilter: 'blur(8px)',
        borderRadius: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
      }}>
      {children}
    </Box>
  );
};

const KanbanBoard = ({
  lists,
  setLists,
  projectId,
  onTaskClick,
  onDeleteTask,
  onMoveList,
  onDeleteList,
  onRenameList,
  onMoveTask,
}) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [listName, setListName] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDragStart = (event) => {
    const { active } = event;

    const draggedList = lists.find((list) => list._id === active.id);
    if (draggedList) {
      setActiveList(draggedList);
      return;
    }

    const listWithTask = lists.find((list) =>
      list.tasks.some((task) => task._id === active.id)
    );
    const task = listWithTask?.tasks.find((t) => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      setActiveList(null);
      return;
    }

    if (activeList) {
      const oldIndex = lists.findIndex((list) => list._id === active.id);
      const newIndex = lists.findIndex((list) => list._id === over.id);

      if (oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists);
        try {
          await moveListApi(active.id, { index: newIndex });
        } catch (error) {
          console.error('Error moving list:', error);
          showSnackbar('Failed to move list', 'error');
        }
      }
      setActiveList(null);
      return;
    }

    const activeListWithTask = lists.find((list) =>
      list.tasks.some((task) => task._id === active.id)
    );
    const overList =
      lists.find((list) => list.tasks.some((task) => task._id === over.id)) ||
      lists.find((list) => list._id === over.id);

    if (!activeListWithTask || !overList) {
      setActiveTask(null);
      return;
    }

    const activeTask = activeListWithTask.tasks.find(
      (task) => task._id === active.id
    );
    const overTask = overList.tasks.find((task) => task._id === over.id);

    if (activeListWithTask._id === overList._id) {
      const oldIndex = activeListWithTask.tasks.findIndex(
        (task) => task._id === active.id
      );
      const newIndex = overList.tasks.findIndex((task) => task._id === over.id);

      const newLists = lists.map((list) => {
        if (list._id === activeListWithTask._id) {
          const newTasks = arrayMove(list.tasks, oldIndex, newIndex);
          return { ...list, tasks: newTasks };
        }
        return list;
      });

      setLists(newLists);

      try {
        await moveTaskApi(activeTask._id, {
          listId: activeListWithTask._id,
          index: newIndex,
        });
      } catch (error) {
        console.error('Error updating task order:', error);
        showSnackbar('Failed to update task order', 'error');
      }
    } else {
      const newLists = lists.map((list) => {
        if (list._id === activeListWithTask._id) {
          return {
            ...list,
            tasks: list.tasks.filter((task) => task._id !== active.id),
          };
        }
        if (list._id === overList._id) {
          const overTaskIndex = overTask
            ? list.tasks.findIndex((task) => task._id === over.id)
            : list.tasks.length;
          const newTasks = [...list.tasks];
          newTasks.splice(overTaskIndex, 0, activeTask);
          return { ...list, tasks: newTasks };
        }
        return list;
      });

      setLists(newLists);

      try {
        await moveTaskApi(activeTask._id, {
          listId: overList._id,
          index: overTask
            ? overList.tasks.indexOf(overTask)
            : overList.tasks.length,
        });
      } catch (error) {
        console.error('Error moving task:', error);
        showSnackbar('Failed to move task', 'error');
      }
    }

    setActiveTask(null);
  };

  const handleAddList = async (e) => {
    e?.preventDefault();

    if (!listName.trim()) {
      showSnackbar('List name cannot be empty', 'error');
      return;
    }

    try {
      const listResponse = await createListApi({
        name: listName,
        projectId: projectId,
        index: lists.length + 1,
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
      showSnackbar(
        error.response?.data?.message || 'Failed to add list',
        'error'
      );
    } finally {
      setListName('');
      setIsAddingList(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          p: 3,
          minHeight: 'calc(100vh - 64px)',
          overflowX: 'auto',
          bgcolor: 'background.default',
        }}>
        <SortableContext
          items={lists.map((list) => list._id)}
          strategy={horizontalListSortingStrategy}>
          {lists.map((list) => (
            <SortableList
              key={list._id}
              list={list}>
              <TaskList
                list={list}
                lists={lists}
                setLists={setLists}
                projectId={projectId}
                onTaskClick={onTaskClick}
                searchQuery={searchQuery}
                onDeleteTask={onDeleteTask}
                onMoveList={onMoveList}
                onDeleteList={onDeleteList}
                onRenameList={onRenameList}
              />
            </SortableList>
          ))}
        </SortableContext>

        {isAddingList ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            sx={{
              minWidth: '320px',
              maxWidth: '320px',
            }}>
            <form
              onSubmit={handleAddList}
              className='flex gap-2 border-dashed border-2 border-white/20 p-4 rounded-xl'>
              <TextField
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder='Enter list title'
                sx={{
                  flexGrow: 1,
                  '& .MuiInputBase-root': {
                    color: 'white',
                    bgcolor: 'rgba(31, 41, 55, 0.8)',
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
          </Box>
        ) : (
          <Button
            onClick={() => setIsAddingList(true)}
            component={motion.button}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            sx={{
              minWidth: '320px',
              maxHeight: '48px',
              py: 2,
              borderRadius: 3,
              bgcolor: 'rgba(31, 41, 55, 0.3)',
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
      </Box>

      <DragOverlay>
        {activeTask ? (
          <Box sx={{ width: 320 }}>
            <TaskCard task={activeTask} />
          </Box>
        ) : activeList ? (
          <Box
            sx={{
              width: 320,
              bgcolor: 'rgba(31, 41, 55, 0.3)',
              backdropFilter: 'blur(8px)',
              borderRadius: 3,
              p: 2,
              opacity: 0.8,
            }}>
            <TaskList
              list={activeList}
              lists={lists}
              setLists={setLists}
              projectId={projectId}
              onTaskClick={onTaskClick}
              searchQuery={searchQuery}
              onDeleteTask={onDeleteTask}
              onMoveList={onMoveList}
            />
          </Box>
        ) : null}
      </DragOverlay>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DndContext>
  );
};

export default KanbanBoard;
