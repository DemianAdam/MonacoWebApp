import axios from '../axios/axiosInstance'

export const loginUser = async (user) => {
    try {
        const requestObj = {
            endpoint: '/user/login',
            data: {
                user
            }
        }
        const response = await axios.post("", JSON.stringify(requestObj))
        return response.data
    } catch (error) {
        throw new Error("Error while trying to login: " + error)
    }
}