import React from 'react'
import { Navigate } from 'react-router'
import { jwtDecode } from 'jwt-decode'

export default function ProtectedRoute({ children, roles }) {
    const token = localStorage.getItem('token')
    if (!token) {
        console.log('No token found');
        return <Navigate to='/login' replace />
    }

    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token'); // Optionally remove the token (and refresh token if applicable)
            console.log('Token expired');
            return <Navigate to="/login" replace />;
        }
        if (roles && !roles.includes(decodedToken.role)) {
            console.log('Invalid role');
            return <Navigate to="/login" replace />
        }

    } catch (error) {
        localStorage.removeItem('token');
        console.log('Invalid token');
        return <Navigate to="/login" replace />;
    }

    return children;
}
