import axios from 'axios'

const baseUrl = (process.env.NODE_ENV !== 'development') ? '/label' : '//localhost:4000/label'

export const labelService = {
    list,
    getById,
    save,
    remove,
    getEmptyLabel,
    getLabelPaths
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

async function getLabelPaths(labels) {
    const filterBy = { src: 'atc' }
    const labelList = await list(filterBy)

    const labelPaths = labels.reduce((acc, label) => {

        var labelPath = []
        _getLabelPath(labelList, label, labelPath)
        acc.push(labelPath)
        return acc
    }, [])
    // console.log('labelPaths', labelPaths)
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

async function getById(id) {
    try {
        const res = await axios.get(`${baseUrl}/${id}`)
        return res.data
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function save(label) {
    try {
        if (label._id) {
            return await axios.put(`${baseUrl}/${label._id}`, label)
        } else {
            label._id = _makeId()
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


function _makeId(length = 7) {
    var txt = ''
    var possible = '0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return +txt;
}