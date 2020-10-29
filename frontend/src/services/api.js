import axios from 'axios';

const USER_TOKEN = localStorage.getItem('token')
const baseURL = 'http://localhost:8080/'

const api = axios.create({

    baseURL: baseURL,
    headers: {Authorization: USER_TOKEN}
})

export default api;

