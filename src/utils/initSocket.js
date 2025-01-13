import { io } from 'socket.io-client';

const initSocket = (user) => {
  return io('http://localhost:5000', {
    query: { userId: user._id, email: user.email },
    transports: ['websocket'],
  });
};
export default initSocket;
