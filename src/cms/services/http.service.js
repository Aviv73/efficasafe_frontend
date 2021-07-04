import Axios from 'axios';
import { storageService } from './storage.service'

var axios = Axios.create({
    withCredentials: true
});

const BASE_URL = (process.env.NODE_ENV === 'development') ? '//localhost:3000/api/' : '/api/';

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data);
    },
    post(endpoint, data) {

        return ajax(endpoint, 'POST', data);
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data);
    },
    patch(endpoint, data) {
        return ajax(endpoint, 'PATCH', data);
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data);
    }
}

async function ajax(endpoint, method = 'get', data = null) {
    try {
        var config = {
            url: `${BASE_URL}${endpoint}`,
            method,
            headers: {
                authorization: storageService.load('token')
            }
        }
        if (method === 'get' || method === 'GET') config.params = { data };
        else config.data = data;
        const res = await axios(config);
        return res.data;
    } catch (err) {
        if (err.response && err.response.status === 401) {
            console.log('Unautonticated');
            throw new Error('Unautonticated');
        }
    }
}

