## ref本意是引用，它在谁身上就是引用谁
## 对于类组件，ref引用的是类组件的实例；对于原生组件，ref引用的是DOM节点
## ref并不能作用在Functional组件上，因为Functional组件没有实例，而直接穿透Functional直接引用其内部渲染的元素不符合ref的语义
## forwardRef，其语义是转发ref，作用是把设置在functional组件上的ref转发到其内部渲染的元素上
## forwardRef使用方法：
## let ForwardRefFunctionComponent = React.forwardRef((props, ref) => {
    return <div ref={ref}></div>
});
## let forwardRef = React.createRef();
## ReactDOM.render(<ForwardRefFunctionComponent ref={forwardRef} />, root);