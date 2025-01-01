import { Modal } from 'antd';
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Eye,
  Link2,
  ListTodo,
  LogOut,
  Plus,
  Tag,
  Trash2,
  User2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const TaskDetailsModal = ({
  isOpen,
  onClose,
  task,
  listTitle,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  lists,
}) => {
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      setRequirements(task.requirements || []);
      setAttachments(task.attachments || []);
    }
  }, [task]);

  const calculateProgress = () => {
    if (!requirements.length) return 0;
    const completed = requirements.filter((req) => req.completed).length;
    return Math.round((completed / requirements.length) * 100);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width='90vw'
      centered
      closeIcon={
        <X className='text-gray-400 hover:text-white transition-colors' />
      }
      className='task-modal max-w-6xl'>
      <div className='bg-slate-800 rounded-xl h-[90vh] flex flex-col overflow-hidden'>
        {/* Header with fixed height */}
        <div className='flex items-center justify-between p-4 border-b border-slate-700'>
          <div className='flex items-center gap-3'>
            <ListTodo className='w-6 h-6 text-blue-400' />
            <div>
              <h2 className='text-xl font-medium text-slate-100'>
                Task {task?.id}
              </h2>
              <div className='flex items-center gap-2'>
                <span className='text-slate-400'>in list</span>
                <button className='px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2'>
                  <span className='text-slate-100'>{listTitle}</span>
                  <ChevronDown className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with scrolling */}
        <div className='flex-1 overflow-hidden flex'>
          {/* Left panel - scrollable */}
          <div className='flex-1 overflow-y-auto p-4 space-y-6'>
            {/* Quick Actions */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div className='bg-slate-700/50 p-4 rounded-xl'>
                <span className='text-slate-300 block mb-3'>Members</span>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 bg-slate-600 rounded-lg' />
                  <button className='w-10 h-10 bg-slate-600 hover:bg-slate-500 rounded-lg flex items-center justify-center'>
                    <Plus className='w-5 h-5 text-slate-300' />
                  </button>
                </div>
              </div>

              <div className='bg-slate-700/50 p-4 rounded-xl'>
                <span className='text-slate-300 block mb-3'>Labels</span>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 bg-yellow-400 rounded-lg' />
                  <button className='w-10 h-10 bg-slate-600 hover:bg-slate-500 rounded-lg flex items-center justify-center'>
                    <Plus className='w-5 h-5 text-slate-300' />
                  </button>
                </div>
              </div>

              <div className='bg-slate-700/50 p-4 rounded-xl'>
                <span className='text-slate-300 block mb-3'>Notifications</span>
                <button className='w-full py-2 bg-slate-600 hover:bg-slate-500 rounded-xl flex items-center justify-center gap-2'>
                  <Eye className='w-5 h-5' />
                  <span>Watching</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className='text-lg font-medium text-slate-100 mb-3'>
                Description
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Add a more detailed description...'
                className='w-full h-32 bg-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-400 resize-none'
              />
            </div>

            {/* Requirements */}
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <Check className='w-6 h-6 text-green-400' />
                <h3 className='text-lg font-medium text-slate-100'>Progress</h3>
              </div>
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex-1 h-2 bg-slate-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-green-500 transition-all duration-300'
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <span className='text-slate-300 font-medium w-12 text-right'>
                  {calculateProgress()}%
                </span>
              </div>
              <div className='space-y-2'>
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className='flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg'>
                    <input
                      type='checkbox'
                      checked={req.completed}
                      onChange={() => {
                        const newReqs = requirements.map((r) =>
                          r.id === req.id
                            ? { ...r, completed: !r.completed }
                            : r
                        );
                        setRequirements(newReqs);
                        onUpdateTask?.({
                          ...task,
                          requirements: newReqs,
                          progress: calculateProgress(),
                        });
                      }}
                      className='w-5 h-5'
                    />
                    <span
                      className={
                        req.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-100'
                      }>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Link2 className='w-6 h-6 text-blue-400' />
                  <h3 className='text-lg font-medium text-slate-100'>
                    Attachments
                  </h3>
                </div>
                <button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white'>
                  Add File
                </button>
              </div>
              <div className='space-y-3'>
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className='flex items-start gap-4 p-3 bg-slate-700/50 rounded-xl'>
                    <img
                      src={attachment.thumbnail}
                      alt={attachment.name}
                      className='w-20 h-14 rounded-lg object-cover'
                    />
                    <div>
                      <p className='text-slate-100 font-medium'>
                        {attachment.name}
                      </p>
                      <p className='text-sm text-slate-400'>
                        Added {attachment.timeAgo} • {attachment.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar - fixed width */}
          <div className='w-64 border-l border-slate-700 p-4 space-y-2 flex-shrink-0'>
            <button className='w-full p-3 text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center gap-3'>
              <LogOut className='w-5 h-5' />
              <span>Leave</span>
            </button>
            <button className='w-full p-3 text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center gap-3'>
              <User2 className='w-5 h-5' />
              <span>Members</span>
            </button>
            <button className='w-full p-3 text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center gap-3'>
              <Tag className='w-5 h-5' />
              <span>Labels</span>
            </button>
            <div className='relative'>
              <button
                onClick={() => setShowMoveOptions(!showMoveOptions)}
                className='w-full p-3 text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center gap-3'>
                <ArrowLeftRight className='w-5 h-5' />
                <span>Move</span>
              </button>
              {showMoveOptions && (
                <div className='absolute left-0 right-0 mt-1 bg-slate-700 rounded-xl shadow-lg border border-slate-600 z-50'>
                  {Object.entries(lists).map(([listId, list]) => (
                    <button
                      key={listId}
                      onClick={() => {
                        onMoveTask?.(task?.id, listId);
                        setShowMoveOptions(false);
                      }}
                      className='w-full p-3 text-left text-slate-100 hover:bg-slate-600 first:rounded-t-xl last:rounded-b-xl'>
                      {list.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                onDeleteTask?.(task?.id);
                onClose();
              }}
              className='w-full p-3 text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-3 mt-auto'>
              <Trash2 className='w-5 h-5' />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <style
        jsx
        global>{`
        .task-modal .ant-modal-content {
          background-color: transparent;
          box-shadow: none;
          padding: 0;
        }
        .task-modal .ant-modal-body {
          padding: 0;
        }
        .task-modal .ant-modal-close {
          top: 1rem;
          right: 1rem;
          color: #94a3b8;
        }
        .task-modal .ant-modal-close:hover {
          color: white;
        }
      `}</style>
    </Modal>
  );
};

export default TaskDetailsModal;
