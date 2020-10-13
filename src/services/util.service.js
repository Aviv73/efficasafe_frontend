export const utilService = {
    makeId
}

function makeId(length = 7) {
    var id = '';
    var possible = '0123456789';
    for (var i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return +id;
}