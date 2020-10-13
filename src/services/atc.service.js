import { httpService } from './http.service';

const END_POINT = 'label';

var atcLabels = [];
var atcChildrenLabels = [];

export const atcService = {
    list
}

async function list() {
    try {
        const res = await httpService.get(END_POINT);
        atcLabels = res.data.filter(label => label.src === 'atc' && !label.parentLabel);
        atcChildrenLabels = res.data.filter(label => label.src === 'atc' && label.parentLabel);

        atcLabels.forEach(node => {
            _traverse(node, 0, _buildChildren);
        })

        return atcLabels;

    } catch (err) {
        console.log('ERROR:', err);
    }
}

function _buildChildren(node) {
    if (node) {
        node.children = atcChildrenLabels.filter(label => node._id === label.parentLabel._id);
    }
}

function _traverse(node, depth, visitFn) {
    visitFn(node, depth);
    if (node.children) {
        node.children.forEach(childNode => {
            traverse(childNode, depth + 1, visitFn);
        });
    }
}