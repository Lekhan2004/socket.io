// src/components/ChatRoom.jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function ChatRoom() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (data) => {
        console.log(data, "received message from socket");
      });
    }
  }, [socket]);

  return (
    <div>
      {!isConnected ? (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
          <button type="submit">Join Room</button>
        </form>
      ) : (
        <form onSubmit={handleSend}>
          <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}

export default ChatRoom;
