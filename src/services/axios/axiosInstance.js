import axios, { AxiosError } from "axios";
import { removeToken, validateToken } from "../tokenService/tokenService";

export const API_URL = "https://script.google.com/macros/s/AKfycbzXjuhTwqIpyKpxZnqV39UPvny3WBj-9UhKh-oM6iw31oI0fDofN90Lq6uXE6-bPx0/exec";
const axiosInstance = axios.create({
    baseURL: API_URL,
});
export const axiosInstanceValidation = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use(function (config) {
    if (window.location.pathname === "/login") {
        return config;

    }

    async function validate() {
        const result = await validateToken();
        if (!result.data) {
           // removeToken();
           // window.location.href = "/login";
        }
    }

    validate();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data.statusCode >= 400) {
            const axiosError = new AxiosError(response.data.description, "ERR", undefined, null, response);
            axiosError.status = response.data.statusCode;
            axiosError.name = response.data.reason;
            return Promise.reject(axiosError);
        }
        console.log(response);

        return response;
    },
    (error) => {
        console.log(error);

        return Promise.reject(error);
    }
)

export default axiosInstance;