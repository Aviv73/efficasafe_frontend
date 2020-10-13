import axios from 'axios'

const baseUrl = (process.env.NODE_ENV !== 'development') ? '/label' : '//localhost:4000/label'

var atcLabels = []
var atcChildrenLabels = []

export const atcService = {
    list,
}

async function list() {
    try {
        const res = await axios.get(`${baseUrl}`)
        atcLabels = res.data.filter(label => label.src === 'atc' && !label.parentLabel)
        atcChildrenLabels = res.data.filter(label => label.src === 'atc' && label.parentLabel)

        atcLabels.forEach(node => {
            traverse(node, 0, buildChildren)
        })

        return atcLabels

    } catch (err) {
        console.log('ERROR:', err)
    }
}

function buildChildren(node) {
    if (node) {
        node.children = atcChildrenLabels.filter(label => node._id === label.parentLabel._id)
    }
}

function traverse(node, depth, visitFn) {
    visitFn(node, depth);
    if (node.children) {
        node.children.forEach(childNode => {
            traverse(childNode, depth + 1, visitFn);
        });
    }
}