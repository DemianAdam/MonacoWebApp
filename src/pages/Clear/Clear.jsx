import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';

export default function Clear({ setUser }) {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("token");
        setUser(null);
        navigate('/login');
    }, [])
    return (
        <div>Clear</div>
    )
}
