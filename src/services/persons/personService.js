import axios from '../axios/axiosInstance';

export const getPersons = async () => {
    try {
        const response = await axios.get('', {
            params: {
                endpoint: '/person/getAll',
                token: localStorage.getItem('token')
            }
        })

        return response.data.persons;
    } catch (error) {
        throw new Error("Error while trying to get persons: " + error)
    }
}

export const createPerson = async (person) => {
    try {
        const requestObj = {
            endpoint: '/person/add',
            token: localStorage.getItem('token'),
            data: {
                person
            }
        }

        const response = await axios.post('', JSON.stringify(requestObj))
        return response.data
    } catch (error) {
        throw new Error("Error while trying to create person: " + error)
    }
}