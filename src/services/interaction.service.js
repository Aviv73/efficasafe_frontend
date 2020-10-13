import axios from 'axios'
import { utilService } from './util.service.js'

const baseUrl = (process.env.NODE_ENV !== 'development') ? '/interaction' : '//localhost:4000/interaction'

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
            var queryParams = new URLSearchParams()
            // if (filterBy.q) queryParams.set('q', filterBy.q)
            if (filterBy.type !== 'all' && filterBy.type) queryParams.set('type', filterBy.type)
            if (filterBy.isActive !== 'all' && filterBy.isActive) queryParams.set('isActive', filterBy.isActive)

            if (filterBy.q) {
                const sides = filterBy.q.split(',')
                for (let i = 0; i < sides.length; i++) {
                    queryParams.append('q', sides[i])
                }
            }
        }

        const res = await axios.get(`${baseUrl}?${queryParams}`)

        if (filterBy.material || filterBy.label) {
            const materialId = +filterBy.material
            const labelId = +filterBy.label

            const interactions = res.data.reduce((acc, interaction) => {
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

async function save(interaction) {
    try {
        if (interaction._id) {
            const res = await axios.put(`${baseUrl}/${interaction._id}`, interaction)
            return res.data
        } else {
            interaction._id = utilService.makeId()
            const res = await axios.post(`${baseUrl}`, interaction)
            return res.data
        }
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function remove(id) {
    try {
        await axios.delete(`${baseUrl}/${id}`)
    } catch (err) {
        console.log('ERROR:', err)
    }
}

function getEmptyInteraction() {
    return {
        isActive: true,
        side1MaterialId: null,
        side1LabelId: null,
        side2MaterialId: null,
        side2LabelId: null,
        type: '',
        src: '',
        summary: '',
        evidenceLevel: '',
        recommendation: '',
        note: '',
        indications: [],
        references: [],
        reviewOfStudies: {
            main: '',
            details: ''
        },
        monitor: {
            labTests: [],
            otherTests: [],
            symptoms: []
        },
        editorDraft: {
            general: '',
            infoSide1: '',
            infoSide2: '',
            gates: ""
        }
    }
}