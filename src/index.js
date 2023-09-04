// import React from 'react';
import React, { useReducer } from './react';
import ReactDOM from './react-dom';

function reducer(state, action) {
    if(action.type === 'increment_age') {
        return {
            age: state.age + 1
        }
    }
    throw Error('Unknown action');
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, {age: 42});
    return <div>
        <button onClick={() => {
            dispatch({type: 'increment_age'});
        }}>Increment age</button>
        <p>Hello! You are {state.age}</p>
    </div>
}



ReactDOM.render(<Counter />, document.getElementById('root'));

