// import React from 'react';
import React from './react';
import ReactDOM from './react-dom';

class DerivedState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preveUserId: 'zhangsanfeng',
            email: 'zhangsanfeng@xxx.com'
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.userId !== state.preveUserId) {
            return {
                preveUserId: props.userId,
                email: props.userId + '@xxx.com'
            }
        }
        return null;
    }

    render() {
        return <div>
            <h1>Email:</h1>
            <h2>{ this.state.email }</h2>
        </div>
    }
}

class ParentClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id: 'zhangsanfeng'}
    }

    changeUserId = () => {
        this.setState({
            id: 'dongfangbubai'
        });
    }

    render() {
        console.log('render');
        return <div>
            <input type="button" value="点击改变UserId" onClick={() => this.changeUserId()} />
            <DerivedState userId={this.state.id} />
        </div>
    }

}



ReactDOM.render(<ParentClass />, document.getElementById('root'));

