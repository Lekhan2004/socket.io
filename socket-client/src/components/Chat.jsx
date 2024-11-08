import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, USERS_API } from '../utils/constants';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const user = useSelector(state=> state.user)
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(user.user, "user in client");
        const response = await axios.get(`${API_URL}${USERS_API}/allusers`, {
          params: { username: user.user }
        });
        setUsers(response.data.usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [user.user]);

  useEffect(() => {
    const newSocket = io("http://localhost:1838");
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []); // Only create socket once

  useEffect(() => {
    if (socket && selectedUser) {
      socket.emit("create-individual-room", `${user.user}_${selectedUser}`);
    }
  }, [socket, selectedUser, user.user]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!socket || !selectedUser || !message.trim()) return;

    const reqBody = {
      uniqueRoom: `${user.user}_${selectedUser}`,
      message: message,
      senderId: user.user
    };

    socket.emit("send-individual-message", reqBody);
    
    // Add sent message to messages array only once
    setMessages(prev => [...prev, {
      text: message,
      sender: user.user,
      timestamp: new Date().toISOString()
    }]);

    setMessage(''); // Clear input after sending
  };

  useEffect(() => {
    if (socket) {
      socket.on("receive-individual-message", (data) => {
        // Only add message if it's from the other user
        if (data.senderId !== user.user) {
          setMessages(prev => [...prev, {
            text: data.message,
            sender: data.senderId,
            timestamp: new Date().toISOString()
          }]);
        }
      });

      return () => {
        socket.off("receive-individual-message");
      };
    }
  }, [socket, user.user]);
  
  return (
    <div className="flex h-screen">
      {/* Left sidebar with users list */}
      <div className="w-1/4 bg-gray-100 border-r flex flex-col justify-between">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Chats</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.username}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedUser === user.username ? 'bg-blue-100' : 'hover:bg-gray-200'
                }`}
                onClick={() => {
                  setSelectedUser(user.username);
                  setMessages([]); // Clear messages when switching users
                }}
              >
                <p className="font-medium">{user.username}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-200 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{user.user[0]}</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Welcome, {user.user}</p>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right chat window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b bg-white">
              <h3 className="text-lg font-semibold">{selectedUser}</h3>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`mb-4 ${msg.sender === user.user ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === user.user 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
 
            {/* Message input */}
            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;