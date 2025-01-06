/* eslint-disable jsx-a11y/anchor-is-valid */
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Users2, Workflow } from 'lucide-react';
import React, { useState } from 'react';

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    { icon: Workflow, text: 'Task Management', color: 'text-blue-600' },
    { icon: MessageCircle, text: 'Real-time Chat', color: 'text-orange-600' },
    { icon: Users2, text: 'Team Collaboration', color: 'text-green-600' },
  ];

  return (
    <div
      className='min-h-screen flex flex-col font-sans bg-gradient-to-br from-gray-900 to-gray-800 bg-gray-900 overflow-hidden fixed'
      style={{
        fontFamily: 'Satoshi',
      }}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className='w-full backdrop-blur-md sticky top-0 z-50 min-h-10'>
        <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='h-6 md:h-8'
            alt='Nexus'
            src='images/logo1.png'
          />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className='flex-1 flex items-center bg-gray-800/50 '>
        <div className='container mx-auto '>
          <div className='grid lg:grid-cols-2 gap-8 items-center'>
            {/* Logo Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className='relative'>
              <div className='absolute inset-0 bg-gradient-to-tr from-green-500/30 to-orange-500/30 rounded-full blur-3xl' />
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='relative'>
                <img
                  className='w-4/5 mx-auto drop-shadow-2xl'
                  alt='Nexus Logo'
                  src='images/nexus_logo.png'
                />
              </motion.div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-center lg:text-left'>
              <h1 className='font-bold text-white bg-clip-text bg-gradient-to-r from-white to-gray-400 text-3xl md:text-3xl xl:text-4xl tracking-tight'>
                Nexus Collaboration
              </h1>

              {/* Highlighted Features Section */}
              <div className='space-y-4 mt-6 p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10'>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className='flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors'>
                    <feature.icon className={`${feature.color} w-6 h-6`} />
                    <span className='text-white/90 text-base md:text-lg'>
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className='space-y-3 pt-6 flex flex-col items-center justify-center'>
                <motion.button
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: '#404040',
                  }}
                  className={`group relative w-full md:max-w-md px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-lg md:text-xl text-white font-medium overflow-hidden ${
                    isHovered ? 'shadow-[0px_11px_10px_#7bff00]' : ''
                  }`}
                  onClick={() => (window.location.href = '/register')}>
                  <motion.div
                    className='absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500'
                    initial={{ x: '100%' }}
                    animate={{ x: isHovered ? '0%' : '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className='relative flex items-center justify-center gap-2'>
                    Get Started
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </span>
                </motion.button>

                <p className='text-white/80 text-sm'>
                  Already have an account?{' '}
                  <a
                    href='/login'
                    className='font-medium text-green-400 hover:text-green-300 underline transition-colors'>
                    Sign in
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Wave Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='relative h-24'>
        <svg
          className='absolute bottom-0 w-full h-24 text-gray-900'
          viewBox='0 0 1440 54'
          preserveAspectRatio='none'>
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            d='M0 22L48 27.3C96 32.7 192 43.3 288 43.3C384 43.3 480 32.7 576 27.3C672 22 768 22 864 27.3C960 32.7 1056 43.3 1152 43.3C1248 43.3 1344 32.7 1392 27.3L1440 22V54H0V22Z'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='2'
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default LandingPage;
