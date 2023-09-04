// import React from 'react';
import React, { useRef, useImperativeHandle } from './react';
import ReactDOM from './react-dom';

const MyInput = React.forwardRef(function(props, ref) {
    const inputRef = useRef(null);
    
    useImperativeHandle(ref, () => {
        return {
            focus() {
                inputRef.current.focus();
            }
        }
    });

    return <input {...props} ref={inputRef} />
});

function Form() {
    const inputRef = useRef(null);
    function handleClick() {
        inputRef.current.focus();
        // inputRef.current.style.opcity = 0;
    }
    return <div>
        <MyInput label="Enter your name:" ref={inputRef} />
        <button onClick={handleClick}>Focus the input</button>
    </div>
}


ReactDOM.render(<Form />, document.getElementById('root'));

