import { Layout, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import {
  assignTaskApi,
  changeTaskDescApi,
  changeTaskNameApi,
  deleteTaskApi,
  getListsByProjectIdApi,
  getProjectByIdApi,
} from '../../apis/Api';
import KanbanBoard from '../../components/projectBoard/KanbanBoard';
import TaskDetailsModal from '../../components/TaskDetailsModal';
import { useProjectBoard } from '../../hooks/useProjectBoard';

const { Content } = Layout;

const ProjectBoard = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const { id: projectId } = useParams();
  const [lists, setLists] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsModalOpen, setTaskDetailsModalOpen] = useState(false);

  const { handleDragEnd, handleUpdateTask, handleDeleteTask, handleMoveTask } =
    useProjectBoard({ lists, setLists });

  // Fetch project and lists data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await getProjectByIdApi(projectId);
        setCurrentProject(projectResponse.data.data);

        const listsResponse = await getListsByProjectIdApi(projectId);
        setLists(listsResponse.data.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleNameChange = (newName, taskId) => {
    console.log(taskId, newName);
    changeTaskNameApi({ data: { name: newName }, id: taskId })
      .then(async (res) => {
        const projectResponse = await getProjectByIdApi(projectId);
        setCurrentProject(projectResponse.data.data);

        const listsResponse = await getListsByProjectIdApi(projectId);
        setLists(listsResponse.data.data);
        message.success('Task name updated successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDescriptionChange = (newDescription, taskId) => {
    console.log(taskId, newDescription);
    changeTaskDescApi({ data: { description: newDescription }, id: taskId })
      .then(async (res) => {
        const projectResponse = await getProjectByIdApi(projectId);
        setCurrentProject(projectResponse.data.data);

        const listsResponse = await getListsByProjectIdApi(projectId);
        setLists(listsResponse.data.data);
        message.success('Task description updated successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAssignTask = (id, data) => {
    assignTaskApi(id, data)
      .then(async (res) => {
        message.success('Task assigned successfully');
        const projectResponse = await getProjectByIdApi(projectId);
        setCurrentProject(projectResponse.data.data);

        const listsResponse = await getListsByProjectIdApi(projectId);
        setLists(listsResponse.data.data);
        message.success('Task description updated successfully');
      })
      .catch((err) => console.log(err));
  };

  const onDeleteTask = async (taskId) => {
    try {
      deleteTaskApi(taskId)
        .then(async (res) => {
          const projectResponse = await getProjectByIdApi(projectId);
          setCurrentProject(projectResponse.data.data);

          const listsResponse = await getListsByProjectIdApi(projectId);
          setLists(listsResponse.data.data);
          message.success('Task deleted successfully');
        })
        .catch(() => {
          message.error('Something went wrong');
        });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Layout className='min-h-screen bg-gray-900'>
      <Layout className=' bg-gray-900'>
        <Content className='p-6 overflow-x-auto bg-gray-800/50 pt-10'>
          <DragDropContext onDragEnd={handleDragEnd}>
            <KanbanBoard
              lists={lists}
              setLists={setLists}
              projectId={projectId}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setTaskDetailsModalOpen(true);
              }}
              onDeleteTask={onDeleteTask}
            />
          </DragDropContext>
        </Content>
      </Layout>

      <TaskDetailsModal
        open={taskDetailsModalOpen}
        onClose={() => setTaskDetailsModalOpen(false)}
        selectedTask={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={(taskId) => {
          setTaskDetailsModalOpen(false);
          onDeleteTask(taskId);
        }}
        onMoveTask={handleMoveTask}
        handleNameChange={handleNameChange}
        handleDescriptionChange={handleDescriptionChange}
        handleAssign={handleAssignTask}
        handleDateChange={() => {}}
      />
    </Layout>
  );
};

export default ProjectBoard;
