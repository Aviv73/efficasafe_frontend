import { storageService } from '@/cms/services/storage.service';

function getMaterialPageHightMap(){
    return storageService.load('material-page-hight', true)
}

function setMaterialPageHightMap(data){
    const map = storageService.load('material-page-hight', true) || {}
    map[data.name] = data.hight
    storageService.store('material-page-hight', map, true)
}

export const materialUIService = {
    setMaterialPageHightMap,
    getMaterialPageHightMap
}