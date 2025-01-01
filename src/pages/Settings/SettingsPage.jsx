import { EditOutlined } from '@ant-design/icons';
import { Button, Input, Layout, Modal, Select } from 'antd';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';

const { Content } = Layout;
const { Option } = Select;

const SettingsPage = () => {
  const [projectName, setProjectName] = useState('Project 1');
  const [permissions, setPermissions] = useState({
    commenting: 'Member',
    taskView: 'Member',
    taskEditing: 'Member',
    taskDelete: 'Member',
    taskMove: 'Member',
    listCreate: 'Admin',
    listDelete: 'Admin',
    chat: 'Member',
    channelCreate: 'Admin',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePermissionChange = (key, value) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving changes:', { projectName, permissions });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <Layout className='min-h-screen bg-gray-900 overflow-hidden'>
      <Navbar />
      <Layout className='mt-16 bg-gray-900'>
        <Sidebar />
        <Content className='p-8 bg-gray-800/50 overflow-scroll'>
          <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-8'>
              <h1 className='text-2xl font-semibold text-white'>Settings</h1>
              <Button
                icon={<EditOutlined />}
                className='flex items-center bg-blue-400 border-none text-white hover:bg-blue-500'>
                edit
              </Button>
            </div>

            {/* Project Name */}
            <div className='mb-8'>
              <h2 className='text-xl text-white mb-4'>Project Name</h2>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className='bg-white w-full text-lg'
              />
            </div>

            {/* Permissions */}
            <div className='mb-8'>
              <h2 className='text-xl text-white mb-4'>Permissions</h2>
              <div className='space-y-4'>
                {Object.entries(permissions).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex items-center justify-between'>
                    <span className='text-lg text-white capitalize'>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Select
                      value={value}
                      onChange={(newValue) =>
                        handlePermissionChange(key, newValue)
                      }
                      className='w-48'>
                      <Option value='Member'>Member</Option>
                      <Option value='Admin'>Admin</Option>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4'>
              <Button
                className='bg-red-500 text-white border-none hover:bg-red-600 px-8'
                onClick={() => window.history.back()}>
                Cancel Changes
              </Button>
              <Button
                className='bg-red-500 text-white border-none hover:bg-red-600'
                onClick={handleDelete}>
                Delete
              </Button>
              <Button
                className='bg-green-500 text-white border-none hover:bg-green-600'
                onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Content>
      </Layout>

      {/* Delete Confirmation Modal */}
      <Modal
        title='Delete Project'
        open={showDeleteModal}
        onOk={() => {
          // Handle delete logic here
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
        okText='Delete'
        cancelText='Cancel'
        okButtonProps={{
          className: 'bg-red-500 hover:bg-red-600',
        }}>
        <p>
          Are you sure you want to delete this project? This action cannot be
          undone.
        </p>
      </Modal>
    </Layout>
  );
};

export default SettingsPage;
