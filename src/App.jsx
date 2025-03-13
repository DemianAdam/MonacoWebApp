import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Admin from './pages/Admin/Admin';

function App() {
  const [isLogged, setIsLogged] = useState(() => !!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      setIsLogged(false);
    }
  }, [user]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login setIsLogged={setIsLogged} setUser={setUser} />} />
      </Routes>
      <div className='p-5 flex flex-col'>
        <div className='font-abril-fatface text-6xl md:text-8xl flex justify-center mb-20'>
          <h1 className='drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]'>Mónaco</h1>
        </div>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute roles={['user', 'admin']}>
              <Main user={user} />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <Admin user={user} />
            </ProtectedRoute>
          } />
        </Routes >
      </div>
    </>
  );
}



export default App;
