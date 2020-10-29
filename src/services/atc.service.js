import { httpService } from './http.service';

const END_POINT = {
    LABEL: 'label',
    MATERIAL: 'material'
};


var atcLabels = [];
var atcChildrenLabels = [];
var materialParentIdsMap = {};


export const atcService = {
    list
}

async function list() {
    const [labels, materials] = await Promise.all([
        httpService.get(END_POINT.LABEL, { src: 'atc' }),
        httpService.get(END_POINT.MATERIAL, { atcId: true })
    ]);

    atcLabels = labels.filter(label => !label.parentLabel);
    atcChildrenLabels = labels.filter(label => label.parentLabel);
    materialParentIdsMap = _getMatParentIdsMap(materials);
    
    atcLabels.forEach(node => {
        _traverse(node, 0, _buildChildren);
    });

    return atcLabels;
}

function _buildChildren(node) {
    if (!node) return;
    node.children = atcChildrenLabels.filter(label => node._id === label.parentLabel._id);

    var nodeChilds = materialParentIdsMap[node._id];
    if (!node.children.length && nodeChilds) {
        const { _id, name } = node;
        nodeChilds.forEach(child => {
            child.parentLabel = {
                _id,
                name
            }
        });
        node.children = nodeChilds;
    }
}

function _traverse(node, depth, visitFn) {
    visitFn(node, depth);
    if (node.children && node.children.length) {
        node.children.forEach(childNode => {
            _traverse(childNode, depth + 1, visitFn);
        });
    }
}

function _getMatParentIdsMap(materials) {
    return materials.reduce((acc, mat) => {
        mat.labelPaths.forEach(path => {
            const parentLabelId = path[path.length - 1]._id;
            if (!acc[parentLabelId]) acc[parentLabelId] = [];
            acc[parentLabelId].push({ ...mat });
        });
        return acc;
    }, {});
}