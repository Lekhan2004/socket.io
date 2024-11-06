import { useEffect, useState } from 'react'
import { io } from "socket.io-client";


function App() {
  
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [isConnected,setIsConnected] = useState(false)

  useEffect(()=>{
    const newSocket = io("http://localhost:1838");
    setSocket(newSocket)

    newSocket.on("connection", () => {
        console.log("Connected to server with Socket ID:", newSocket.id);
    });

  },[])

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ name, room }, "form");

    const data = { name, room };
    if (socket && data.name !== '' || data.room !== '') {
      socket.emit("join-room", data.room); // Emit data when form is submitted
      setIsConnected(true);
    }
    else{
      alert("Please submit only after entering name and room number");
    }
  };
  const handleSend = async (event) => {
    event.preventDefault();
    if (message !== '') {

      await socket.emit("send-message",  { room, message });
      setMessage('');  // Emit data when form is submitted
    }
    else{
      alert("Please dont send an empty mzg");
    }
  };

  useEffect(()=>{
    if (socket) {
      socket.on("receive-message", (data) => {
        console.log(data, `received message from socket`);
      });
    }
  },[socket])
  
  return (
    <>
    {
      !isConnected ? (
        <div>
        <h1 className="text-3xl font-bold underline text-red-600">
          Join a Room
        </h1>
        <form action="" onSubmit={handleSubmit}>
          <input type="text" placeholder='name' onChange={(event)=>{
            setName(event.target.value)
          }}/>
          <input type="text" placeholder='room' onChange={(event)=>{
            setRoom(event.target.value)
          }}/>
          <button type="submit">Enter/Join</button>
        </form>
      </div>
      ) : (
        <>
          <form action="" onSubmit={handleSend}>
            <input type="text" placeholder='send mzg' onChange={(event)=>{
              setMessage(event.target.value)
            }}/>
            <button type="submit" >Send</button>
          </form>
        </>
      )
    }
    </>
  )
}

export default App
