// import React from 'react';
import React from './react';
import ReactDOM from './react-dom';

// function MyFunctionComponent(props) {
//     return <div style={{color: 'red'}}>hello simple react<span>child1</span><span>child2</span></div>;
// }
// ReactDOM.render(<MyFunctionComponent x1={'child11'} x2={'child22'}/>, document.getElementById('root'));

class MyClassComponent extends React.Component {
    render() {
        return <div style={{color: 'blue'}}>hello simple react<span>{this.props.x1}</span><span>{this.props.x2}</span></div>;
    }
}

ReactDOM.render(<MyClassComponent x1={'child11'} x2={'child22'}/>, document.getElementById('root'));

console.log(<MyClassComponent />);
