import {connect} from 'react-redux';
import createTitle from 'shared/components/title';
import {bindActionCreators} from 'redux'
import createButton from 'shared/components/light';
import React from 'react';
import Panel from 'shared/components/panel';
import Form from '../create-thing';
import Upload from '../keys';

const mapStateToProps = (state) => {
  const {lights, session, things} = state;
  return {lights, session, things};
};

class App extends React.Component {
  constructor(props) {
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
      title: props.things.lights.hasThing ? 'Lights' : 'Add thing',
      head: props.things.lights.hasThing ? 'Manage special light' : 'New thing',
      hasThing: props.things.lights.hasThing,
      hasKeys: props.things.lights.hasKeys
    };
    if (!props.session.logged) {
      props.history.push('/');
    }
  };

  componentWillMount() {
    this.setState({
      title: this.props.things.lights.hasThing ? 'Lights' : 'Add thing',
      head: this.props.things.lights.hasThing ? 'Manage special light' : 'New thing',
      hasThing: this.props.things.lights.hasThing,
      hasKeys: this.props.things.lights.hasKeys
    })
  }

  componentWillReceiveProps(props) {
    if (props.session.logged && !props.session.hasCreds) {
      props.history.push('/credentials');
    }
    this.setState({
      title: props.things.lights.hasThing ? 'Lights' : 'Add thing',
      head: props.things.lights.hasThing ? 'Manage special light' : 'New thing',
      hasThing: props.things.lights.hasThing,
      hasKeys: props.things.lights.hasKeys
    })
  }

  render() {
    const LightButton = createButton(React);
    const Title = createTitle(React);
    const link = this.state.link;
    const panelBody = this.state.hasThing ? (
      this.state.hasKeys ?
      <div className={this.props.things.lights.connected ? '' : 'disabled'}>
        <LightButton color="yellow" lights={ this.props.lights } dispatch={ this.props.dispatch } session={this.props.session}/>
        <LightButton color="green" lights={ this.props.lights } dispatch={ this.props.dispatch } session={this.props.session}/>
        <LightButton color="red" lights={ this.props.lights } dispatch={ this.props.dispatch } session={this.props.session}/>
      </div> : <Upload
        session={this.props.session}
        things={this.props.things}
        thingName={this.props.things.lights.name}
        dispatch={this.props.dispatch}
        type="lights"
      />
    ) : <Form dispatch={this.props.dispatch} session={this.props.session} things={this.props.things} type="lights"/>;
    return (
      <div>
        <Title title={this.state.title} link={link}/>
        <Panel head={this.state.head} body={panelBody} edit={this.props.things.lights.hasKeys} history={this.props.history} thingName={this.props.things.lights.name} type="lights"/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
