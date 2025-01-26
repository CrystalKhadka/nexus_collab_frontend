import { Alert, Box, Button, Container, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { ListTodo, Plus, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  createProjectApi,
  getJoinedProjectsApi,
  getMyProjectsApi,
  projectImageUrl,
  uploadProjectImageApi,
} from '../../apis/Api.js';
import CreateProjectModal from '../../components/CreateProjectModal.jsx';
import { useSocket } from '../../components/socketContext/SocketContext.jsx';

const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [joinedProject, setJoinedProjects] = useState([]);
  const [imageName, setImageName] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { socket } = useSocket();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [myProjectsResponse, joinedProjectsResponse] = await Promise.all([
          getMyProjectsApi(),
          getJoinedProjectsApi(),
        ]);

        if (myProjectsResponse.status === 200) {
          setMyProjects(myProjectsResponse.data.data);
        }

        if (joinedProjectsResponse.status === 200) {
          setJoinedProjects(joinedProjectsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        showSnackbar('Failed to fetch projects', 'error');
      }
    };

    fetchProjects();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const projectCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  const ProjectCard = ({ title, members, lists, image, delay, id }) => (
    <motion.div
      variants={projectCardVariants}
      initial='initial'
      animate='animate'
      whileHover='hover'
      onClick={() => {
        window.location.href = `/board/${id}`;
      }}
      transition={{ duration: 0.4, delay }}
      className='bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-shadow'>
      <div className='relative h-48 overflow-hidden bg-white'>
        <img
          src={image}
          alt={title}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent' />
      </div>
      <div className='p-4'>
        <h3 className='text-white text-xl font-semibold mb-2'>{title}</h3>
        <div className='flex items-center gap-4 text-gray-300'>
          <div className='flex items-center gap-1'>
            <Users className='w-4 h-4' />
            <span>{members} members</span>
          </div>
          <div className='flex items-center gap-1'>
            <ListTodo className='w-4 h-4' />
            <span>{lists} list</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleCreateProject = async (data) => {
    try {
      const projectData = {
        projectName: data.name,
        projectDescription: data.description,
        projectImage: imageName,
      };

      const response = await createProjectApi(projectData);

      if (response.status === 201) {
        showSnackbar('Project created successfully');
        setIsCreateModalOpen(false);
        // Refresh projects list
        const myProjectsResponse = await getMyProjectsApi();
        if (myProjectsResponse.status === 200) {
          setMyProjects(myProjectsResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showSnackbar('Error creating project', 'error');
    }
  };

  const handleImageUpload = async (data) => {
    try {
      const formData = new FormData();
      formData.append('projectImage', data);

      const response = await uploadProjectImageApi(formData);

      if (response.status === 200) {
        setImageName(response.data.image);
        return response.data.image;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar('Error uploading image', 'error');
      return null;
    }
  };

  return (
    <Box className='min-h-screen bg-gray-900'>
      <Box className='bg-gray-800/50 p-8 min-h-screen'>
        <Container sx={{ maxWidth: '100%', padding: 0, height: '100%' }}>
          {/* My Projects Section */}
          <Box className='mb-12'>
            <Box className='flex justify-between items-center mb-6'>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='text-2xl font-bold text-white'>
                My Projects
              </motion.h2>
            </Box>
            <Box className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center'>
              {myProjects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  title={project.name}
                  members={project.members.length}
                  lists={project.lists.length}
                  image={projectImageUrl + project.image}
                  delay={0.1}
                  id={project._id}
                />
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  height: 'fit-content',
                  width: 'fit-content',
                }}>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className='flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2 rounded-2xl transition-colors'>
                  <Plus className='w-5 h-5' />
                  Create More
                </Button>
              </motion.div>
            </Box>
          </Box>

          {/* Joined Projects Section */}
          <Box>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='text-2xl font-bold text-white mb-6'>
              Joined Projects
            </motion.h2>
            <Box className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {joinedProject.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  title={project.name}
                  members={project.members.length}
                  lists={project.lists.length}
                  image={projectImageUrl + project.image}
                  delay={0.1}
                  id={project._id}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        onImageUpload={handleImageUpload}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            backgroundColor: 'rgb(31, 41, 55)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;
