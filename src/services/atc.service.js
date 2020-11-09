import { httpService } from './http.service';

const END_POINT = {
    ATC: 'atc',
    MATERIAL: 'material'
};

var atcTrees = [];
var materialParentIdsMap = {};


export const atcService = {
    list
}

async function list() {
    const [ matData, atcData ] = await Promise.all([
        httpService.get(END_POINT.MATERIAL, { atcId: true }),
        httpService.get(END_POINT.ATC)
    ]); 
    atcTrees = atcData;
    materialParentIdsMap = _getMatParentIdsMap(matData.materials);
    
    atcTrees.forEach(tree => {
        _traverse(tree, 0, _buildChildren);
    });
    
    return atcTrees;
}

function _buildChildren(node) {
    const atcId = _getAtcId(node.name);
    var nodeChilds = materialParentIdsMap[atcId];
    if (nodeChilds) {
        node.children = nodeChilds;
        node.children.forEach(child => {
            child.parentId = node.id;
        });
    }
}

function _traverse(node, depth, visitFn) {
    if (depth > 4) return;
    visitFn(node, depth);
    if (node.children) {
        node.children.forEach(childNode => {
            _traverse(childNode, depth + 1, visitFn);
        });
    }
}

function _getMatParentIdsMap(materials) {
    return materials.reduce((acc, mat) => {
        mat.atcPaths.forEach(path => {
            const parentATCbranch = path[path.length - 1];
            const parentAtcId = _getAtcId(parentATCbranch);
            
            if (!acc[parentAtcId]) acc[parentAtcId] = [];
            acc[parentAtcId].push({ ...mat });
        });
        return acc;
    }, {});
}

function _getAtcId(name) {
    return name.split(' ')[0];
}