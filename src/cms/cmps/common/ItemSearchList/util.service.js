
export function setDeepVal(obj, field, val, seperator = '.') {
  const splited = field.split(seperator);
  const firstField = splited.shift();
  if (splited.length) {
      if (!obj[firstField]) obj[firstField] = {};
      setDeepVal(obj[firstField], splited.join(seperator), val);
  }
  else obj[firstField] = val;
}

export function deepIterateWithObj(obj, cb, seperator = '.', rootKey = '') {
  for (let key in obj) {
    let val = obj[key];
    const deepKey = rootKey? `${rootKey}${seperator}${key}` : key;
    if (typeof val === 'object') deepIterateWithObj(val, cb, seperator, deepKey);
    else cb(deepKey, val);
  }
}

export function getRandomInt(num1, num2, inclusive = false) {
  var max = (num1 >= num2)? num1 : num2;
  if (inclusive) max += 1;
  var min = (num1 <= num2)? num1 : num2;
  return (Math.floor(Math.random()*(max - min)) + min);
}

export function getRandomId(s = '-') {
  var pt1 = Date.now().toString(16);
  var pt2 = getRandomInt(1000, 9999).toString(16);
  var pt3 = getRandomInt(1000, 9999).toString(16);
  return `ID_${pt3}${s}${pt1}${s}${pt2}`.toUpperCase();
}

export function padNum(num, length = 2) {
    var numStr = num.toString();
    if (numStr.length >= length) return numStr;
    return '0'.repeat(length-numStr.length) + numStr;
}
