import axios from '../axios/axiosInstance';

export const setInside = async (person,isInside) => {

    const requestObj = {
        endpoint: '/person/setInside',
        token: localStorage.getItem('token'),
        data: {
            person,
            isInside
        }
    }

    const promise = axios.post('', JSON.stringify(requestObj))
    return promise;
}

export const getPersons = async ({ signal }) => {

    const response = await axios.get('', {
        params: {
            endpoint: '/person/getAll',
            token: localStorage.getItem('token')
        },
        signal: signal
    })

    return response.data.persons;

}

export const createPerson = async (person) => {

    const requestObj = {
        endpoint: '/person/add',
        token: localStorage.getItem('token'),
        data: {
            person
        }
    }

    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data

}

export const removePerson = async (person, userId) => {

    const requestObj = {
        endpoint: '/person/remove',
        token: localStorage.getItem('token'),
        data: {
            person,
            userId
        }
    }

    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data

}

export const updatePerson = async (person, userId) => {

    const requestObj = {
        endpoint: '/person/update',
        token: localStorage.getItem('token'),
        data: {
            person,
            userId
        }
    }

    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data

}

export const removeAllPersons = async () => {
    const requestObj = {
        endpoint: '/person/removeAll',
        token: localStorage.getItem('token')
    }

    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data
}