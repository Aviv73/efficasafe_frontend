export const storageService = {
    store,
    remove,
    load
}


function store(key, any) {
    localStorage[key] = JSON.stringify(any);
}

function load(key) {
    var str = localStorage[key] || 'null';
    return JSON.parse(str);
}

function remove(key) {
    localStorage.removeItem(key)
}

