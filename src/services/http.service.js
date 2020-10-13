import Axios from 'axios';
var axios = Axios.create({
    withCredentials: true
});

// We are not using api in our path atm
var BASE_URL = (process.env.NODE_ENV === 'development') ? '//localhost:3000/api/' : '/api/'

export const httpService = {
    get(endpoint, data){
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data){
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data){
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data){
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method='get', data=null) {
    try {
        var config = {
            url: `${BASE_URL}${endpoint}`,
            method
        }
        if (method === 'get' || method === 'GET') config.params = {data}
        else config.data = data
        
        const res = await axios(config)
        return res.data;
    } catch (err) {
        if (err.response.status === 401) {
            console.log('Unautonticated');
            throw new Error('Unautonticated')
        }
    }
}

