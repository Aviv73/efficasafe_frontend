import axios from 'axios';
import config from '../config/index'

const DEFAULT_CURRENCY = 'USD';
// const DEFAULT_CURRENCY = 'ILS';

export const locationService = {
    getLocalCurrency,
    getDefaultCurrency,
    getCountryName
}

const KEY = config.abstractApiKey

async function getLocalCurrency() { 
    try{
        let res = await _getIpData();
        const currencyCode = res.currency.code;
        if(currencyCode !== 'ILS' && currencyCode !== 'EUR') return DEFAULT_CURRENCY
        return currencyCode
    }catch(err){
        console.error(err);
        return DEFAULT_CURRENCY
    }
}

async function getCountryName(){
    try{
        let res = await _getIpData()
        return res.country_name
    }catch(err){
        return 'unknown'
    }
}
function getDefaultCurrency(){
    return DEFAULT_CURRENCY
}


async function _getIpData() {
    const res = await await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${KEY}`);
    return res.data;
}

// async function getClientIp() {
//     const response = await fetch("https://api.ipify.org?format=json");
//     if (response.ok) {
//         const data = await response.json();
//         return data.ip;
//     } else {
//         throw new Error(`Request failed with status code: ${response.status}`);
//     }
// }