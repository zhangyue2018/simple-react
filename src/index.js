// import React from 'react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export function createConnection(serverUrl, roomId) {
    return {
        connect() {
            console.log('√ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
        },
        disconnect() {
            console.log('× Disconnected from "' + roomId + '" room at ' + serverUrl);
        }
    };
}

function ChatRoom({ roomId }) {
    const [ serverUrl, setServerUrl ] = useState('http://localhost:1234');
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [roomId, serverUrl]);

    return <>
        <label>
            Server URL: {' '}
            <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
        </label>
        <h1>Welcome to the {roomId} room!</h1>
    </>
}

export default function App() {
    const [ roomId, setRoomId ] = useState('general');
    const [ show, setShow ] = useState(false);
    return (
        <>
            <label>
                Choose the chat room: {' '}
                <select value={roomId} onChange={e => setRoomId(e.target.value)}>
                    <option value='general'>general</option>
                    <option value='travel'>travel</option>
                    <option value='music'>music</option>
                </select>
            </label>
            <button onClick={() => setShow(!show)}>
                {show ? "Close chat" : "Open chat"}
            </button>
            {show && <hr/>}
            {show && <ChatRoom roomId={roomId} />}
        </>
    );
}



ReactDOM.render(<App />, document.getElementById('root'));

