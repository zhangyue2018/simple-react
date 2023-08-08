// import React from 'react';
import React from './react';
import ReactDOM from './react-dom';

function MyFunctionComponent(props) {
    return <div style={{color: 'red'}}>hello simple react<span>child1</span><span>child2</span></div>;
}

ReactDOM.render(<MyFunctionComponent />, document.getElementById('root'));

console.log(<MyFunctionComponent />);
