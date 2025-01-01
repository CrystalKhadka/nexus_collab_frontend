import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

export const GetStarted = ({ stateProp = 'default' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        w-full max-w-md px-8 py-4 md:py-5
        rounded-3xl text-2xl md:text-4xl text-white font-normal
        transition-all duration-200 transform
        focus:outline-none focus:ring-2 focus:ring-[#7bff00] focus:ring-offset-2
        ${
          stateProp === 'pressed'
            ? 'bg-[#004d68]'
            : 'bg-[#3f3f3f] hover:bg-[#4a4a4a]'
        }
        ${stateProp === 'hover' ? 'shadow-lg shadow-[#7bff00]/30' : ''}
      `}
      aria-label='Get Started'>
      Get Started
    </motion.button>
  );
};

GetStarted.propTypes = {
  stateProp: PropTypes.oneOf(['pressed', 'hover', 'default']),
};

export default GetStarted;
