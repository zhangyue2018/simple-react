// import React from 'react';
import React from './react';
import ReactDOM from './react-dom';

// function MyFunctionComponent(props) {
//     return <div style={{color: 'red'}}>hello simple react<span>child1</span><span>child2</span></div>;
// }
// ReactDOM.render(<MyFunctionComponent x1={'child11'} x2={'child22'}/>, document.getElementById('root'));

// class MyClassComponent extends React.Component {
//     counter = 0;
//     constructor(props) {
//         super(props);
//         this.state = {count: '0'};
//     }

//     updateShowText(newText) {
//         this.setState({
//             count: newText + ''
//         });
//     }
//     render() {
//         return <div style={{
//             color: 'blue',
//             cursor: 'pointer',
//             border: '1px solid gray',
//             borderRadius: '6px',
//             display: 'inline-block',
//             padding: '6px 12px'
//         }} onClick={ () => this.updateShowText(++this.counter) }>hello simple react<span>{this.state.count}</span></div>;
//     }
// }

// class CustomTextInput extends React.Component {
//     constructor(props) {
//         super(props);
//         // create a ref to store the textInput DOM element
//         this.textInput = React.createRef(); // { current: null }
//         // create a ref to store the React Component instance
//         this.counterComponentRef = React.createRef();
//         this.focusTextInput = this.focusTextInput.bind(this);
//     }

//     focusTextInput() {
//         this.textInput.current.focus();
//     }

//     show100() {
//         this.counterComponentRef.current.updateShowText(100);
//     }

//     render() {
//         return <div>
//             <div onClick={() => this.show100()}>show100</div>
//             <MyClassComponent ref={this.counterComponentRef} />
//         </div>
//         // return <div>
//         //     <input type="text" ref={this.textInput} />
//         //     <input type="button" value="Focus the text input" onClick={this.focusTextInput}/>
//         // </div>
//     }
// }

// ReactDOM.render(<CustomTextInput />, document.getElementById('root'));

// console.log(<MyClassComponent />);

let ForwardRefFunctionComponent = React.forwardRef((props, ref) => {
    return <input ref={ref} value='FowardRefFunctionComponent' />
});

function FunctionComponent(props) {
    let forwardRef = React.createRef();
    const changeInput = () => {
        forwardRef.current.value = 'ForwardRef..........';
    }

    return <div>
        <ForwardRefFunctionComponent ref={forwardRef} />
        <input type="button" onClick={changeInput} value='点击添加省略号'></input>
    </div>
}

ReactDOM.render(<FunctionComponent />, document.getElementById('root'));

