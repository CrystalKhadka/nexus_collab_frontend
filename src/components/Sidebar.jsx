import Sider from 'antd/es/layout/Sider';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  Folder,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Timer,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// SidebarLink Component
const SidebarLink = ({ icon: Icon, text, to, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ x: 5 }}
        className={`flex items-center gap-3 ${
          isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
        } px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200`}>
        <Icon className='w-5 h-5' />
        {!collapsed && <span className='font-medium'>{text}</span>}
      </motion.div>
    </Link>
  );
};

// Project Header Component
const ProjectHeader = ({ collapsed }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className='px-4 py-3 mb-4'>
    <div className='flex items-center gap-3'>
      <div className='bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg'>
        <Folder className='w-5 h-5 text-white' />
      </div>
      {!collapsed && (
        <div>
          <h1 className='text-white font-semibold'>Project 1</h1>
          <p className='text-xs text-gray-400'>Workspace</p>
        </div>
      )}
    </div>
  </motion.div>
);

// Navigation Links Configuration
const navigationLinks = [
  { icon: LayoutDashboard, text: 'Boards', path: '/board' },
  { icon: MessageSquare, text: 'Chat', path: '/chat' },
  { icon: Users, text: 'Members', path: '/members' },
  { icon: Settings, text: 'Settings', path: '/settings' },
];

const additionalLinks = [
  { icon: Calendar, text: 'Calendar', path: '/calendar' },
  { icon: Timer, text: 'Timeline', path: '/timeline' },
];

// Sidebar Component
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className='bg-gray-800/30 backdrop-blur-md border-r border-white/10 transition-all duration-300 '
      width={240}
      collapsedWidth={80}
      trigger={
        <motion.button
          whileHover={{ scale: 1.1 }}
          className='absolute -right-3 top-6 bg-gray-700 hover:bg-gray-600 p-1 rounded-full border border-white/10'>
          <ChevronLeft
            className={`w-4 h-4 text-white transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </motion.button>
      }>
      <div className='py-4 h-full flex flex-col'>
        <ProjectHeader collapsed={collapsed} />

        {/* Main Navigation */}
        <div className='space-y-1 px-2'>
          {navigationLinks.map((link) => (
            <SidebarLink
              key={link.path}
              icon={link.icon}
              text={link.text}
              to={link.path}
              collapsed={collapsed}
            />
          ))}
        </div>

        {/* Divider */}
        <div className='border-b border-white/10 my-4 mx-4' />

        {/* Additional Links */}
        <div className='space-y-1 px-2'>
          {additionalLinks.map((link) => (
            <SidebarLink
              key={link.path}
              icon={link.icon}
              text={link.text}
              to={link.path}
              collapsed={collapsed}
            />
          ))}
        </div>

        {/* Bottom Section */}
      </div>
    </Sider>
  );
};

export { Sidebar, SidebarLink };
