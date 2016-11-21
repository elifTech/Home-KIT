import {connect} from 'react-redux';
import createTitle from 'shared/components/title';
import {bindActionCreators} from 'redux'
import createButton from 'shared/components/light';
import React from 'react';
import Panel from 'shared/components/panel';
import Form from '../create-thing';
import Upload from '../keys';
import getLockState from './get-lock';

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
      title: props.things.lock.hasThing ? 'Lock' : 'Add thing',
      head: props.things.lock.hasThing ? 'Lock value' : 'New thing',
      hasThing: props.things.lock.hasThing,
      hasKeys: props.things.lock.hasKeys
    };
    if (!props.session.logged) {
      props.history.push('/');
    }
    this.getLock = this.getLock.bind(this);
  };

  componentWillMount() {
    this.setState({
      title: this.props.things.lock.hasThing ? 'Lock' : 'Add thing',
      head: this.props.things.lock.hasThing ? 'Lock value' : 'New thing',
      hasThing: this.props.things.lock.hasThing,
      hasKeys: this.props.things.lock.hasKeys
    })
  }

  componentWillReceiveProps(props) {
    if (props.session.logged && !props.session.hasCreds) {
      props.history.push('/credentials');
    }
    this.setState({
      title: props.things.lock.hasThing ? 'Lock' : 'Add thing',
      head: props.things.lock.hasThing ? 'Lock value' : 'New thing',
      hasThing: props.things.lock.hasThing,
      hasKeys: props.things.lock.hasKeys
    })
  }

  getLock(e) {
    e.preventDefault();
    getLockState(this.props.dispatch, this.props.session.token);
  }

  render() {
    const Title = createTitle(React);
    const link = this.state.link;
    const panelBody = this.state.hasThing ? (
      this.state.hasKeys ?
        <div className={this.props.things.lock.connected ? '' : 'disabled'}>
          <span>Current value: { this.props.things.lock.state ? 'unlocked' : 'locked' }</span>
          <button onClick={this.getLock}>Get value</button>
        </div> : <Upload
        session={this.props.session}
        things={this.props.things}
        thingName={this.props.things.lock.name}
        dispatch={this.props.dispatch}
        type="lock"
      />
    ) : <Form dispatch={this.props.dispatch} session={this.props.session} things={this.props.lock} type="lock"/>;
    return (
      <div>
        <Title title={this.state.title} link={link}/>
        <Panel head={this.state.head} body={panelBody} edit={this.props.things.lock.hasKeys} history={this.props.history} thingName={this.props.things.lock.name} type="lock"/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
