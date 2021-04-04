import { httpService } from './http.service.js';

const END_POINT = 'label';

export const labelService = {
    list,
    getById,
    save,
    remove,
    removeMany,
    restore,
    getEmptyLabel,
    getLabelPaths
}

function list(filterBy = {}) {
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
    return labelPaths;
}


function getById(id) {
    return httpService.get(`${END_POINT}/${id}`);
}

function save(label) {
    if (label._id) return httpService.put(`${END_POINT}/${label._id}`, label);
    else return httpService.post(`${END_POINT}`, label);

}
function restore(label) {
    return httpService.post(`${END_POINT}`, label);
}

function remove(id) {
    httpService.delete(`${END_POINT}/${id}`);
}

function removeMany(ids) {
    httpService.delete(END_POINT, ids);
}

function getEmptyLabel() {
    return {
        name: '',
        color: '#000000ff',
        primaryMaterialIds: [],
        isSuper: false
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