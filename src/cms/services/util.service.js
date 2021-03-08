export const utilService = {
    makeId,
    escapeStrRegex,
    replaceTextContent
}

function replaceTextContent(el, txt, newTxt, isPartOfCompound) {
    if (el.nodeType === 3) {
        if (isPartOfCompound) {
            const idx = el.nodeValue.indexOf(' & ');
            el.nodeValue = el.nodeValue.substring(0, idx).replace(txt, newTxt) + el.nodeValue.substring(idx);
        } else el.nodeValue = el.nodeValue.replace(txt, newTxt);
    }
    const children = Array.from(el.childNodes);
    if (children.length) {
        Array.from(children).forEach(childNode => {
            replaceTextContent(childNode, txt, newTxt, isPartOfCompound)
        });
    }
}

function makeId(length = 20) {
    var id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function escapeStrRegex(str) {
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}