export const REACT_ELEMENT = Symbol('react.element');
export const REACT_FORWARD_REF = Symbol('react.forward_ref');
export const CREATE = Symbol('react.dom.diff.create');
export const MOVE = Symbol('react.dom.diff.move');
export const REACT_TEXT = Symbol('react.text');
export const toVNode = (node) => {
    return typeof node === 'string' || typeof node === 'number' ? {
        type: REACT_TEXT,
        props: { text: node }
    } : node;
}

export const deepClone = (data) => {
    let type = getType(data);
    let resultValue;
    if(type !== 'array' && type !== 'object') return data;
    if(type === 'array') {
        resultValue = [];
        data.forEach(item => {
            resultValue.push(deepClone(item));
        });
        return resultValue;
    }
    if(type === 'object') {
        resultValue = {};
        for(let key in data) {
            if(data.hasOwnProperty(key)) {
                resultValue[key] = deepClone(data[key]);
            }
        }
        return resultValue;
    }
}

export function getType(obj) {
    let toString = Object.prototype.toString;
    let typeMap = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };

    return typeMap[toString.call(obj)]
}

export const shallowCompare = (obj1, obj2) => {
    if(obj1 === obj2) return true;
    if(getType(obj1) !== 'object' || getType(obj2) !== 'object') return false;
    
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if(keys1.length !== keys2.length) return false;

    for(let key in obj1) {
        if(!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) return false
    }
    return true;
}