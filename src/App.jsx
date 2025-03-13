import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Admin from './pages/Admin/Admin';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLogged = !!user;

  return (
    <>
      <div className='flex flex-col'>
        <div className='p-5 font-abril-fatface text-6xl md:text-8xl flex justify-center mb-5'>
          <h1 className='drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]'>Mónaco</h1>
        </div>
      </div>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={
          <ProtectedRoute roles={['user', 'admin']} user={user} setUser={setUser}>
            <Main user={user} />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']} user={user} setUser={setUser}>
            <Admin user={user} />
          </ProtectedRoute>
        } />
      </Routes>


    </>
  );
}

export default App;
