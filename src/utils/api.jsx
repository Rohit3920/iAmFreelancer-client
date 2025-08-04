import axios from 'axios';
export let URL = 'http://localhost:5000'

const token = localStorage.getItem('token')
const api = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : token
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // config.headers['x-auth-token'] = token;
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;