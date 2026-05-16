import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    // ✅ 防止重复连接
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const newSocket = io('https://health-companion-2.onrender.com', {
      transports: ['websocket'], // ✅ 更稳定
      reconnection: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);

      // join room
      newSocket.emit('join', user._id);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
