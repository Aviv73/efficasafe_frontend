import { httpService } from './http.service.js';

const END_POINT = 'interaction';

export const interactionService = {
    list,
    getById,
    save,
    remove,
    getEmptyInteraction
}

async function list(filterBy) {
    try {

        const data = await httpService.get(END_POINT, filterBy);

         
        

        return data;

    } catch (err) {
        console.log('ERROR:', err)
    }
}

function getById(id) {
    try {
        return httpService.get(`${END_POINT}/${id}`);
    } catch (err) {
        console.log('ERROR:', err);
    }
}

function save(interaction) {
    try {
        if (interaction._id) {
            return httpService.put(`${END_POINT}/${interaction._id}`, interaction);
        } else {
            return httpService.post(`${END_POINT}`, interaction);
        }
    } catch (err) {
        console.log('ERROR:', err);
    }
}

function remove(id) {
    try {
        httpService.delete(`${END_POINT}/${id}`);
    } catch (err) {
        console.log('ERROR:', err);
    }
}

function getEmptyInteraction() {
    return {
        
    }
}