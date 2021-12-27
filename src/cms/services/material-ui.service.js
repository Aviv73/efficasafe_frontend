import { storageService } from '@/cms/services/storage.service';

function getMaterialPageHightMap(){
    return storageService.load('materialHight')
}
function removeMaterialPageHightMap(name){
    console.log('removed');
    const map = storageService.load('materialHight') || {}
    delete map[name]
}

function setMaterialPageHightMap(data){
    const map = storageService.load('materialHight') || {}
    map[data.name] = data.hight
    storageService.store('materialHight', map)
}

export const materialUIService = {
    setMaterialPageHightMap,
    getMaterialPageHightMap,
    removeMaterialPageHightMap
}