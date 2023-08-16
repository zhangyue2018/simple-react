import { findDomByVNode, updateDomTree } from './react-dom';

export let updaterQueue = {
    isBatch: false,
    updaters: new Set()
}

export function flushUpdaterQueue() {
    updaterQueue.isBatch = false;
    for(let updater of updaterQueue.updaters) {
        updater.launchUpdate();
    }
    updaterQueue.updaters.clear();
}

class Updater {
    constructor(ClassComponentInstance) {
        this.ClassComponentInstance = ClassComponentInstance;
        this.pendingStates = [];
    }
    addState(partialState) {
        this.pendingStates.push(partialState);
        this.preHandleForUpdate();
    }

    preHandleForUpdate() {
        if(updaterQueue.isBatch) {
            updaterQueue.updaters.add(this);
        } else {
            this.launchUpdate();
        }
    }
    // 执行更新
    launchUpdate() {
        // 判断有无待更新的state,可以保证在调用flushUpdaterQueue时，不会重复执行
        if(this.pendingStates.length === 0) return;
        // 1.更新ClassComponent实例的state
        this.ClassComponentInstance.state = this.pendingStates.reduce((preState, newState) => {
            return { ...preState, ...newState };
        }, this.ClassComponentInstance.state);
        // 清空updater关联的数据
        this.pendingStates.length = 0;
        // 2.调用ClassComponent实例本身的update函数，进行更新操作
        this.ClassComponentInstance.update();
    }
}
export class Component {
    static IS_CLASS_COMPONENT = true;
    constructor(props) {
        this.updater = new Updater(this);
        this.state = {};
        this.props = props;
    }

    setState(partialState) {
        // 1.合并属性
        // 2.重新渲染进行更新
        this.updater.addState(partialState);
    }
    update() {
        // 1.获取重新执行render函数后的虚拟DOM  新虚拟DOM
        // 2.根据新的虚拟DOM生成新的真实DOM
        // 3.将真实DOM挂载到页面
        let oldVNode = this.oldVNode;
        let oldDOM  = findDomByVNode(oldVNode);
        let newVNode = this.render();
        updateDomTree(oldVNode, newVNode, oldDOM);
        this.oldVNode = newVNode; 
    }
}