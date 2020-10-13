import axios from 'axios'

const baseUrl = (process.env.NODE_ENV !== 'development') ? '/reference' : '//localhost:4000/reference'

export const referenceService = {
    list,
    saveReferences
}

async function saveReferences(references) {
    const newReferences = []
    const referencesList = await list()
    try {
        for (let i = 0; i < references.length; i++) {
            const currRef = references[i];
            const res = referencesList.find(refItem => {
                if (refItem.text && refItem.text === currRef.text) return refItem
                if (refItem.link && refItem.link === currRef.link) return refItem
                if (refItem.pubmedId && refItem.pubmedId === currRef.pubmedId) return refItem
            })

            if (res) {
                console.log('REF ALREADY EXISTS:', res._id)
                newReferences.push(res)
            } else {
                const newRef = await axios.post(`${baseUrl}`, currRef)
                console.log('NEW REF UPLOADED!', newRef.data._id)
                newReferences.push(newRef.data)
            }
        }

        return newReferences
    } catch (err) {
        console.log('ERROR:', err)
    }
}

async function list() {
    const res = await axios.get(`${baseUrl}`)
    try {
        return res.data

    } catch (err) {
        console.log('ERROR:', err)
    }
}