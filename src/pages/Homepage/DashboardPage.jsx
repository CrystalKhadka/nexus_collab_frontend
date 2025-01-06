import { Layout, message } from 'antd';
import { motion } from 'framer-motion';
import { ListTodo, Plus, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  createProjectApi,
  getMyProjectsApi,
  projectImageUrl,
  uploadProjectImageApi,
} from '../../apis/Api.js';
import CreateProjectModal from '../../components/CreateProjectModal.jsx';
import Navbar from '../../components/Navbar.jsx';
const { Content } = Layout;

const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    // Fetch my projects
    getMyProjectsApi()
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setMyProjects(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const projectCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } },
  };
  const [imageName, setImageName] = useState([]);

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
          className='w-full h-full object-cover '
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
    console.log(data);
    const projectData = {
      projectName: data.name,
      projectDescription: data.description,
      projectImage: imageName,
    };
    console.log(projectData);

    createProjectApi(projectData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log('Project created successfully');
          message.success('Project created successfully');
          setIsCreateModalOpen(false);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error('Error creating project');
      });
  };

  const handleImageUpload = async (data) => {
    // Upload image to backend
    console.log('Uploading image');
    console.log(data);
    const formData = new FormData();
    formData.append('projectImage', data);
    console.log(formData);
    try {
      uploadProjectImageApi(formData)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            console.log('Image uploaded successfully');
            setImageName(response.data.image);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error uploading image');
      return null;
    }
  };

  return (
    <Layout className='min-h-screen bg-gray-900'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Layout className='mt-16 bg-gray-900'>
        <Content className='p-8 bg-gray-800/50'>
          <div className='container mx-auto'>
            {/* My Projects Section */}
            <div className='mb-12'>
              <div className='flex justify-between items-center mb-6'>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className='text-2xl font-bold text-white'>
                  My Projects
                </motion.h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center'>
                {myProjects.map((project, index) => (
                  <ProjectCard
                    title={project.name}
                    members={project.members.length}
                    lists={project.lists.length}
                    image={projectImageUrl + project.image}
                    delay={0.1}
                    id={project._id}
                  />
                ))}
                {/* Add more project cards as needed */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    console.log('Create project clicked');
                    setIsCreateModalOpen(true);
                  }}
                  style={{
                    height: 'fit-content',
                    width: 'fit-content',
                  }}
                  className='flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2 rounded-2xl transition-colors '>
                  <Plus className='w-5 h-5' />
                  Create More
                </motion.button>
              </div>
            </div>
            {/* Joined Projects Section */}
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='text-2xl font-bold text-white mb-6'>
                Joined Projects
              </motion.h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                <ProjectCard
                  title='Project 2'
                  members={2}
                  lists={1}
                  image='/images/image.png'
                  delay={0.2}
                />
                {/* Add more joined project cards as needed */}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        onImageUpload={handleImageUpload}
      />
    </Layout>
  );
};

export default DashboardPage;
