import axios from 'axios';
import config from '../config/index'

const DEFAULT_CURRENCY = 'USD'

export const locationService = {
    getLocalCurrency,
    getDefaultCurrency,
    getCountryName
}

async function getLocalCurrency() { 
    try{
        const key = config.abstractApiKey
        let res = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${key}&fields=currency`)
        const currencyCode = res.data.currency.currency_code
        if(currencyCode !== 'ILS' && currencyCode !== 'EUR') return DEFAULT_CURRENCY
        return currencyCode
    }catch(err){
        return DEFAULT_CURRENCY
    }
}

async function getCountryName(){
    try{
        const key = config.abstractApiKey
        let res = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${key}&fields=country`)
        return res.data.country
    }catch(err){
        return 'unknown'
    }
}
function getDefaultCurrency(){
    return DEFAULT_CURRENCY
}