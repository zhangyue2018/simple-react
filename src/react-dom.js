import { REACT_ELEMENT } from "./utils";
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
    const {type, props} = VNode;
    let dom;
    if(typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT) {
        return getDomByClassComponent(VNode);
    }
    if(typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
        return getDomByFunctionComponent(VNode);
    }
    if(type && VNode.$$typeof === REACT_ELEMENT) {
        dom = document.createElement(type);
    }
    if(props) {
        if(typeof props.children === 'object' && props.children.type) {
            mount(props.children, dom);
        } else if(Array.isArray(props.children)) {
            mountArray(props.children, dom);
        } else if(typeof props.children === 'string'){
            dom.appendChild(document.createTextNode(props.children));
        }

    }

    // 给DOM设置属性值
    setPropsForDOM(dom, props);
    // 将真实DOM挂到虚拟DOM上面
    VNode.dom = dom;

    return dom;
}

function getDomByClassComponent(VNode) {
    let { type, props } = VNode;
    let instance = new type(props);
    let renderVNode = instance.render();
    instance.oldVNode = renderVNode;
    if(!renderVNode) return null;
    return createDOM(renderVNode);
}

function getDomByFunctionComponent(VNode) {
    let { type, props } = VNode;
    let renderVNode = type(props);
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
        if(typeof children[i] === 'string') {
            parent.appendChild(document.createTextNode(children[i]));
        } else {
            mount(children[i], parent);
        }
    }
}
// 找到虚拟DOM对应的真实DOM
export function findDomByVNode(VNode) {
    if(!VNode) return;
    if(VNode.dom) return VNode.dom;
}

export function updateDomTree(oldDOM, newVNode) {
    let parentNode = oldDOM.parentNode;
    parentNode.removeChild(oldDOM);
    parentNode.appendChild(createDOM(newVNode));
}

const ReactDOM = {
    render
}

export default ReactDOM;