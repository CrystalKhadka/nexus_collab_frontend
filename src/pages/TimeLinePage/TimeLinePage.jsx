import { Card, DatePicker, Layout, Select, Table } from 'antd';
import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Navbar from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';

const { Content } = Layout;
const { RangePicker } = DatePicker;

// Sample data - replace with your actual data
const sampleData = {
  tasks: [
    {
      id: 1,
      task: 'Design Homepage',
      list: 'Design Tasks',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      assignee: 'Crystal Khadka',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 2,
      task: 'Implement Authentication',
      list: 'Development',
      startDate: '2024-12-05',
      endDate: '2024-12-15',
      assignee: 'Rushmit Karki',
      status: 'In Progress',
      progress: 60,
    },
    {
      id: 3,
      task: 'User Testing',
      list: 'QA',
      startDate: '2024-12-15',
      endDate: '2024-12-20',
      assignee: 'Safal Pandey',
      status: 'Pending',
      progress: 0,
    },
  ],
  progressData: [
    { date: '12/01', completed: 5, inProgress: 8, pending: 3 },
    { date: '12/05', completed: 7, inProgress: 6, pending: 4 },
    { date: '12/10', completed: 10, inProgress: 4, pending: 2 },
    { date: '12/15', completed: 12, inProgress: 3, pending: 2 },
  ],
};

const TimelinePage = () => {
  const [dateRange, setDateRange] = useState(null);

  // Table columns configuration
  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: (text) => <span className='text-white'>{text}</span>,
    },
    {
      title: 'List',
      dataIndex: 'list',
      key: 'list',
      render: (text) => <span className='text-white'>{text}</span>,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text) => <span className='text-white'>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === 'Completed'
              ? 'bg-green-500/20 text-green-300'
              : status === 'In Progress'
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-yellow-500/20 text-yellow-300'
          }`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className='w-full bg-gray-700 rounded-full h-2'>
          <div
            className='bg-blue-500 rounded-full h-2'
            style={{ width: `${progress}%` }}
          />
        </div>
      ),
    },
  ];

  // Gantt Chart Component
  const GanttChart = ({ tasks }) => {
    const chartData = tasks.map((task) => ({
      task: task.task,
      start: new Date(task.startDate).getTime(),
      end: new Date(task.endDate).getTime(),
      progress: task.progress,
    }));

    return (
      <div className='h-64'>
        <ResponsiveContainer
          width='100%'
          height='100%'>
          <BarChart
            data={chartData}
            layout='vertical'
            barSize={20}
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#444'
            />
            <XAxis
              type='number'
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              type='category'
              dataKey='task'
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar
              dataKey='end'
              fill='#3b82f6'
              stackId='stack'
            />
            <Bar
              dataKey='start'
              fill='#1f2937'
              stackId='stack'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Progress Chart Component
  const ProgressChart = ({ data }) => (
    <div className='h-64'>
      <ResponsiveContainer
        width='100%'
        height='100%'>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#444'
          />
          <XAxis
            dataKey='date'
            stroke='#9ca3af'
          />
          <YAxis stroke='#9ca3af' />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line
            type='monotone'
            dataKey='completed'
            stroke='#10b981'
          />
          <Line
            type='monotone'
            dataKey='inProgress'
            stroke='#3b82f6'
          />
          <Line
            type='monotone'
            dataKey='pending'
            stroke='#f59e0b'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Layout className='flex h-screen bg-gray-900 '>
      <Navbar />
      <Layout className='mt-16 bg-gray-900 overflow-auto'>
        <Sidebar />
        <Content className='p-6 bg-gray-800/50'>
          <div className='max-w-7xl mx-auto space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-semibold text-white'>Timeline</h1>
              <div className='flex gap-4'>
                <Select
                  defaultValue='all'
                  className='w-32'
                  options={[
                    { value: 'all', label: 'All Tasks' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'pending', label: 'Pending' },
                  ]}
                />
                <RangePicker
                  onChange={(dates) => setDateRange(dates)}
                  className='bg-gray-800 border-gray-700'
                />
              </div>
            </div>

            {/* Task Table */}
            <Card className='bg-gray-800 border-white/10'>
              <h2 className='text-lg font-medium text-white mb-4'>
                Task Overview
              </h2>
              <Table
                columns={columns}
                dataSource={sampleData.tasks}
                pagination={false}
                className='custom-table'
              />
            </Card>

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Gantt Chart */}
              <Card className='bg-gray-800 border-white/10'>
                <h2 className='text-lg font-medium text-white mb-4'>
                  Gantt Chart
                </h2>
                <GanttChart tasks={sampleData.tasks} />
              </Card>

              {/* Progress Chart */}
              <Card className='bg-gray-800 border-white/10'>
                <h2 className='text-lg font-medium text-white mb-4'>
                  Progress Overview
                </h2>
                <ProgressChart data={sampleData.progressData} />
              </Card>
            </div>
          </div>
        </Content>
      </Layout>

      <style
        jsx
        global>{`
        .custom-table .ant-table {
          background: transparent;
          color: white;
        }
        .custom-table .ant-table-thead > tr > th {
          background: #374151;
          color: white;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background: rgba(55, 65, 81, 0.5);
        }
      `}</style>
    </Layout>
  );
};

export default TimelinePage;
