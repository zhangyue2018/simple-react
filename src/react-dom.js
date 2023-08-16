import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from "./utils";
import { addEvent } from './event';

// 初始化渲染，不仅仅是挂载的逻辑
function render(VNode, containerDOM) {
    // 将虚拟DOM转化成真实DOM
    // 将得到的真实DOM挂载到containerDOM中
    mount(VNode, containerDOM);
}

function mount(VNode, containerDOM) {
    let newDOM = createDOM(VNode);
    newDOM && containerDOM.appendChild(newDOM);
}

// 创建真实DOM
function createDOM(VNode) {
    //1.创建元素 2.处理子元素 3.处理属性值
    const {type, props, ref} = VNode;
    let dom;
    // 判断是否是使用React.forwardRef生成的对象
    if(type && type.$$typeof === REACT_FORWARD_REF) {
        return getDomByForwardRefFunction(VNode);
    }

    if(typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT) {
        return getDomByClassComponent(VNode);
    }
    if(typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
        return getDomByFunctionComponent(VNode);
    }
    if(type === REACT_TEXT) {
        dom = document.createTextNode(props.text);
    } else if(type && VNode.$$typeof === REACT_ELEMENT) {
        dom = document.createElement(type);
    }
    if(props) {
        if(typeof props.children === 'object' && props.children.type) {
            mount(props.children, dom);
        } else if(Array.isArray(props.children)) {
            mountArray(props.children, dom);
        }
    }

    // 给DOM设置属性值
    setPropsForDOM(dom, props);
    // 将真实DOM挂到虚拟DOM上面
    VNode.dom = dom;
    ref && (ref.current = dom);

    return dom;
}

function getDomByClassComponent(VNode) {
    let { type, props, ref } = VNode;
    let instance = new type(props);
    let renderVNode = instance.render();
    instance.oldVNode = renderVNode;
    ref && (ref.current = instance);
    if(!renderVNode) return null;
    return createDOM(renderVNode);
}

function getDomByFunctionComponent(VNode) {
    let { type, props } = VNode;
    let renderVNode = type(props);
    if(!renderVNode) return null;
    return createDOM(renderVNode);
}

function getDomByForwardRefFunction(VNode) {
    let { type, props, ref } = VNode;
    let renderVNode = type.render(props, ref);
    if(!renderVNode) return null;
    return createDOM(renderVNode);

}
// 给DOM设置属性值
function setPropsForDOM(dom, VNodeProps) {
    if(!dom) return;
    for(let key in VNodeProps) {
        if(key === 'children') continue;
        if(/^on[A-Z].*/.test(key)) {
            addEvent(dom, key.toLowerCase(), VNodeProps[key]);
        } else if(key === 'style') {
            Object.keys(VNodeProps[key]).forEach(keyName => {
                dom.style[keyName] = VNodeProps[key][keyName];
            });
        } else {
            dom[key] = VNodeProps[key];
        }
    }
}

function mountArray(children, parent) {
    if(!Array.isArray(children)) return;
    for(let i=0; i<children.length; i++) {
        children[i].index = i;
        mount(children[i], parent);
    }
}
// 找到虚拟DOM对应的真实DOM
export function findDomByVNode(VNode) {
    if(!VNode) return;
    if(VNode.dom) return VNode.dom;
}

export function updateDomTree(oldVNode, newVNode, oldDOM) {
    let parentNode = oldDOM.parentNode;
    // 新节点，旧节点都不存在
    // 新节点存在，旧节点不存在
    // 新节点不存在，旧节点存在
    // 新节点存在，旧节点也存在，但是类型不一样
    // 新节点存在，旧节点也存在，且类型一样 ----> 值得我们进行深入的比较，探索复用相关节点的方案
    const typeMap = {
        NO_OPERATE: !oldVNode && !newVNode,
        ADD: !oldVNode && newVNode,
        DELETE: oldVNode && !newVNode,
        REPLACE: oldVNode && newVNode && oldVNode.type !== newVNode.type
    };

    let UPDATE_TYPE = Object.keys(typeMap).filter(key => typeMap[key])[0];

    switch(UPDATE_TYPE) {
        case 'NO_OPERATE':
            break;
        case 'DELETE':
            removeVNode(oldVNode);
            break;
        case 'ADD':
            oldDOM.parentNode.appendChild(createDOM(newVNode));
            break;
        case 'REPLACE':
            removeVNode(oldVNode);
            oldDOM.parentNode.appendChild(createDOM(newVNode));
            break;
        default:
            // 深度的dom diff，新老虚拟DOM都存在且类型相同
            deepDOMDiff(oldVNode, newVNode);
            break;
    }

}

function removeVNode(oldVNode) {
    const currentDOM = findDomByVNode(oldVNode);
    if(currentDOM) currentDOM.remove();
}

function deepDOMDiff(oldVNode, newVNode) {
    let diffTypeMap = {
        ORIGIN_NODE: typeof oldVNode.type === 'string',
        CLASS_COMPONENT: typeof oldVNode.type === 'function' && oldVNode.type.IS_CLASS_COMPONENT,
        FUNCTION_COMPONENT: typeof oldVNode.type === 'function',
        TEXT: oldVNode.type === REACT_TEXT
    };

    let DIFF_TYPE = Object.keys(diffTypeMap).filter(key => diffTypeMap[key])[0];
    switch(DIFF_TYPE) {
        case 'ORIGIN_NODE':
            let currentDOM = newVNode.dom = findDomByVNode(oldVNode);
            setPropsForDOM(currentDOM, newVNode.props);
            updateChildren(currentDOM, oldVNode.props.children, newVNode.props.children);
            break;
        case 'CLASS_COMPONENT':
            updateClassComponent(oldVNode, newVNode);
            break;
        case 'FUNCTION_COMPONENT':
            updateFunctionComponent(oldVNode, newVNode);
            break;
        case 'TEXT':
            newVNode.dom = findDomByVNode(oldVNode);
            newVNode.dom.textContent = newVNode.props.text;
            break;
        default:
            break;

    }
}

function updateClassComponent(oldVNode, newVNode) {
    const classInstance = newVNode.classInstance = oldVNode.classInstance;
    classInstance.updater.launchUpdate();
}

function updateFunctionComponent(oldVNode, newVNode) {
    let oldDOM = findDomByVNode(oldVNode);
    if(!oldDOM) return;
    const { type, props } = newVNode;
    let newRenderVNode = type(props);
    updateDomTree(oldVNode.oldRenderVNode, newRenderVNode, oldDOM);
    newVNode.oldRenderVNode = newRenderVNode;
}


// DOM DIFF 算法的核心
function updateChildren(currentDOM, oldVNodeChildren, newVNodeChildren) {

}

const ReactDOM = {
    render
}

export default ReactDOM;