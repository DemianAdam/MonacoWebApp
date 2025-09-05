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
        <div className={`${isSticky?"":"p-5"} sticky -top-1`}>
            <div className="border bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl text-white w-full  mb-5 ">
                <div className={`w-full flex items-center z-50 transition-all duration-500 ease-in-out py-3 ${isSticky ? " backdrop-blur-lg shadow-lg bg-black/50" : "bg-transparent "}`}>
                    <nav className="w-full flex justify-center items-center relative py-2">
                        <ul className={`flex justify-around mx-5 w-full items-center transition-all duration-500 ease-in-out gap-5 md:gap-10 text-center`}>
                            <AdminComponent user={user}>
                                <li  className='w-1/3 '><Link to="/" className={`text-white max-w-50 hover:text-gray-300 block border w-full px-5 py-1 rounded-2xl ${isSticky&&"bg-black/60"}`}>Lista</Link></li>
                                
                                <li className='w-1/3'><Link to="/users" className={`text-white max-w-50 hover:text-gray-300 block border w-full px-5 py-1 rounded-2xl ${isSticky&&"bg-black/60"}`}>Usuarios</Link></li>
                            </AdminComponent>
                            <li className={`border px-4 py-1 rounded-2xl w-1/3 max-w-50 ${isSticky&&"bg-black/60"}`} onClick={handleLogout}>Cerrar sesión</li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}
