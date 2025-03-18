import axios from '../axios/axiosInstance';

export const createUser = async (user) => {
    try {
        const requestObj = {
            endpoint: '/user/create',
            token: localStorage.getItem('token'),
            data: {
                user
            }
        }
        const response = await axios.post('', JSON.stringify(requestObj))
        return response.data
    } catch (error) {
        throw new Error("Error while trying to create user: " + error)
    }
}

export const getUsers = async ({ signal }) => {

    try {
        const response = await axios.get('', {
            params: {
                endpoint: '/user/getAll',
                token: localStorage.getItem('token')
            },
            signal: signal
        })
        return response.data.users;
    } catch (error) {
        throw new Error("Error while trying to get users: " + error)
    }
}