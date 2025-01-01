import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Layout, Modal } from 'antd';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
const { Content } = Layout;

const MembersPage = () => {
  const [members] = useState([
    { id: 1, name: 'Crystal Khadka', role: 'Admin', tasksAssigned: '0/1' },
    { id: 2, name: 'Rushmit Karki', role: 'Member', tasksAssigned: '0/1' },
  ]);

  const [joinRequests] = useState([
    { id: 1, name: 'Safal Pandey' },
    { id: 2, name: 'Pramesh Pathak' },
  ]);

  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

  const ActionButton = ({ text, variant }) => {
    const getButtonStyle = () => {
      switch (variant) {
        case 'leave':
        case 'reject':
          return 'bg-red-500 hover:bg-red-600';
        case 'remove':
          return 'bg-red-500 hover:bg-red-600';
        case 'accept':
          return 'bg-green-500 hover:bg-green-600';
        case 'hold':
          return 'bg-yellow-400 hover:bg-yellow-500';
        default:
          return 'bg-gray-500 hover:bg-gray-600';
      }
    };

    return (
      <button
        className={`px-6 py-2 rounded-full text-white font-medium transition-colors ${getButtonStyle()}`}>
        {text}
      </button>
    );
  };

  return (
    <Layout className='min-h-screen bg-gray-900'>
      <Navbar />
      <Layout className='mt-16 bg-gray-900'>
        <Sidebar />
        <Content className='p-8 bg-gray-800/50'>
          <div className='max-w-6xl mx-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-center gap-4'>
                <h1 className='text-2xl font-semibold text-white'>Project 1</h1>
                <Button
                  icon={<EditOutlined />}
                  className='flex items-center bg-blue-500 border-none text-white hover:bg-blue-600'>
                  Edit
                </Button>
              </div>
              <Button
                onClick={() => setIsInviteModalVisible(true)}
                className='bg-gray-200 hover:bg-gray-300 border-none text-gray-800 font-medium'>
                Invite Members
              </Button>
            </div>

            {/* Project Members Section */}
            <div className='mb-8'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl text-white'>Project Members</h2>
                <Button className='bg-white border-none'>Filter</Button>
              </div>

              <div className='space-y-4'>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className='flex items-center justify-between py-4 border-b border-white/10'>
                    <span className='text-lg text-white'>{member.name}</span>
                    <div className='flex items-center gap-16'>
                      <span className='text-gray-300'>
                        Task Assigned {member.tasksAssigned}
                      </span>
                      <span className='w-32 text-gray-300'>{member.role}</span>
                      <ActionButton
                        text={member.role === 'Admin' ? 'Leave' : 'Remove'}
                        variant={member.role === 'Admin' ? 'leave' : 'remove'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Requests Section */}
            <div>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl text-white'>Join Request</h2>
                <Button className='bg-white border-none'>Show All</Button>
              </div>

              <div className='space-y-4'>
                {joinRequests.map((request) => (
                  <div
                    key={request.id}
                    className='flex items-center justify-between py-4 border-b border-white/10'>
                    <span className='text-lg text-white'>{request.name}</span>
                    <div className='flex items-center gap-4'>
                      <ActionButton
                        text='Accept'
                        variant='accept'
                      />
                      <ActionButton
                        text='Hold'
                        variant='hold'
                      />
                      <ActionButton
                        text='Reject'
                        variant='reject'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invite Members Modal */}
          <Modal
            title='Invite Members'
            open={isInviteModalVisible}
            onCancel={() => setIsInviteModalVisible(false)}
            footer={null}>
            <div className='p-4'>
              <Input
                prefix={<SearchOutlined className='text-gray-400' />}
                placeholder='Search members by name or email'
                className='mb-4'
              />
              <div className='space-y-4'>
                {/* Add member search results here */}
              </div>
            </div>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MembersPage;
