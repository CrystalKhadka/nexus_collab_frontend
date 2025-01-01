import { Layout } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  HashIcon,
  Image,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Users,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';

const DateDivider = ({ date }) => (
  <div className='flex items-center justify-center my-6'>
    <div className='bg-gray-700/50 px-4 py-1 rounded-full'>
      <span className='text-xs text-gray-400'>{date}</span>
    </div>
  </div>
);

const ChatMessage = ({ message, sender, timestamp, avatar, isOwn }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-start space-x-3 mb-2 group ${
      isOwn ? 'flex-row-reverse space-x-reverse' : ''
    }`}>
    <img
      src={avatar || '/api/placeholder/40/40'}
      alt={sender}
      className='w-10 h-10 rounded-full'
    />
    <div className={`flex-1 ${isOwn ? 'text-right' : ''}`}>
      <div
        className={`flex items-center space-x-2 ${isOwn ? 'justify-end' : ''}`}>
        <span className='font-medium text-white'>{sender}</span>
        <span className='text-xs text-gray-400'>{timestamp}</span>
      </div>
      <div
        className={`mt-1 inline-block ${
          isOwn ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-100'
        } p-3 rounded-lg max-w-2xl`}>
        {message}
      </div>
    </div>
  </motion.div>
);

const ChannelButton = ({ name, active, unreadCount, mentions }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
      active
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
    }`}>
    <div className='flex items-center'>
      <HashIcon className='w-4 h-4 mr-2' />
      <span>{name}</span>
    </div>
    <div className='flex items-center space-x-2'>
      {unreadCount > 0 && (
        <span className='px-2 py-0.5 text-xs bg-gray-600 rounded-full'>
          {unreadCount}
        </span>
      )}
      {mentions > 0 && (
        <span className='px-2 py-0.5 text-xs bg-red-500 text-white rounded-full'>
          @{mentions}
        </span>
      )}
    </div>
  </motion.div>
);

const ChatPage = () => {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Crystal Khadka',
      message: 'Hi, Welcome to general',
      timestamp: '12:30 PM',
      avatar: '/api/placeholder/40/40',
      date: 'Today',
    },
    {
      id: 2,
      sender: 'Rushmit Karki',
      message: "Hey everyone! How's the project coming along?",
      timestamp: '12:35 PM',
      avatar: '/api/placeholder/40/40',
      date: 'Today',
    },
    {
      id: 3,
      sender: 'Crystal Khadka',
      message:
        'The frontend is almost complete. Just need to polish some UI elements.',
      timestamp: '12:36 PM',
      avatar: '/api/placeholder/40/40',
      isOwn: true,
      date: 'Today',
    },
  ]);

  const messagesEndRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e) => {
    setIsScrolled(
      e.target.scrollTop < e.target.scrollHeight - e.target.clientHeight - 100
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Layout className='flex h-screen bg-gray-900'>
      <Navbar />

      <div className='flex w-full mt-16'>
        <Sidebar />

        {/* Channels Sidebar */}
        <div className='w-64 bg-gray-800/50 border-r border-gray-700'>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-white'>Channels</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className='p-1 hover:bg-gray-700 rounded-lg'>
                <Plus className='w-5 h-5 text-gray-400 hover:text-white' />
              </motion.button>
            </div>

            <div className='space-y-1'>
              <ChannelButton
                name='general'
                active
                unreadCount={3}
              />
              <ChannelButton
                name='project'
                mentions={2}
              />
              <ChannelButton
                name='random'
                unreadCount={1}
              />
            </div>

            <div className='mt-8'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold text-white'>Members</h2>
                <span className='text-xs text-gray-400'>12 online</span>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center p-2 hover:bg-gray-700/50 rounded-lg cursor-pointer group'>
                  <div className='relative'>
                    <img
                      src='/api/placeholder/32/32'
                      alt='Crystal'
                      className='w-8 h-8 rounded-full'
                    />
                    <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800'></div>
                  </div>
                  <span className='ml-2 text-gray-300 group-hover:text-white'>
                    Crystal Khadka
                  </span>
                </div>
                <div className='flex items-center p-2 hover:bg-gray-700/50 rounded-lg cursor-pointer group'>
                  <div className='relative'>
                    <img
                      src='/api/placeholder/32/32'
                      alt='Rushmit'
                      className='w-8 h-8 rounded-full'
                    />
                    <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800'></div>
                  </div>
                  <span className='ml-2 text-gray-300 group-hover:text-white'>
                    Rushmit Karki
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className='flex-1 flex flex-col'>
          {/* Channel Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50'>
            <div className='flex items-center space-x-4'>
              <HashIcon className='w-5 h-5 text-gray-400' />
              <div>
                <h2 className='text-lg font-medium text-white'>general</h2>
                <p className='text-xs text-gray-400'>12 members, 3 online</p>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <button
                className='p-2 hover:bg-gray-700 rounded-lg tooltip'
                data-tip='Members'>
                <Users className='w-5 h-5 text-gray-400 hover:text-white' />
              </button>
              <button
                className='p-2 hover:bg-gray-700 rounded-lg tooltip'
                data-tip='Voice Call'>
                <Phone className='w-5 h-5 text-gray-400 hover:text-white' />
              </button>
              <button
                className='p-2 hover:bg-gray-700 rounded-lg tooltip'
                data-tip='Search'>
                <Search className='w-5 h-5 text-gray-400 hover:text-white' />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className='flex-1 overflow-y-auto p-6 space-y-4'
            onScroll={handleScroll}>
            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                {(index === 0 || messages[index - 1].date !== msg.date) && (
                  <DateDivider date={msg.date} />
                )}
                <ChatMessage {...msg} />
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom Button */}
          <AnimatePresence>
            {isScrolled && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToBottom}
                className='absolute bottom-24 right-8 bg-gray-700 text-white p-2 rounded-full shadow-lg'>
                <ChevronDown className='w-5 h-5' />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Message Input */}
          <div className='p-4 border-t border-gray-700 bg-gray-800/50'>
            <div className='flex items-center space-x-2 bg-gray-700/50 rounded-lg p-2'>
              <button className='p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white'>
                <Plus className='w-5 h-5' />
              </button>
              <input
                type='text'
                placeholder='Message #general'
                className='flex-1 bg-transparent px-3 py-2 outline-none text-white placeholder-gray-400'
              />
              <div className='flex items-center space-x-1'>
                <button className='p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white'>
                  <Paperclip className='w-5 h-5' />
                </button>
                <button className='p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white'>
                  <Image className='w-5 h-5' />
                </button>
                <button className='p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white'>
                  <Smile className='w-5 h-5' />
                </button>
                <button className='p-2 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white'>
                  <Send className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
