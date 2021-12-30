import axios from 'axios';

export const locationService = {
    getLocalCurrency,
}

async function getLocalCurrency() { 
    try{
        let res = await axios.get('http://ip-api.com/json/?fields=currency')
        console.log(res.data);
        return res.data.currency
    }catch(err){
        console.log(err);
        return 'USD'
    }
}