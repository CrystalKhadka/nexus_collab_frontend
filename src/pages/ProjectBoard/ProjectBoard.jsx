// React and Routing
import React, { useState } from 'react';

// Ant Design
import {
  DatePicker,
  Form,
  Input,
  Layout,
  message,
  Progress,
  Select,
} from 'antd';
import { Plus, X } from 'lucide-react';

// Lucide Icons
import { MoreHorizontal } from 'lucide-react';

// Animation
import { motion } from 'framer-motion';

// Drag and Drop
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

// Date Handling
import dayjs from 'dayjs';
import Navbar from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import TaskDetailsModal from '../../components/TaskDetailsModal';

// Ant Design Sub-components
const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const ProjectBoard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsModalOpen, setTaskDetailsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [taskTitle, setTaskTitle] = useState('');

  // Available labels
  const availableLabels = [
    { id: 1, color: 'bg-red-500', name: 'Urgent' },
    { id: 2, color: 'bg-yellow-500', name: 'In Review' },
    { id: 3, color: 'bg-green-500', name: 'Approved' },
    { id: 4, color: 'bg-blue-500', name: 'Feature' },
    { id: 5, color: 'bg-purple-500', name: 'Bug' },
  ];

  const [lists, setLists] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      cards: [
        {
          id: '1',
          title: 'Create Registration Page UI',
          description:
            'Design and implement a user-friendly registration interface',
          image: '/images/loginpage.jpg',
          dateRange: ['2024-12-05', '2024-12-11'],
          members: [
            {
              id: 1,
              name: 'Crystal Khadka',
              avatar: '/images/download.jpg',
            },
          ],
          labels: [1, 4], // Urgent and Feature
          requirements: [
            { id: 1, text: 'Design mockup', completed: true },
            { id: 2, text: 'Implement responsive layout', completed: false },
            { id: 3, text: 'Add form validation', completed: false },
          ],
          progress: 33,
          attachments: [
            {
              id: 1,
              name: 'mockup.jpg',
              url: '/images/loginpage.jpg',
              date: '2024-12-05T10:00:00Z',
            },
          ],
          isJoined: true,
        },
      ],
    },
    doing: {
      id: 'doing',
      title: 'Doing',
      cards: [
        {
          id: '2',
          title: 'Implement Authentication System',
          description: 'Set up user authentication with JWT tokens',
          image: '/images/loginpage.jpg',
          dateRange: ['2024-12-05', '2024-12-11'],
          members: [
            {
              id: 2,
              name: 'John Doe',
              avatar: '/images/download.jpg',
            },
          ],
          labels: [2, 4], // In Review and Feature
          requirements: [
            { id: 1, text: 'Set up JWT authentication', completed: true },
            { id: 2, text: 'Implement login endpoint', completed: true },
            { id: 3, text: 'Add token refresh logic', completed: false },
          ],
          progress: 66,
          attachments: [],
          isJoined: false,
        },
      ],
    },
    done: {
      id: 'done',
      title: 'Done',
      cards: [],
    },
  });

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceList = lists[source.droppableId];
    const destList = lists[destination.droppableId];
    const draggedCard = sourceList.cards[source.index];

    const newSourceCards = Array.from(sourceList.cards);
    newSourceCards.splice(source.index, 1);

    const newDestCards = Array.from(destList.cards);
    newDestCards.splice(destination.index, 0, draggedCard);

    setLists({
      ...lists,
      [source.droppableId]: {
        ...sourceList,
        cards: newSourceCards,
      },
      [destination.droppableId]: {
        ...destList,
        cards: newDestCards,
      },
    });

    message.success(`Moved "${draggedCard.title}" to ${destList.title}`);
  };

  const handleAddTask = () => {
    // e.preventDefault();
    const id = `task-${Date.now()}`;
    if (taskTitle.trim() === '') {
      message.error('Task title cannot be empty');
      return;
    }

    const newTask = {
      id: id,
      title: taskTitle,
      description: '',
      image: '/images/loginpage.jpg',
      dateRange: ['', ''],
      members: [],
      labels: [], // Urgent and Feature
      requirements: [],
      progress: 0,
      attachments: [],
      isJoined: false,
    };

    setLists({
      ...lists,
      [currentList]: {
        ...lists[currentList],
        cards: [...lists[currentList].cards, newTask],
      },
    });

    setTaskTitle('');
    setIsAddingTask(false);
    message.success('New task added');
  };

  const addNewList = () => {
    const id = `list-${Date.now()}`;
    const title = `New List ${Object.keys(lists).length + 1}`;

    setLists({
      ...lists,
      [id]: {
        id,
        title,
        cards: [],
      },
    });

    message.success('New list added');
  };

  const deleteCard = (listId, cardIndex) => {
    const cardTitle = lists[listId].cards[cardIndex].title;
    const newCards = [...lists[listId].cards];
    newCards.splice(cardIndex, 1);

    setLists({
      ...lists,
      [listId]: {
        ...lists[listId],
        cards: newCards,
      },
    });

    message.success(`Deleted "${cardTitle}"`);
  };

  // Handle task updates from TaskDetailsModal
  const handleUpdateTask = (updatedTask) => {
    const listId = Object.keys(lists).find((key) =>
      lists[key].cards.some((card) => card.id === updatedTask.id)
    );

    if (listId) {
      const newCards = lists[listId].cards.map((card) =>
        card.id === updatedTask.id ? updatedTask : card
      );

      setLists({
        ...lists,
        [listId]: {
          ...lists[listId],
          cards: newCards,
        },
      });
    }
  };

  // Handle moving task between lists from TaskDetailsModal
  const handleMoveTask = (taskId, newListId) => {
    const oldListId = Object.keys(lists).find((key) =>
      lists[key].cards.some((card) => card.id === taskId)
    );

    if (oldListId && oldListId !== newListId) {
      const taskToMove = lists[oldListId].cards.find(
        (card) => card.id === taskId
      );

      const newLists = {
        ...lists,
        [oldListId]: {
          ...lists[oldListId],
          cards: lists[oldListId].cards.filter((card) => card.id !== taskId),
        },
        [newListId]: {
          ...lists[newListId],
          cards: [...lists[newListId].cards, taskToMove],
        },
      };

      setLists(newLists);
      message.success(`Moved task to ${lists[newListId].title}`);
    }
  };

  const SidebarLink = ({ icon: Icon, text, active }) => (
    <motion.div
      whileHover={{ x: 5 }}
      className={`flex items-center gap-3 ${
        active ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
      } px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer`}>
      <Icon className='w-5 h-5' />
      {!collapsed && <span>{text}</span>}
    </motion.div>
  );

  const TaskCard = ({ task, index, listId }) => (
    <Draggable
      draggableId={task.id}
      index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => {
            setSelectedTask(task);
            setTaskDetailsModalOpen(true);
          }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={`bg-gray-800 rounded-xl overflow-hidden ${
              snapshot.isDragging ? 'shadow-2xl ring-2 ring-white/20' : ''
            }`}>
            <img
              src={task.image}
              alt={task.title}
              className='w-full h-32 object-cover'
            />
            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-white text-lg font-medium'>{task.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(listId, index);
                  }}
                  className='text-gray-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-400/10'>
                  <X className='w-4 h-4' />
                </button>
              </div>

              <p className='text-gray-400 text-sm mb-3'>{task.description}</p>

              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg'>
                  {dayjs(task.dateRange[0]).format('D MMM')} -{' '}
                  {dayjs(task.dateRange[1]).format('D MMM')}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex -space-x-2'>
                  {task.members.map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      className='w-8 h-8 rounded-full border-2 border-gray-800'
                      title={member.name}
                    />
                  ))}
                </div>

                <div className='flex gap-2'>
                  {task.labels.slice(0, 2).map((labelId) => {
                    const label = availableLabels.find((l) => l.id === labelId);
                    return (
                      <span
                        key={labelId}
                        className={`${label.color} px-2 py-1 rounded text-xs`}>
                        {label.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {task.progress > 0 && (
                <div className='mt-3'>
                  <Progress
                    percent={task.progress}
                    size='small'
                    strokeColor='#3B82F6'
                    trailColor='#374151'
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );

  const List = ({ list, listId }) => (
    <>
      <div
        className='min-w-[320px] bg-gray-800/50 backdrop-blur-sm rounded-xl p-4'
        style={{
          height: 'fit-content',
        }}>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-white text-xl font-semibold'>{list.title}</h2>
          <div className='flex items-center gap-2'>
            <span className='text-gray-400 text-sm'>
              {list.cards.length} {list.cards.length === 1 ? 'task' : 'tasks'}
            </span>
            <button className='text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 bg-transparent border-0'>
              <MoreHorizontal className='w-5 h-5' />
            </button>
          </div>
        </div>
        <Droppable droppableId={listId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='space-y-4'>
              {list.cards
                .filter(
                  (card) =>
                    card.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    card.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((card, index) => (
                  <TaskCard
                    key={card.id}
                    task={card}
                    index={index}
                    listId={listId}
                  />
                ))}
              {provided.placeholder}
              {isAddingTask && currentList === listId ? (
                <div>
                  <Form
                    form={form}
                    onFinish={handleAddTask}
                    initialValues={{ title: taskTitle }}
                    className='w-full flex flex-row justify-around'>
                    <Form.Item name='title'>
                      <Input
                        type='text'
                        placeholder='Enter task title'
                        className='min-w-3/4 bg-gray-800/50 text-white'
                        onPressEnter={form.submit}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        autoFocus
                      />
                    </Form.Item>
                    <Form.Item name='cancel'>
                      <button
                        onClick={() => setIsAddingTask(false)}
                        className='text-white-400 hover:text-white p-1 rounded-lg bg-red-500 border-0  '
                        style={{
                          height: 'fit-content',
                          width: 'fit-content',
                        }}>
                        <X className='w-4 h-4' />
                      </button>
                    </Form.Item>
                  </Form>
                  {/* cancel button */}
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentList(listId);
                    setIsAddingTask(true);
                  }}
                  className='w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center gap-2'>
                  <Plus className='w-5 h-5' />
                  Add Card
                </motion.button>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );

  return (
    <Layout className='min-h-screen bg-gray-900'>
      <Navbar />

      <Layout className='mt-16 bg-gray-900'>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Content className='p-6 overflow-x-auto bg-gray-800/50 pt-10'>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className='flex gap-6'>
              {Object.entries(lists).map(([listId, list]) => (
                <List
                  key={listId}
                  list={list}
                  listId={listId}
                />
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addNewList}
                className='min-w-[320px] h-[fit-content] py-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border-2 border-dashed border-white/20 hover:border-white/40 text-gray-400 hover:text-white flex items-center justify-center gap-2'>
                <Plus className='w-5 h-5' />
                Add Another List
              </motion.button>
            </div>
          </DragDropContext>
        </Content>
      </Layout>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={taskDetailsModalOpen}
        onClose={() => setTaskDetailsModalOpen(false)}
        task={selectedTask}
        listTitle={
          selectedTask
            ? lists[
                Object.keys(lists).find((key) =>
                  lists[key].cards.some((card) => card.id === selectedTask.id)
                )
              ].title
            : ''
        }
        onUpdateTask={handleUpdateTask}
        onDeleteTask={(taskId) => {
          const listId = Object.keys(lists).find((key) =>
            lists[key].cards.some((card) => card.id === taskId)
          );
          if (listId) {
            const cardIndex = lists[listId].cards.findIndex(
              (card) => card.id === taskId
            );
            deleteCard(listId, cardIndex);
          }
        }}
        onMoveTask={handleMoveTask}
        lists={lists}
      />
      {/* Styles */}
      <style
        jsx
        global>{`
        .kanban-modal .ant-modal-content {
          @apply bg-gray-800 border border-white/10 rounded-xl;
        }
        .kanban-modal .ant-modal-header {
          @apply bg-transparent border-b border-white/10 pb-4;
        }
        .kanban-modal .ant-modal-title {
          @apply text-white;
        }
        .kanban-modal .ant-modal-close {
          @apply text-gray-400 hover:text-white;
        }
        .kanban-modal .ant-modal-body {
          @apply text-white;
        }
        .kanban-modal .ant-form-item-label > label {
          @apply text-gray-300;
        }
        .kanban-modal .ant-input,
        .kanban-modal .ant-input-textarea,
        .kanban-modal .ant-picker,
        .kanban-modal .ant-select-selector {
          @apply bg-gray-700/50 border-white/10 text-white;
        }
        .kanban-modal .ant-input:hover,
        .kanban-modal .ant-input-textarea:hover,
        .kanban-modal .ant-picker:hover,
        .kanban-modal .ant-select-selector:hover {
          @apply border-white/20;
        }
        .kanban-modal .ant-input:focus,
        .kanban-modal .ant-input-textarea:focus,
        .kanban-modal .ant-picker-focused,
        .kanban-modal .ant-select-focused .ant-select-selector {
          @apply border-white/30 ring-1 ring-white/30;
        }
        .kanban-modal .ant-picker-suffix,
        .kanban-modal .ant-select-arrow {
          @apply text-gray-400;
        }
        .kanban-modal .ant-picker-input > input {
          @apply text-white;
        }
        .kanban-modal .ant-select-selection-placeholder {
          @apply text-gray-400;
        }
      `}</style>
    </Layout>
  );
};

export default ProjectBoard;
