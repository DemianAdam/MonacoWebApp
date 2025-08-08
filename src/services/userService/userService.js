import axios from '../axios/axiosInstance';

export const createUser = async (user) => {

    const requestObj = {
        endpoint: '/user/create',
        token: localStorage.getItem('token'),
        data: {
            user
        }
    }
    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data

}

export const getUsers = async ({ signal }) => {
    const rawData = { includePersons: true };
    const response = await axios.get('', {
        params: {
            endpoint: '/user/getAll',
            token: localStorage.getItem('token'),
            data: JSON.stringify(rawData)
        },
        signal: signal
    })
    return response.data.users;

}

export const removeUser = async (userId) => {

    const requestObj = {
        endpoint: '/user/remove',
        token: localStorage.getItem('token'),
        data: {
            id: userId
        }
    }
    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data

}

export const updateUser = async (user) => {
    const requestObj = {
        endpoint: '/user/update',
        token: localStorage.getItem('token'),
        data: {
            user
        }
    }
    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data
}

export const updateDateLimit = async ({ date }) => {
    try {
        const requestObj = {
            endpoint: '/user/setDateLimit',
            token: localStorage.getItem('token'),
            data: {
                date
            }
        }
        const response = await axios.post('', JSON.stringify(requestObj))
        return response.data
    } catch (error) {
        throw new Error("Error al actualizar la fecha límite: " + error)
    }
}

export const getDateLimit = async () => {
    const response = await axios.get('', {
        params: {
            endpoint: '/user/getDateLimit',
            token: localStorage.getItem('token')
        }
    })
    return response.data.date;

}