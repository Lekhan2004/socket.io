import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ChatRoom from '../components/ChatRoom';
import { useSelector } from 'react-redux';

function ChatApp() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={isAuthenticated ? <ChatRoom /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default ChatApp;
