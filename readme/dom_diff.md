## dom是文本对象的对象化描述，它提供了接口可以对文本对象的结构、样式和内容进行修改。
## 虚拟dom也是一个对象，与真实dom相比，少了很多的属性；是对真实dom的精简描述。
## 在react中，原生类型的组件、类组件、函数组件都有对应的虚拟dom；但是只有原生标签的虚拟dom上会挂载真实dom；类组件的虚拟dom挂载的是类组件实例；函数组件的虚拟dom挂载的是其子虚拟dom。（因为浏览器只会为原生的标签创建真实的dom）
## 原生类型的组件、类组件、函数组件都有对应的虚拟dom,其对应的属性如下:
## 原生标签：vNode.dom = DOM;
## 类组件： vNode.classInstance = instance(new Component);同时vNode.classInstance.oldVNode = instance.render();---类组件实例上的oldVNode并不是类组件本身对应的虚拟dom，而是类组件的子节点对应的虚拟dom
## 函数组件：vNode.oldRenderVNode = renderVNode(函数的调用结果，即函数组件的子节点对应的虚拟dom)