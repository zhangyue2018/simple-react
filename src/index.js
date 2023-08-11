// import React from 'react';
import React from './react';
import ReactDOM from './react-dom';

// function MyFunctionComponent(props) {
//     return <div style={{color: 'red'}}>hello simple react<span>child1</span><span>child2</span></div>;
// }
// ReactDOM.render(<MyFunctionComponent x1={'child11'} x2={'child22'}/>, document.getElementById('root'));

class MyClassComponent extends React.Component {
    counter = 0;
    constructor(props) {
        super(props);
        this.state = {count: '0'};
    }

    updateShowText(newText) {
        this.setState({
            count: newText + ''
        });
    }
    render() {
        return <div style={{
            color: 'blue',
            cursor: 'pointer',
            border: '1px solid gray',
            borderRadius: '6px',
            display: 'inline-block',
            padding: '6px 12px'
        }} onClick={ () => this.updateShowText(++this.counter) }>hello simple react<span>{this.state.count}</span><span>{this.props.x2}</span></div>;
    }
}

ReactDOM.render(<MyClassComponent x1={'child11'} x2={'child22'}/>, document.getElementById('root'));

console.log(<MyClassComponent />);
