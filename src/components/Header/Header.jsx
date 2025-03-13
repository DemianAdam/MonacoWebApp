import React from 'react';
import { Link } from 'react-router';
import useSticky from '../../hooks/useSticky';
import AdminComponent from '../AdminComponent/AdminComponent';
import { useNavigate } from 'react-router'
export default function Header({ user, setUser }) {
    const navigate = useNavigate();
    const isSticky = useSticky(50); // Navbar changes after 50px scroll

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate('/login');
    }

    return (
        <div className="sticky -top-1">
            <div className={`w-full flex items-center z-50 transition-all duration-500 ease-in-out px-6 ${isSticky ? "bg-black/90 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"}`}>
                <nav className="w-full flex justify-center items-center relative py-2">
                    <ul className={`flex justify-around w-screen items-center transition-all duration-500 ease-in-out`}>
                        <AdminComponent user={user}>
                            <li><Link to="/" className="text-white hover:text-gray-300">Lista</Link></li>
                            <li><Link to="/users" className="text-white hover:text-gray-300">Usuarios</Link></li>
                        </AdminComponent>
                        <li onClick={handleLogout}>Cerrar sesión</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
