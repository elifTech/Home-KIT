import {connect} from 'react-redux';
import createTitle from 'shared/components/title';
import {bindActionCreators} from 'redux'
import createButton from 'shared/components/light';
import React from 'react';
import Panel from 'shared/components/panel';
import Form from '../create-thing';
import Upload from '../keys';

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
      title: props.things.shine.hasThing ? 'Shine' : 'Add thing',
      head: props.things.shine.hasThing ? 'Shine value' : 'New thing',
      hasThing: props.things.shine.hasThing,
      hasKeys: props.things.shine.hasKeys
    };
    if (!props.session.logged) {
      props.history.push('/');
    }
  };

  componentWillMount() {
    this.setState({
      title: this.props.things.shine.hasThing ? 'Shine' : 'Add thing',
      head: this.props.things.shine.hasThing ? 'Shine value' : 'New thing',
      hasThing: this.props.things.shine.hasThing,
      hasKeys: this.props.things.shine.hasKeys
    })
  }

  componentWillReceiveProps(props) {
    if (props.session.logged && !props.session.hasCreds) {
      props.history.push('/credentials');
    }
    this.setState({
      title: props.things.shine.hasThing ? 'Shine' : 'Add thing',
      head: props.things.shine.hasThing ? 'Shine value' : 'New thing',
      hasThing: props.things.shine.hasThing,
      hasKeys: props.things.shine.hasKeys
    })
  }

  render() {
    const Title = createTitle(React);
    const link = this.state.link;
    const panelBody = this.state.hasThing ? (
      this.state.hasKeys ?
        <div className={this.props.things.shine.connected ? '' : 'disabled'}>
          <span>Current value: { this.props.things.shine.state }</span>
        </div> : <Upload
        session={this.props.session}
        things={this.props.things}
        thingName={this.props.things.shine.name}
        dispatch={this.props.dispatch}
        type="shine"
      />
    ) : <Form dispatch={this.props.dispatch} session={this.props.session} things={this.props.shine} type="shine"/>;
    return (
      <div>
        <Title title={this.state.title} link={link}/>
        <Panel head={this.state.head} body={panelBody} edit={this.props.things.shine.hasKeys} history={this.props.history} thingName={this.props.things.shine.name} type="shine"/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
