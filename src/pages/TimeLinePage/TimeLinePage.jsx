import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
import { getMembersRoleAndTaskApi, getProjectByIdApi } from '../../apis/Api';

// MUI theme customization
const muiStyles = {
  card: {
    backgroundColor: 'rgb(31 41 55)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tableCell: {
    color: 'white',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tableHead: {
    '& .MuiTableCell-head': {
      backgroundColor: 'rgb(55 65 81)',
      color: 'white',
      fontWeight: 600,
    },
  },
  select: {
    backgroundColor: 'rgb(55 65 81)',
    color: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  chip: {
    borderRadius: '9999px',
    padding: '0.25rem 0.75rem',
  },
};

const TimelinePage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [tasks, setTasks] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using URL params or context for project ID
        const projectId = window.location.pathname.split('/').pop();

        const [projectResponse, membersResponse] = await Promise.all([
          getProjectByIdApi(projectId),
          getMembersRoleAndTaskApi(projectId),
        ]);

        setProjectData(projectResponse.data.data);

        const allTasks = membersResponse.data.data.flatMap((member) =>
          member.tasks.map((task) => ({
            ...task,
            assignee: `${member.firstName} ${member.lastName}`,
            list: task.list?.name || 'Unassigned',
            status: task.status || 'pending',
            progress: task.taskProgress || 0,
          }))
        );

        setTasks(allTasks);

        // Generate progress data
        const progressByDate = allTasks.reduce((acc, task) => {
          const date = format(new Date(task.startDate || new Date()), 'MM/dd');
          if (!acc[date]) {
            acc[date] = { completed: 0, inProgress: 0, pending: 0 };
          }
          if (task.status === 'Completed') acc[date].completed++;
          else if (task.status === 'in-progress') acc[date].inProgress++;
          else acc[date].pending++;
          return acc;
        }, {});

        const formattedProgressData = Object.entries(progressByDate)
          .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
          .map(([date, counts]) => ({
            date,
            ...counts,
          }));

        setProgressData(formattedProgressData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load timeline data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const columns = [
    { id: 'name', label: 'Task', minWidth: 170 },
    { id: 'list', label: 'List', minWidth: 130 },
    { id: 'assignee', label: 'Assignee', minWidth: 130 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (status) => (
        <Chip
          label={status}
          color={getStatusColor(status)}
          size='small'
          sx={muiStyles.chip}
        />
      ),
    },
    {
      id: 'progress',
      label: 'Progress',
      minWidth: 170,
      render: (progress) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant='determinate'
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: progress === 100 ? '#10b981' : '#3b82f6',
              },
            }}
          />
        </Box>
      ),
    },
  ];

  const GanttChart = ({ tasks }) => {
    const chartData = tasks.map((task) => ({
      task: task.name,
      start: new Date(task.startDate || null).getTime(),
      end: new Date(task.endDate || task.startDate || null).getTime(),
      progress: task.progress || 0,
    }));

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout='vertical'
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#374151'
            />
            <XAxis
              type='number'
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => format(value, 'MM/dd')}
              stroke='#9ca3af'
            />
            <YAxis
              type='category'
              dataKey='task'
              stroke='#9ca3af'
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '0.375rem',
                color: 'white',
              }}
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
      </Box>
    );
  };

  const ProgressChart = ({ data }) => (
    <Box sx={{ height: 400, width: '100%' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#374151'
          />
          <XAxis
            dataKey='date'
            stroke='#9ca3af'
          />
          <YAxis stroke='#9ca3af' />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: 'white',
            }}
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
    </Box>
  );

  const filteredTasks = tasks.filter(
    (task) =>
      filterStatus === 'all' || task.status.toLowerCase() === filterStatus
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#111827',
        }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#111827', minHeight: '100vh', py: 3 }}>
      <Container maxWidth='xl'>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Typography
            variant='h4'
            sx={{ color: 'white' }}>
            Timeline
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size='small'
              sx={muiStyles.select}>
              <MenuItem value='all'>All Tasks</MenuItem>
              <MenuItem value='completed'>Completed</MenuItem>
              <MenuItem value='in-progress'>In Progress</MenuItem>
              <MenuItem value='pending'>Pending</MenuItem>
            </Select>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label='Start Date'
                  value={dateRange[0]}
                  onChange={(newValue) =>
                    setDateRange([newValue, dateRange[1]])
                  }
                  sx={{
                    '& .MuiInputBase-root': muiStyles.select,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
                <DatePicker
                  label='End Date'
                  value={dateRange[1]}
                  onChange={(newValue) =>
                    setDateRange([dateRange[0], newValue])
                  }
                  sx={{
                    '& .MuiInputBase-root': muiStyles.select,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </Box>

        <Card sx={muiStyles.card}>
          <CardContent>
            <Typography
              variant='h6'
              sx={{ color: 'white', mb: 2 }}>
              Task Overview
            </Typography>
            <TableContainer>
              <Table stickyHeader>
                <TableHead sx={muiStyles.tableHead}>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow
                      key={task._id}
                      hover>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          sx={muiStyles.tableCell}>
                          {column.render
                            ? column.render(task[column.id])
                            : task[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Grid
          container
          spacing={4}
          sx={{ mt: 2 }}>
          <Grid
            item
            xs={12}
            md={6}>
            <Card sx={muiStyles.card}>
              <CardContent>
                <Typography
                  variant='h6'
                  sx={{ color: 'white', mb: 2 }}>
                  Gantt Chart
                </Typography>
                <GanttChart tasks={filteredTasks} />
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}>
            <Card sx={muiStyles.card}>
              <CardContent>
                <Typography
                  variant='h6'
                  sx={{ color: 'white', mb: 2 }}>
                  Progress Overview
                </Typography>
                <ProgressChart data={progressData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TimelinePage;
