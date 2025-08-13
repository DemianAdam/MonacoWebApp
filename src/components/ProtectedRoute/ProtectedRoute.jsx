import React from 'react'
import { Navigate } from 'react-router'
import { jwtDecode } from 'jwt-decode'

export default function ProtectedRoute({ children, roles, setUser }) {
    const token = localStorage.getItem('token')
    if (!token) {
        setUser(null);
        return <Navigate to='/login' replace />
    }

    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUser(null);

            return <Navigate to="/login" replace />;
        }
        if (roles && !roles.includes(decodedToken.role)) {
            localStorage.removeItem('token'); 
            setUser(null);
            console.error("Info not valid for Token")
            console.log(roles)
            console.log(decodedToken.role)
            return <Navigate to="/login" replace />
        }

    } catch (error) {
        localStorage.removeItem('token');
        console.error("Error")
        console.log(error)
        setUser(null);
        return <Navigate to="/login" replace />;
    }

    return children;
}
