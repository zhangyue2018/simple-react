// import React from 'react';
import React from '../react';
import ReactDOM from '../react-dom';

class Greeting extends React.PureComponent {
    render() {
        console.log('Greeting render');
        return <div>
            <h3>Hello{this.props.name && ','}{this.props.name}</h3>
        </div>
    }
}

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', address: '' }
    }

    setName = (newName) => {
        this.setState({
            name: newName
        });
    }

    setAddress = (newAddress) => {
        this.setState({
            address: newAddress
        });
    }

    render() {
        console.log('MyApp');
        return <div>
            <label>
                Name:
                <input onInput={e => this.setName(e.target.value)} />
            </label>
            <label>
                Address:
                <input onInput={e => this.setAddress(e.target.value)} />
            </label>
            <Greeting name={this.state.name} />
        </div>
    }
}



ReactDOM.render(<MyApp />, document.getElementById('root'));

