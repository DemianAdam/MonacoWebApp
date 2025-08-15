import { data } from 'react-router';
import axios from '../axios/axiosInstance';

export const setInside = async (person, isInside) => {

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
    const rawData = { includeUsers: true };
    const response = await axios.get('', {
        params: {
            endpoint: '/person/getAll',
            token: localStorage.getItem('token'),
            data: JSON.stringify(rawData)
        },
        signal: signal
    })
    return response.data.persons;

}

export const getLotteryPersons = async () => {
    const response = await axios.get('', {
        params: {
            endpoint: '/lottery/getAll',
            token: localStorage.getItem('token'),
        }
    })

    return response.data.lotteryPersons;
}

export const addLotteryPerson = async (qrData, persons) => {
    const person = pdf417ToPerson(qrData);

    const result = persons.find(x => x.rawData == qrData);

    if (result) {
        throw { code: "UniqueError" }
    }

    const requestObj = {
        endpoint: '/lottery/add',
        token: localStorage.getItem('token'),
        data: {
            qrData
        }
    }

    const response = await axios.post('', JSON.stringify(requestObj))
    return response.data
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

export const verifyQrPerson = async (qrData, persons) => {
    const person = pdf417ToPerson(qrData)

    const result = persons.find(x => x.rawData == qrData)

    if (result) {
        if (result.isInside) {
            throw { code: "AlreadyInside" }
        }
        else if (!comparePersons(result, person)) {
            throw { code: "DataMismatch" }
        }
        return { person: result }
    }


    const requestObj = {
        endpoint: '/qrPerson/validateQr',
        token: localStorage.getItem('token'),
        data: {
            qrData,

        }
    }

    const response = await axios.post('', JSON.stringify(requestObj))

    const age = calculateAge(response.data.person.birthdate);
    if (age < 18) {
        const error = { message: "La persona es menor de Edad.", code: "InvalidAge" }
        throw error;
    }
    response.data.person.birthdate = formatDate(response.data.person.birthdate);
    console.log(response.data.person)
    return response.data;
}

export const verifyDiscountPerson = async (qrData, persons) => {
    const person = pdf417ToPerson(qrData)

    const result = persons.find(x => x.rawData == qrData)

    if (result) {
        if (!comparePersons(result, person)) {
            throw { code: "DataMismatch" }
        }
        else if (!result.hasDiscount) {
            throw { code: "DiscountNotFound" }
        }
        return { person: result }
    }

    const rawData = {
        qrData
    }

    const response = await axios.get('', {
        params: {
            endpoint: '/qrPerson/validateDiscount',
            token: localStorage.getItem('token'),
            data: JSON.stringify(rawData)
        }
    })

    return response.data;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function comparePersons(person1, person2) {
    console.log(person1)
    return person1.name === person2.name &&
        person1.lastname === person2.lastname &&
        person1.dni === person2.dni &&
        new Date(person1.birthdate).getTime() ===  new Date(person2.birthdate).getTime();
}

function pdf417ToPerson(rawData) {

    if (!rawData) {
        const error = { code: "InvalidQR_NULL" }
        error.message = "Invalid raw data: Data is null or empty."
        throw error;
    }
    const parts = rawData.split("@");
    if (parts.length != 9) {
        const error = { code: "InvalidQR_FORMAT" }
        error.message = "Invalid raw data: Unexpected format."
        throw error;
    }
    const dni = Number(parts[4]);
    const name = parts[2];
    const lastname = parts[1];
    const [day, month, year] = parts[6].split("/");
    const birthdate = new Date(`${year}-${month}-${day}`);
    return { dni, name, lastname, birthdate, rawData };
}