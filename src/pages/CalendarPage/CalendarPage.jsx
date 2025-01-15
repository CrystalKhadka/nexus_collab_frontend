import {
  Box,
  Chip,
  IconButton,
  Tooltip as MuiTooltip,
  Paper,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTasksByProjectIdApi } from '../../apis/Api';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getTasksByProjectIdApi(id)
      .then((res) => setTasks(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);

  const getDaysInMonth = (date) => {
    const year = date.year();
    const month = date.month();
    const firstDay = dayjs(new Date(year, month, 1));
    const lastDay = dayjs(new Date(year, month + 1, 0));
    const daysInMonth = lastDay.date();
    const startingDay = firstDay.day();

    const calendar = [];
    let week = new Array(7).fill(null);

    for (let i = 0; i < startingDay; i++) {
      week[i] = {
        date: firstDay.subtract(startingDay - i, 'day'),
        isCurrentMonth: false,
      };
    }

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
    if (!tasks) return [];

    return tasks.filter((task) => {
      if (!task.startDate || !task.endDate) return false;

      const taskStartDate = dayjs(task.startDate);
      const taskEndDate = dayjs(task.endDate);
      const currentDate = dayjs(date);

      // Check if the current date falls between start and end dates (inclusive)
      return (
        currentDate.isSame(taskStartDate, 'day') ||
        currentDate.isSame(taskEndDate, 'day') ||
        (currentDate.isAfter(taskStartDate, 'day') &&
          currentDate.isBefore(taskEndDate, 'day'))
      );
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-200';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-200';
      default:
        return 'bg-green-500/20 text-green-200';
    }
  };

  const renderDateCell = (dayInfo) => {
    const events = getEventsForDate(dayInfo.date);
    const isToday = dayInfo.date.isSame(dayjs(), 'day');
    const isSelected = selectedDate && dayInfo.date.isSame(selectedDate, 'day');

    return (
      <Box
        onClick={() => setSelectedDate(dayInfo.date)}
        className={`
          min-h-[8rem] md:min-h-[10rem] p-2 border-r border-b border-gray-700
          transition-all duration-200 cursor-pointer
          ${!dayInfo.isCurrentMonth ? 'bg-gray-800/50' : 'bg-gray-800/30'}
          ${isSelected ? 'bg-gray-700/50' : ''}
          ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
          hover:bg-gray-700/40
        `}>
        <div className='flex justify-between items-start'>
          <Typography
            className={`text-sm font-medium ${
              dayInfo.isCurrentMonth ? 'text-white' : 'text-gray-500'
            }`}>
            {dayInfo.date.date()}
          </Typography>
          {events.length > 0 && (
            <Chip
              size='small'
              label={events.length}
              className='bg-blue-500/20 text-blue-200'
            />
          )}
        </div>
        <div className='mt-2 space-y-1 overflow-y-auto max-h-24'>
          {events.map((event) => (
            <MuiTooltip
              key={event._id}
              title={
                <div>
                  <div>{event.name}</div>
                  <div className='text-xs'>
                    {dayjs(event.startDate).format('MMM D')} -{' '}
                    {dayjs(event.endDate).format('MMM D')}
                  </div>
                </div>
              }
              arrow
              placement='top'>
              <div
                className={`
                  text-xs p-1.5 rounded truncate
                  ${getPriorityColor(event.priority)}
                `}>
                {event.name}
              </div>
            </MuiTooltip>
          ))}
        </div>
      </Box>
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box className='min-h-screen bg-gray-900 p-4 md:p-6'>
      <Paper className='max-w-7xl mx-auto bg-gray-800/50 p-4 md:p-6 rounded-xl'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <Typography
            variant='h4'
            className='text-white font-semibold'>
            Calendar
          </Typography>
          <div className='flex items-center gap-2'>
            <IconButton
              onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
              className='text-white hover:bg-gray-700'>
              <ChevronLeft className='w-5 h-5' />
            </IconButton>
            <Typography
              variant='h6'
              className='text-white font-medium px-2'>
              {currentDate.format('MMMM YYYY')}
            </Typography>
            <IconButton
              onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
              className='text-white hover:bg-gray-700'>
              <ChevronRight className='w-5 h-5' />
            </IconButton>
          </div>
        </div>

        <Paper className='bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden'>
          <div className='grid grid-cols-7'>
            {weekDays.map((day) => (
              <div
                key={day}
                className='py-2 text-center border-b border-gray-700'>
                <Typography className='text-sm font-medium text-gray-300'>
                  {day}
                </Typography>
              </div>
            ))}
          </div>

          <div className='overflow-x-auto'>
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
        </Paper>
      </Paper>
    </Box>
  );
};

export default CalendarPage;
