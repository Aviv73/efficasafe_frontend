import { httpService } from './http.service.js';

const END_POINT = 'label';

export const labelService = {
    list,
    getById,
    save,
    remove,
    getEmptyLabel,
    getLabelPaths
}

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

// Creates the label paths to be added to the material (material.labelPaths) from the v-tree-view
async function getLabelPaths(labels) {
    const filterBy = { src: 'atc' };
    const labelList = await list(filterBy);

    const labelPaths = labels.reduce((acc, label) => {

        var labelPath = [];
        _getLabelPath(labelList, label, labelPath);
        acc.push(labelPath);
        return acc;
    }, [])
    console.log('labelPaths', labelPaths)
    return labelPaths;
}


function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(label) {
    try {
        if (label._id) {
            return httpService.put(`${END_POINT}/${label._id}`, label)
        } else {
            return httpService.post(`${END_POINT}`, label)
        }
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function remove(labelId) {
    try {
        httpService.delete(`${END_POINT}/${labelId}`);
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