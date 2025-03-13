
import { axiosInstanceValidation } from '../axios/axiosInstance';
const getToken = () => {
    return localStorage.getItem('token');
}

const setToken = (token) => {
    localStorage.setItem('token', token);
}

const removeToken = () => {
    localStorage.removeItem('token');
}

const getUserFromToken = () => {
    const token = getToken();
    if (token) {
        const decodedToken = jwtDecode(token);
        return {
            id: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role
        }
    }
    return null;
}

const validateToken = async () => {
    const token = getToken();
    if (!token) {
        return false;
    }

    try {
        const requestObj = {
            endpoint: '/user/validateToken',
            data: {
                token
            }
        }
        const response = await axiosInstanceValidation.post("", JSON.stringify(requestObj))
        return response.data;
    } catch (error) {
        return false;
    }
}

export {
    getToken,
    setToken,
    removeToken,
    getUserFromToken,
    validateToken
}
