import { useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";


function App() {
  useEffect(()=>{
  
    const socket = io("http://localhost:1838");

    socket.on("connect", () => {
        console.log("Connected to server with socket ID:", socket.id);
    });

  },[])

  return (
    <>
    <h1 className="text-3xl font-bold underline text-red-600">
      Hello world!
    </h1>
    </>
  )
}

export default App
