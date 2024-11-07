// src/components/ChatRoom.jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

function ChatRoom() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const newSocket = io("http://localhost:1838");
    setSocket(newSocket);

    newSocket.on("connection", () => {
      console.log("Connected to server with Socket ID:", newSocket.id);
    });

    return () => newSocket.close();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { name, room };
    if (socket && data.name && data.room) {
      socket.emit("join-room", data.room);
      setIsConnected(true);
    } else {
      alert("Please enter name and room number");
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("send-message", { room, message });
      setMessage('');
    } else {
      alert("Please don't send an empty message");
    }
  };

  const handleLogout = () =>{
    dispatch(logout());
  }

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (data) => {
        console.log(data, "received message from socket");
      });
    }
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Chat Room</h2>
        {!isConnected ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="Name" 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Room" 
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"  
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
            >
              Join Room
            </button>
          </form>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <input 
              type="text" 
              placeholder="Message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
            >
              Send
            </button>
          </form>
        )}
        <button 
          type='button' 
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
