import axios from 'axios'

const materialArchivePath = (process.env.NODE_ENV !== 'development') ? '/archiveMaterial' : '//localhost:4000/archiveMaterial'
const labelArchivePath = (process.env.NODE_ENV !== 'development') ? '/archiveLabel' : '//localhost:4000/archiveLabel'
const interactionArchivePath = (process.env.NODE_ENV !== 'development') ? '/archiveInteraction' : '//localhost:4000/archiveInteraction'

const materialPath = (process.env.NODE_ENV !== 'development') ? '/material' : '//localhost:4000/material'
const labelPath2 = (process.env.NODE_ENV !== 'development') ? '/label' : '//localhost:4000/label'
const interactionPath = (process.env.NODE_ENV !== 'development') ? '/interaction' : '//localhost:4000/interaction'


export const archiveService = {
    archiveMaterialList,
    saveMaterialToArchive,
    saveLabelToArchive,
    saveInteractionToArchive,
    archiveLabelList,
    archiveInteractionList,
    restoreMaterial,
    restoreLabel,
    restoreInteraction,
    removeMaterial,
    removeLabel,
    removeInteraction,
    getMatrialById,
    getLabelById,
    getInteractionById

}


// List functions:
async function archiveMaterialList(filterBy) {
    try {
        if (filterBy) {
            var queryParams = new URLSearchParams()
            if (filterBy.q) queryParams.set('q', filterBy.q)
            if (filterBy.type !== 'all' && filterBy.type) queryParams.set('type', filterBy.type)
            if (Array.isArray(filterBy.material)) {
                for (let i = 0; i < filterBy.material.length; i++) {
                    queryParams.append('_id', filterBy.material[i])
                }
            } else if (filterBy.material) {
                queryParams.set('_id', filterBy.material)
            }
        }

        const res = await axios.get(`${materialArchivePath}?${queryParams}`)
        if (filterBy && filterBy.label) {
            const labelId = +filterBy.label
            const materials = res.data.reduce((acc, material) => {
                material.labelPaths.forEach(labelPath => {
                    labelPath.forEach(label => {
                        if (label._id === labelId) {
                            acc.push(material)
                        }
                    })
                });
                return acc
            }, [])
            return materials
        }

        return res.data
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function archiveLabelList(filterBy) {
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

        const res = await axios.get(`${labelArchivePath}?${queryParams}`)
        return res.data
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function archiveInteractionList(filterBy) {
    try {
        if (filterBy) {
            var queryParams = new URLSearchParams()
            if (filterBy.type !== 'all' && filterBy.type) queryParams.set('type', filterBy.type)
            if (filterBy.isActive !== 'all' && filterBy.isActive) queryParams.set('isActive', filterBy.isActive)
            if (filterBy.q) {
                const sides = filterBy.q.split(',')
                for (let i = 0; i < sides.length; i++) {
                    queryParams.append('q', sides[i])
                }
            }
        }

        const res = await axios.get(`${interactionArchivePath}?${queryParams}`)

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

// Get by ID:
async function getMatrialById(id) {
    try {
        const res = await axios.get(`${materialArchivePath}/${id}`)
        return res.data
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function getLabelById(id) {
    try {
        const res = await axios.get(`${labelArchivePath}/${id}`)
        return res.data
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function getInteractionById(id) {
    try {
        const res = await axios.get(`${interactionArchivePath}/${id}`)
        return res.data
    } catch (err) {
        console.log('ERROR:', err)
    }
}


// Save to Archive functions:

async function saveMaterialToArchive(material) {
    try {
        const res = await axios.post(`${materialArchivePath}`, material)
        return res.data

    } catch (err) {
        console.log('ERROR:', err)
    }
}
async function saveLabelToArchive(label) {
    try {
        const res = await axios.post(`${labelArchivePath}`, label)
        return res.data

    } catch (err) {
        console.log('ERROR:', err)
    }
}
async function saveInteractionToArchive(interaction) {
    try {
        const res = await axios.post(`${interactionArchivePath}`, interaction)
        return res.data

    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function removeMaterial(id) {
    try {
        const isRemoved = await axios.delete(`${materialArchivePath}/${id}`)
        // console.log('Removed material from Archive:', id)
        return isRemoved
    } catch (err) {
        console.log('RESTORE-MATERIAL ERROR:', err)
        return false
    }
}

async function removeLabel(id) {
    try {
        const isRemoved = await axios.delete(`${labelArchivePath}/${id}`)
        // console.log('Removed label from Archive:', id)
        return isRemoved
    } catch (err) {
        console.log('RESTORE-LABEL ERROR:', err)
        return false
    }
}

async function removeInteraction(id) {
    try {
        const isRemoved = await axios.delete(`${interactionArchivePath}/${id}`)
        // console.log('Removed interaction from Archive:', id)
        return isRemoved
    } catch (err) {
        console.log('RESTORE-Interaction ERROR:', err)
        return false
    }
}

// Restore functions:
async function restoreMaterial(material) {
    try {
        const isRestored = await axios.post(`${materialPath}`, material)
        // console.log('Restored material:', material._id)
        return isRestored
    } catch (err) {
        console.log('RESTORE-MATERIAL ERROR:', err)
        return false
    }
}

async function restoreLabel(label) {
    try {
        const isRestored = await axios.post(`${labelPath2}`, label)
        // console.log('Restored label:', label._id)
        return isRestored
    } catch (err) {
        console.log('RESTORE-LABEL ERROR:', err)
        return false
    }
}

async function restoreInteraction(interaction) {
    try {
        const isRestored = await axios.post(`${interactionPath}`, interaction)
        // console.log('Restored interaction:', interaction._id)
        return isRestored
    } catch (err) {
        console.log('RESTORE-INTERACTION ERROR:', err)
        return false
    }
}