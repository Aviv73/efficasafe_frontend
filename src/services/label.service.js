import { httpService } from './util.service.js';

const END_POINT = 'label';

export const labelService = {
    list,
    getById,
    save,
    remove,
    getEmptyLabel,
    getLabelPaths
}

// Creates the label paths to be added to the material (material.labelPaths) from the v-tree-view
async function getLabelPaths(labels) {
    const filterBy = { src: 'atc' }
    const labelList = await list(filterBy)

    const labelPaths = labels.reduce((acc, label) => {

        var labelPath = []
        _getLabelPath(labelList, label, labelPath)
        acc.push(labelPath)
        return acc
    }, [])
    return labelPaths
}

async function list(filterBy) {
    try {
        if (filterBy) {
            var queryParams = new URLSearchParams()
            if (filterBy.q) queryParams.set('q', filterBy.q)
            if (filterBy.src !== 'all' && filterBy.src) queryParams.set('src', filterBy.src)
            if (Array.isArray(filterBy.label)) {

                for (let i = 0; i < filterBy.label.length; i++) {
                    queryParams.append('_id', filterBy.label[i])

                }

            } else if (filterBy.label) {
                queryParams.set('_id', filterBy.label)
            }


        }

        const res = await axios.get(`${baseUrl}?${queryParams}`)
        // return res.data.slice(0, 99)
        return res.data
    } catch (err) {
        console.log('ERROR:', err)
    }
}

function getById(id) {
    return httpService.get(`${baseUrl}/${id}`);
}

async function save(label) {
    try {
        if (label._id) {
            return await axios.put(`${baseUrl}/${label._id}`, label)
        } else {
            return await axios.post(`${baseUrl}`, label)
        }
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function remove(labelId) {
    try {
        await axios.delete(`${baseUrl}/${labelId}`)
    } catch (err) {
        console.log('ERROR:', err)
    }
}


function getEmptyLabel() {
    return {
        _id: '',
        src: 'other',
        atcId: '',
        name: '',
        parentLabel: '',
        color: '#FFFFFF00'
    }
}

function _getLabelPath(atcLabels, label, labelPath) {
    labelPath.unshift(
        {
            _id: label._id,
            name: label.name,
        }
    )

    if (label.parentLabel) {
        const parent = atcLabels.find(atcLabel => {
            return atcLabel._id === label.parentLabel._id
        })
        if (parent.parentLabel) {
            _getLabelPath(atcLabels, parent, labelPath)
        } else {
            labelPath.unshift(
                {
                    _id: parent._id,
                    name: parent.name,
                }
            )
            return labelPath
        }

    } else {
        return labelPath
    }
}