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
        if (filterBy) {
            var queryParams = new URLSearchParams();
            if (filterBy.type !== 'all' && filterBy.type) queryParams.set('type', filterBy.type);
            if (filterBy.isActive !== 'all' && filterBy.isActive) queryParams.set('isActive', filterBy.isActive);

            if (filterBy.q) {
                const sides = filterBy.q.split(',');
                for (let i = 0; i < sides.length; i++) {
                    queryParams.append('q', sides[i]);
                }
            }
        }

        const data = httpService.get(`${END_POINT}?${queryParams}`);

        if (filterBy.material || filterBy.label) {
            const materialId = +filterBy.material;
            const labelId = +filterBy.label;

            const interactions = data.reduce((acc, interaction) => {
                if (interaction.side1MaterialId) {
                    if (interaction.side1MaterialId._id === materialId) {
                        acc.push(interaction)
                    }
                } else {
                    if (interaction.side1LabelId._id === labelId) {
                        acc.push(interaction)
                    }
                }

                if (interaction.side2MaterialId) {
                    if (interaction.side2MaterialId._id === materialId) {
                        acc.push(interaction)
                    }
                } else {
                    if (interaction.side2LabelId._id === labelId) {
                        acc.push(interaction)
                    }
                }

                return acc

            }, [])

            return interactions
        }

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