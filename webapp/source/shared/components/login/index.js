import React, { PropTypes as T } from 'react'
import {ButtonToolbar, Button} from 'react-bootstrap'
import createTitle from 'shared/components/title';
import Panel from 'shared/components/panel';
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  const {session} = state;
  return {session};
};

export class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    if (props.session.logged) {
      props.history.push('/home');
    }
  }

  render() {
    const Title = createTitle(React);
    const { auth } = this.props.route;
    const panelBody = <button onClick={auth.login.bind(this)} className="login-btn">Login</button>;
    if (this.props.session.logged) {
      this.props.history.push('/home');
    }
    return (
      <div className="auth-root">
        <Title title='Login'/>
        <Panel head="Welcome back!" body={panelBody}/>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Login);
