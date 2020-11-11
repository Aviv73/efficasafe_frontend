export const storageService = {
    store,
    remove,
    load
}


function store(key, value, isSession = false) {
    const storage = (isSession) ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
}

function load(key, isSession = false) {
    const storage = (isSession) ? sessionStorage : localStorage;
    return JSON.parse(storage.getItem(key));
}

function remove(key, isSession = false) {
    const storage = (isSession) ? sessionStorage : localStorage;
    storage.removeItem(key);
}

