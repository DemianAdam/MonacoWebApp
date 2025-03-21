import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminComponent from './components/AdminComponent/AdminComponent';
import Header from './components/Header/Header';
import { jwtDecode } from 'jwt-decode'
import { validateToken, removeToken } from './services/tokenService/tokenService';
import Modal from './components/Modal/Modal';
import Users from './pages/Users/Users';
import Clear from './pages/Clear/Clear';

function App() {
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({})
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return {
        id: decodedToken.id,
        username: decodedToken.username,
        role: decodedToken.role,
        limit: decodedToken.limit,
        dateLimit: new Date(decodedToken.dateLimit)
      }
    }
  });

  useEffect(() => {
    async function validate() {
      const result = await validateToken();
      if (!result.data) {
        removeToken();
        setUser(null);
      }
    }

    validate();
  }, [])

  return (
    <>
      <div className='p-5 font-abril-fatface text-6xl md:text-8xl flex justify-center mb-5'>
        <h1 className='drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]'>Mónaco</h1>
      </div>


      {user && <Header user={user} setUser={setUser}></Header>}

      <Routes>
        <Route path="/" element={
          <ProtectedRoute roles={['user', 'admin']}>
            <Main user={user} setShowModal={setShowModal} setModalContent={setModalContent} />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login setUser={setUser} user={user} />} />
        <Route path="/users" element={
          <ProtectedRoute roles={['admin']}>
            <Users setShowModal={setShowModal} setModalContent={setModalContent} />
          </ProtectedRoute>
        } />
        <Route path='/clear' element={<Clear setUser={setUser}></Clear>}/>
      </Routes>
      <Modal show={showModal} onHide={() => setShowModal(false)} content={modalContent}></Modal>
    </>
  );
}

export default App;
