import { updaterQueue, flushUpdaterQueue } from "./Component";

export function addEvent(dom, eventName, bindFunction) {
    dom.attch = dom.attch || {};
    dom.attch[eventName] = bindFunction;
    // 事件合成机制的核心点一：事件绑定到document
    if(document[eventName]) return;
    document[eventName] = dispatchEvent;
}

function dispatchEvent(nativeEvent) {
    updaterQueue.isBatch = true;

    // 事件合成机制的核心点二：屏蔽浏览器之间的差异
    let syntheticEvent = createSyntheticEvent(nativeEvent);
    let target = nativeEvent.target;
    while(target) {
        syntheticEvent.currentTarget = target;
        let eventName = `on${nativeEvent.type}`;
        let bindFunction = target.attch && target.attch[eventName];
        bindFunction && bindFunction(syntheticEvent);
        if(syntheticEvent.isPropagationStopped) break;
        target = target.parentNode;
    }

    flushUpdaterQueue();
}

function createSyntheticEvent(nativeEvent) {
    let nativeEventKeyValues = {};
    for(let key in nativeEvent) {
        nativeEventKeyValues[key] = typeof nativeEvent[key] === 'function' ? nativeEvent[key].bind(nativeEvent) : nativeEvent[key];
    }
    let syntheticEvent = Object.assign(nativeEventKeyValues, {
        nativeEvent,
        isDefaultPrevent: false,
        isPropagationStopped: false,
        preventDefault: function() {
            this.isDefaultPrevent = true;
            if(this.nativeEvent.preventDefault) {
                this.nativeEvent.preventDefault();
            } else {
                this.nativeEvent.returnValue = false;
            }
        },
        stopPropagation: function() {
            this.isPropagationStopped = true;
            if(this.nativeEvent.stopPropagation) {
                this.nativeEvent.stopPropagation();
            } else {
                this.nativeEvent.cancelBubble();
            }
        }

    });

    return syntheticEvent;
}