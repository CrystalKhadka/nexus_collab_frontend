import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { getListsByProjectIdApi, getProjectByIdApi } from '../../apis/Api';
import Navbar from '../../components/Navbar';
import KanbanBoard from '../../components/projectBoard/KanbanBoard';
import { Sidebar } from '../../components/Sidebar';
import TaskDetailsModal from '../../components/TaskDetailsModal';
import { useProjectBoard } from '../../hooks/useProjectBoard';

const { Content } = Layout;

const ProjectBoard = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const { id: projectId } = useParams();
  const [lists, setLists] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsModalOpen, setTaskDetailsModalOpen] = useState(false);

  const {
    handleDragEnd,
    handleUpdateTask,
    handleDeleteTask,
    handleMoveTask,
    handleNameChange,
  } = useProjectBoard({ lists, setLists });

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

  return (
    <Layout className='min-h-screen bg-gray-900'>
      <Navbar />

      <Layout className='mt-16 bg-gray-900'>
        <Sidebar currentProject={currentProject} />

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
            />
          </DragDropContext>
        </Content>
      </Layout>

      <TaskDetailsModal
        open={taskDetailsModalOpen}
        onClose={() => setTaskDetailsModalOpen(false)}
        selectedTask={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onMoveTask={handleMoveTask}
        handleNameChange={handleNameChange}
      />
    </Layout>
  );
};

export default ProjectBoard;
