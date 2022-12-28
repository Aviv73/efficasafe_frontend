export const utilService = {
    makeId,
    escapeStrRegex,
    replaceTextContent,
    regexIndexOf,
    checkIfInsideRef,
    transHebrew,
    getMousePosition
}

function checkIfInsideRef(txt, refIdx) {
    let isOpenerExists = false;
    let iscloserExists = false;

    for (let i = refIdx - 1; i >= 0; i--) {
        if (txt.charAt(i) === '(') {
            isOpenerExists = true;
            break;
        }
        if (txt.charAt(i).match(/[A-Za-z%]/g)) return false;
    }
    for (let i = refIdx + 1; i < txt.length; i++) {
        if (txt.charAt(i) === ')') {
            iscloserExists = true;
            break;
        }
        if (txt.charAt(i).match(/[A-Za-z%]/g)) return false;
    }
    return isOpenerExists && iscloserExists;
}

function regexIndexOf(string, regex, startpos) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
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

function transHebrew(str){
    const hebEngMap = {
        'ק': 'e',
        'ר': 'r',
        'א': 't',
        'ט': 'y',
        'ו': 'u',
        'ן': 'i',
        'ם': 'o',
        'פ': 'p',
        'ש': 'a',
        'ד': 's',
        'ג': 'd',
        'כ': 'f',
        'ע': 'g',
        'י': 'h',
        'ח': 'j',
        'ל': 'k',
        'ך': 'l',
        'ף': ';',
        'ז': 'z',
        'ס': 'x',
        'ב': 'c',
        'ה': 'v',
        'נ': 'b',
        'מ': 'n',
        'צ': 'm',
        'ת': ',',
        'ץ': '.',
    }
    const hebChars = str.split('')
    const engChars = hebChars.map( c => {
        if(c === ' ') return c
        return hebEngMap[c]
    })
    return engChars.join('')
}

function makeId(length = 20) {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function escapeStrRegex(str) {
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

function getMousePosition(event) {
    var eventDoc, doc, body;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        return {
            x: event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0),
            y: event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 )
        };
    }

    return { x: event.pageX, y: event.pageY };
}