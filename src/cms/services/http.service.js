import Axios from 'axios';
import { storageService } from './storage.service'

var axios = Axios.create({
    withCredentials: true
});

const BASE_URL = (process.env.NODE_ENV === 'development') ? '//localhost:3000/api/' : '/api/';

export const httpService = {
    get(endpoint, data, responseType, contentType) {
        return ajax(endpoint, 'GET', data, responseType, contentType);
    },
    post(endpoint, data, responseType, contentType) {
        return ajax(endpoint, 'POST', data, responseType, contentType);
    },
    put(endpoint, data, responseType, contentType) {
        return ajax(endpoint, 'PUT', data, responseType, contentType);
    },
    patch(endpoint, data, responseType, contentType) {
        return ajax(endpoint, 'PATCH', data, responseType, contentType);
    },
    delete(endpoint, data, responseType, contentType) {
        return ajax(endpoint, 'DELETE', data, responseType, contentType);
    }
}

async function ajax(endpoint, method = 'get', data = null, responseType = 'json',contentType = 'application/json' ) {
    try {
        var config = {
            url: `${BASE_URL}${endpoint}`,
            method,
            responseType,
            headers: {
                authorization: storageService.load('token'),
                'Content-Type': contentType            
            },
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

