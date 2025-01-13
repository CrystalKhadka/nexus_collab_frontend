import { message } from 'antd';
import { changeTaskNameApi, deleteTaskApi } from '../apis/Api';

export const useProjectBoard = ({ lists, setLists }) => {
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newLists = [...lists];
    const sourceListIndex = newLists.findIndex(
      (list) => list._id === source.droppableId
    );
    const destListIndex = newLists.findIndex(
      (list) => list._id === destination.droppableId
    );

    if (sourceListIndex === -1 || destListIndex === -1) return;

    const [movedTask] = newLists[sourceListIndex].tasks.splice(source.index, 1);
    newLists[destListIndex].tasks.splice(destination.index, 0, movedTask);

    setLists(newLists);
    message.success(
      `Moved "${movedTask.name}" to ${newLists[destListIndex].name}`
    );
  };

  const handleUpdateTask = (updatedTask) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list._id === updatedTask.listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) =>
              task._id === updatedTask._id ? updatedTask : task
            ),
          };
        }
        return list;
      })
    );
    message.success('Task updated successfully');
  };

  const handleDeleteTask = (taskId) => {
    deleteTaskApi(taskId)
      .then((res) => {
        setLists((prevLists) =>
          prevLists.map((list) => {
            return {
              ...list,
              tasks: list.tasks.filter((task) => task._id !== taskId),
            };
          })
        );
        message.success('Task deleted successfully');
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          message.error(err.response.data.message);
        } else {
          message.error('Something went wrong');
        }
      });
  };

  const handleMoveTask = (taskId, newListId) => {
    setLists((prevLists) => {
      const allLists = [...prevLists];
      let taskToMove = null;
      let sourceListIndex = -1;

      // Find the task and its source list
      allLists.forEach((list, index) => {
        const task = list.tasks.find((t) => t._id === taskId);
        if (task) {
          taskToMove = task;
          sourceListIndex = index;
        }
      });

      if (!taskToMove || sourceListIndex === -1) return prevLists;

      // Remove task from source list
      allLists[sourceListIndex].tasks = allLists[sourceListIndex].tasks.filter(
        (task) => task._id !== taskId
      );

      // Add task to destination list
      const destList = allLists.find((list) => list._id === newListId);
      if (destList) {
        destList.tasks.push({
          ...taskToMove,
          listId: newListId,
        });
      }

      return allLists;
    });

    message.success('Task moved successfully');
  };



  return {
    handleDragEnd,
    handleUpdateTask,
    handleDeleteTask,
    handleMoveTask,
  
  };
};
