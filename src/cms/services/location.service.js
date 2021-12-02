import axios from 'axios';

export const locationService = {
    getLocalCurrency,
}

async function getLocalCurrency() { 
    try{
        let res = await axios.get('http://ip-api.com/json/?fields=currency')
        return res.data.currency
    }catch(err){
        return 'USD'
    }
}