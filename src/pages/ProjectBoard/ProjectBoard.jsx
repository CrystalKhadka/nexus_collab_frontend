import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Snackbar,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addRequirementApi,
  assignDateApi,
  assignTaskApi,
  changeTaskDescApi,
  changeTaskLabelApi,
  changeTaskNameApi,
  changeTaskPriorityApi,
  changeTaskStatusApi,
  deleteListApi,
  deleteTaskApi,
  getListsByProjectIdApi,
  getProjectByIdApi,
  joinOrLeaveTaskApi,
  moveListApi,
  updateCoverImageApi,
  updateListApi,
} from '../../apis/Api';
import KanbanBoard from '../../components/projectBoard/KanbanBoard';
import TaskDetailsModal from '../../components/TaskDetailsModal';
import { useProjectBoard } from '../../hooks/useProjectBoard';

const ProjectBoard = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const { id: projectId } = useParams();
  const [lists, setLists] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsModalOpen, setTaskDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const { handleDragEnd, handleUpdateTask, handleMoveTask } = useProjectBoard({
    lists,
    setLists,
  });

  const showMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch project and lists data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [projectResponse, listsResponse] = await Promise.all([
          getProjectByIdApi(projectId),
          getListsByProjectIdApi(projectId),
        ]);

        setCurrentProject(projectResponse.data.data);
        setLists(listsResponse.data.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError(
          error.response?.data?.message || 'Failed to load project data'
        );
        showMessage(
          error.response?.data?.message || 'Failed to load project data',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleNameChange = async (newName, taskId) => {
    try {
      const response = await changeTaskNameApi({
        data: { name: newName },
        id: taskId,
      });
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update task name',
        'error'
      );
    }
  };

  const handleDescriptionChange = async (newDescription, taskId) => {
    try {
      const response = await changeTaskDescApi({
        data: { description: newDescription },
        id: taskId,
      });
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update description',
        'error'
      );
    }
  };

  const handleAssignTask = async (id, data) => {
    try {
      const response = await assignTaskApi(id, data);
      showMessage(response.data.message);
      setSelectedTask(response.data.data);

      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to assign task',
        'error'
      );
    }
  };

  const onDeleteTask = async (taskId) => {
    try {
      await deleteTaskApi(taskId);
      showMessage('Task deleted successfully');

      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
      setTaskDetailsModalOpen(false);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to delete task',
        'error'
      );
    }
  };

  const handleDateChange = async (id, type, date) => {
    try {
      const data = {
        date: date.toISOString().split('T')[0],
        type: type,
      };
      const response = await assignDateApi(id, data);
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update date',
        'error'
      );
    }
  };

  const handleLabelChange = async (id, data) => {
    try {
      const response = await changeTaskLabelApi(id, data);
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update label',
        'error'
      );
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await changeTaskStatusApi(id, { status });
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update status',
        'error'
      );
    }
  };

  const handlePriorityChange = async (id, priority) => {
    try {
      const response = await changeTaskPriorityApi(id, { priority });
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update priority',
        'error'
      );
    }
  };

  const handleCoverChange = async (taskId, file) => {
    try {
      const formData = new FormData();
      formData.append('cover', file);
      const response = await updateCoverImageApi(taskId, formData);
      setSelectedTask(response.data.data);
      showMessage(response.data.message);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update cover',
        'error'
      );
    }
  };

  const handleRequirementChange = async (taskId, data) => {
    try {
      const response = await addRequirementApi(taskId, data);
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
      return data;
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to update requirements',
        'error'
      );
      return null;
    }
  };

  const handleMoveList = async (sourceListId, data) => {
    try {
      const response = await moveListApi(sourceListId, data);
      showMessage(response.data.message);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to move list',
        'error'
      );
    }
  };

  const handleJoinOrLeaveTask = async (taskId) => {
    try {
      const response = await joinOrLeaveTaskApi(taskId, {});
      showMessage(response.data.message);
      setSelectedTask(response.data.data);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to join or leave task',
        'error'
      );
    }
  };
  const handleDeleteList = async (listId) => {
    try {
      await deleteListApi(listId);
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete list',
        severity: 'error',
      });
    }
  };

  const handleRenameList = async (listId, name) => {
    try {
      await updateListApi(listId, { name });
      const listsResponse = await getListsByProjectIdApi(projectId);
      setLists(listsResponse.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to rename list',
        severity: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
        bgcolor='background.default'>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
        bgcolor='background.default'>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          mt: 2,
          mb: 2,
          overflowX: 'auto',
        }}>
        <KanbanBoard
          lists={lists}
          setLists={setLists}
          projectId={projectId}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setTaskDetailsModalOpen(true);
          }}
          onDeleteTask={onDeleteTask}
          onMoveList={handleMoveList}
          onDeleteList={handleDeleteList}
          onRenameList={handleRenameList}
        />
      </Container>

      <TaskDetailsModal
        open={taskDetailsModalOpen}
        onClose={() => setTaskDetailsModalOpen(false)}
        selectedTask={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={onDeleteTask}
        onMoveList={handleMoveList}
        onMoveTask={handleMoveTask}
        handleNameChange={handleNameChange}
        handleDescriptionChange={handleDescriptionChange}
        handleAssign={handleAssignTask}
        handleDateChange={handleDateChange}
        handleLabelChange={handleLabelChange}
        handleStatusChange={handleStatusChange}
        handlePriorityChange={handlePriorityChange}
        handleCoverChange={handleCoverChange}
        handleRequirementChange={handleRequirementChange}
        handleJoinOrLeaveTask={handleJoinOrLeaveTask}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant='filled'>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectBoard;
