import {
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';

const { Content } = Layout;
const { Option } = Select;

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('task'); // 'task' or 'meeting'
  const [form] = Form.useForm();

  // Sample data - replace with your actual data
  const [tasks] = useState([
    {
      id: 1,
      title: 'Design Homepage',
      startDate: '2024-12-28',
      endDate: '2024-12-31',
      type: 'task',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Team Standup',
      startDate: '2024-12-30',
      type: 'meeting',
      time: '10:00 AM',
    },
  ]);

  const getDaysInMonth = (date) => {
    const year = date.year();
    const month = date.month();
    const firstDay = dayjs(new Date(year, month, 1));
    const lastDay = dayjs(new Date(year, month + 1, 0));
    const daysInMonth = lastDay.date();
    const startingDay = firstDay.day();

    const calendar = [];
    let week = new Array(7).fill(null);

    // Add empty days for previous month
    for (let i = 0; i < startingDay; i++) {
      week[i] = {
        date: firstDay.subtract(startingDay - i, 'day'),
        isCurrentMonth: false,
      };
    }

    // Add days for current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(new Date(year, month, day));
      const dayOfWeek = date.day();

      week[dayOfWeek] = {
        date,
        isCurrentMonth: true,
      };

      if (dayOfWeek === 6 || day === daysInMonth) {
        calendar.push(week);
        week = new Array(7).fill(null);
      }
    }

    // Fill in the rest of the last week if needed
    if (calendar[calendar.length - 1].some((day) => day === null)) {
      let lastWeek = calendar[calendar.length - 1];
      let nextMonth = 1;
      for (let i = 0; i < 7; i++) {
        if (lastWeek[i] === null) {
          lastWeek[i] = {
            date: lastDay.add(nextMonth++, 'day'),
            isCurrentMonth: false,
          };
        }
      }
    }

    return calendar;
  };

  const getEventsForDate = (date) => {
    return tasks.filter((task) => {
      if (task.type === 'meeting') {
        return dayjs(task.startDate).isSame(date, 'day');
      }
      return (
        dayjs(task.startDate).isBefore(date, 'day') &&
        dayjs(task.endDate).isAfter(date, 'day')
      );
    });
  };

  const renderDateCell = (dayInfo) => {
    const events = getEventsForDate(dayInfo.date);
    const isToday = dayInfo.date.isSame(dayjs(), 'day');
    const isSelected = selectedDate && dayInfo.date.isSame(selectedDate, 'day');

    return (
      <div
        className={`h-32 p-2 border-r border-b border-white/10 transition-colors
          ${!dayInfo.isCurrentMonth ? 'bg-gray-800/50' : 'bg-gray-800/30'}
          ${isSelected ? 'bg-gray-700/50' : ''}
          ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
        `}
        onClick={() => setSelectedDate(dayInfo.date)}>
        <div className='flex justify-between items-start'>
          <span
            className={`text-sm font-medium ${
              dayInfo.isCurrentMonth ? 'text-white' : 'text-gray-500'
            }`}>
            {dayInfo.date.date()}
          </span>
          {events.length > 0 && (
            <Badge
              count={events.length}
              className='mr-2'
            />
          )}
        </div>
        <div className='mt-2 space-y-1'>
          {events.map((event) => (
            <Tooltip
              key={event.id}
              title={event.title}>
              <div
                className={`
                text-xs p-1 rounded truncate
                ${
                  event.type === 'meeting'
                    ? 'bg-purple-500/20 text-purple-200'
                    : ''
                }
                ${event.type === 'task' ? 'bg-blue-500/20 text-blue-200' : ''}
              `}>
                {event.title}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout className='min-h-screen bg-gray-900 overflow-hidden'>
      <Navbar />
      <Layout className='mt-16 bg-gray-900 '>
        <Sidebar />
        <Content className='p-6 bg-gray-800/50 overflow-scroll'>
          <div className='max-w-7xl mx-auto'>
            {/* Calendar Header */}
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-4'>
                <h1 className='text-2xl font-semibold text-white'>Calendar</h1>
                <div className='flex items-center gap-2'>
                  <Button
                    icon={<ChevronLeft className='w-4 h-4' />}
                    onClick={handlePrevMonth}
                    className='border-white/10 bg-gray-800 text-white hover:bg-gray-700'
                  />
                  <span className='text-lg text-white font-medium'>
                    {currentDate.format('MMMM YYYY')}
                  </span>
                  <Button
                    icon={<ChevronRight className='w-4 h-4' />}
                    onClick={handleNextMonth}
                    className='border-white/10 bg-gray-800 text-white hover:bg-gray-700'
                  />
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  icon={<Plus className='w-4 h-4' />}
                  onClick={() => handleAddNew('task')}
                  className='bg-blue-500 text-white border-none hover:bg-blue-600'>
                  Add Task
                </Button>
                <Button
                  icon={<Plus className='w-4 h-4' />}
                  onClick={() => handleAddNew('meeting')}
                  className='bg-purple-500 text-white border-none hover:bg-purple-600'>
                  Add Meeting
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className='bg-gray-800/30 rounded-lg border border-white/10'>
              {/* Week Header */}
              <div className='grid grid-cols-7'>
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className='py-2 text-center border-b border-white/10'>
                    <span className='text-sm font-medium text-gray-300'>
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar Body */}
              <div>
                {getDaysInMonth(currentDate).map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className='grid grid-cols-7'>
                    {week.map((day, dayIndex) => (
                      <div key={`${weekIndex}-${dayIndex}`}>
                        {renderDateCell(day)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Content>
      </Layout>

      {/* Add Task/Meeting Modal */}
      <Modal
        title={modalType === 'task' ? 'Add Task' : 'Add Meeting'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form.validateFields().then((values) => {
            console.log('Form values:', values);
            setIsModalVisible(false);
            form.resetFields();
          });
        }}>
        <Form
          form={form}
          layout='vertical'>
          <Form.Item
            name='title'
            label='Title'
            rules={[{ required: true, message: 'Please input a title!' }]}>
            <Input />
          </Form.Item>

          {modalType === 'task' ? (
            <>
              <Form.Item
                name='dateRange'
                label='Date Range'
                rules={[
                  { required: true, message: 'Please select date range!' },
                ]}>
                <DatePicker.RangePicker className='w-full' />
              </Form.Item>
              <Form.Item
                name='priority'
                label='Priority'>
                <Select>
                  <Option value='low'>Low</Option>
                  <Option value='medium'>Medium</Option>
                  <Option value='high'>High</Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name='date'
                label='Date'
                rules={[{ required: true, message: 'Please select date!' }]}>
                <DatePicker className='w-full' />
              </Form.Item>
              <Form.Item
                name='time'
                label='Time'
                rules={[{ required: true, message: 'Please select time!' }]}>
                <DatePicker.TimePicker
                  className='w-full'
                  format='HH:mm'
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Layout>
  );
};

export default CalendarPage;
