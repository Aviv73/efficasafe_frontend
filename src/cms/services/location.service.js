import axios from 'axios';

const DEFAULT_CURRENCY = 'USD'

export const locationService = {
    getLocalCurrency,
    getDefaultCurrency
}

async function getLocalCurrency() { 
    try{
        const key = 'dd874e02c7f2458ea31ce2c20de3a375'
        let res = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${key}&fields=currency`)
        const currencyCode = res.data.currency.currency_code
        if(currencyCode !== 'ILS' && currencyCode !== 'EUR') return DEFAULT_CURRENCY
        return currencyCode
    }catch(err){
        return DEFAULT_CURRENCY
    }
}
function getDefaultCurrency(){
    return DEFAULT_CURRENCY
}

// async function getLocalCurrency() { 
//     try{
//         let res = await axios.get('http://ip-api.com/json/?fields=currency')
//         return res.data.currency
//     }catch(err){
//         return 'ILS'
//     }
// }