import { Layout } from 'antd';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, ListTodo, Plus, Users } from 'lucide-react';
import React from 'react';

const { Content } = Layout;

const DashboardPage = () => {
  const projectCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  const ProjectCard = ({ title, members, lists, image, delay }) => (
    <motion.div
      variants={projectCardVariants}
      initial='initial'
      animate='animate'
      whileHover='hover'
      onClick={() => {
        window.location.href = '/board';
      }}
      transition={{ duration: 0.4, delay }}
      className='bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-shadow'>
      <div className='relative h-48 overflow-hidden'>
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

  return (
    <Layout
      className='min-h-screen'
      style={{ backgroundColor: '#828282' }}>
      {/* Navbar */}
      <nav className='w-full bg-gray-800/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <motion.img
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='h-8'
              src='/images/logo1.png'
              alt='Nexus'
            />

            <div className='flex items-center gap-6'>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className='relative'>
                <Bell className='w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors' />
                <span className='absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center text-white'>
                  3
                </span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className='flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-colors'>
                <img
                  src='https://ui-avatars.com/api/?name=Crystal+Khadka&background=random'
                  alt='Crystal Khadka'
                  className='w-8 h-8 rounded-full'
                />
                <span>Crystal Khadka</span>
                <ChevronDown className='w-4 h-4' />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Content className='p-6'>
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
              <ProjectCard
                title='Project 1'
                members={2}
                lists={2}
                image='/images/image.png'
                delay={0.1}
              />
              {/* Add more project cards as needed */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
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
  );
};

export default DashboardPage;
