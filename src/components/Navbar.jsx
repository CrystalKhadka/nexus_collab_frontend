// Navbar.jsx
import { motion } from 'framer-motion';
import { Bell, ChevronDown } from 'lucide-react';
import React from 'react';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='fixed  top-0 w-full bg-gray-900/90 backdrop-blur-xl border-b border-white/10 z-50'>
      <div className='container mx-auto px-8 py-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-8'>
            <img
              className='h-8'
              src='/images/logo1.png'
              alt='Logo'
            />
          </div>

          <div className='flex items-center gap-6'>
            <div className='relative'>
              <Bell className='w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors' />
              <span className='absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center text-white font-medium'>
                3
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className='flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 px-4 py-2 rounded-xl transition-colors'>
              <img
                src='/images/download.jpg'
                alt='User Avatar'
                className='w-8 h-8 rounded-full border border-white/10'
              />
              <span className='text-white font-medium'>Crystal Khadka</span>
              <ChevronDown className='w-4 h-4 text-gray-400' />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
