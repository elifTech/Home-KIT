import {connect} from 'react-redux';
import createTitle from 'shared/components/title';
import {bindActionCreators} from 'redux'
import createButton from 'shared/components/light';
import React from 'react';
import Panel from 'shared/components/panel';
import Form from '../create-thing';
import Upload from '../keys';
import getGas from './get-gas';

const mapStateToProps = (state) => {
  const {session, things} = state;
  return {session, things};
};

class App extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    if (props.session.logged && !props.session.hasCreds) {
      props.history.push('/credentials');
    }
    this.state = {
      link: {
        title: 'Logout',
        event: e => {
          e.preventDefault();
          this.props.route.auth.logout();
          this.props.history.push('/');
        }
      },
      title: props.things.gas.hasThing ? 'Gas' : 'Add thing',
      head: props.things.gas.hasThing ? 'Gas value' : 'New thing',
      hasThing: props.things.gas.hasThing,
      hasKeys: props.things.gas.hasKeys
    };
    if (!props.session.logged) {
      props.history.push('/');
    }
    this.getGas = this.getGas.bind(this);
  };

  componentWillMount() {
    this.setState({
      title: this.props.things.gas.hasThing ? 'Gas' : 'Add thing',
      head: this.props.things.gas.hasThing ? 'Gas value' : 'New thing',
      hasThing: this.props.things.gas.hasThing,
      hasKeys: this.props.things.gas.hasKeys
    })
  }

  componentWillReceiveProps(props) {
    if (props.session.logged && !props.session.hasCreds) {
      props.history.push('/credentials');
    }
    this.setState({
      title: props.things.gas.hasThing ? 'Gas' : 'Add thing',
      head: props.things.gas.hasThing ? 'Gas value' : 'New thing',
      hasThing: props.things.gas.hasThing,
      hasKeys: props.things.gas.hasKeys
    })
  }

  getGas(e) {
    e.preventDefault();
    getGas(this.props.dispatch, this.props.session.token);
  }

  render() {
    const Title = createTitle(React);
    const link = this.state.link;
    const panelBody = this.state.hasThing ? (
      this.state.hasKeys ?
        <div className={this.props.things.gas.connected ? '' : 'disabled'}>
          <span>Current value: { this.props.things.gas.state }</span>
          <button onClick={this.getGas}>Get value</button>
        </div> : <Upload
        session={this.props.session}
        things={this.props.things}
        thingName={this.props.things.gas.name}
        dispatch={this.props.dispatch}
        type="gas"
      />
    ) : <Form dispatch={this.props.dispatch} session={this.props.session} things={this.props.gas} type="gas"/>;
    return (
      <div>
        <Title title={this.state.title} link={link}/>
        <Panel head={this.state.head} body={panelBody} edit={this.props.things.gas.hasKeys} history={this.props.history} thingName={this.props.things.gas.name} type="gas"/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
