export const storageService = {
    store,
    remove,
    load
}


function store(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

function remove(key) {
    localStorage.removeItem(key);
}

