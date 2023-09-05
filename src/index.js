// import React from 'react';
import React, { useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';

const MemoFunctionComponent = React.memo(function Child({ data, handleClick }) {
    console.log('Child Component rendering');
    return <button onClick={handleClick}>Age: {data.age}</button>
});

function App() {
    console.log('App Component rendering');
    const [name, setName] = useState('zy');
    const [age, setAge] = useState(30);
    let data = useMemo(() => ({age}), [age]);
    let handleClick = useCallback(() => setAge(age + 1), [age]);

    return <div>
        <input value={name} onInput={e => setName(e.target.value)} />
        <MemoFunctionComponent data={data} handleClick={handleClick} />
    </div>
}


ReactDOM.render(<App />, document.getElementById('root'));

