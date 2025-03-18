import { axiosInstanceValidation } from '../axios/axiosInstance';
import { API_URL } from '../axios/axiosInstance';

export const loginUser = async (user, { signal }) => {
    try {
        const requestObj = {
            endpoint: '/user/login',
            data: {
                user
            }
        }
        const response = await axiosInstanceValidation.post(API_URL, JSON.stringify(requestObj), { signal: signal })
        return response.data
    } catch (error) {
        throw new Error("Error while trying to login: " + error)
    }
}