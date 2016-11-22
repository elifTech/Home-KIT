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
      title: 'Things',
      head: 'Panels'
    };
    if (!props.session.logged) {
      props.history.push('/');
    }
    this.panelGo = this.panelGo.bind(this);
  }

  componentWillMount() {
    this.setState({
    })
  }

  componentWillReceiveProps(props) {
    this.setState({
    })
  }

  panelGo(thing, e) {
    e.preventDefault();
    this.props.history.push(`/${thing}`);
  }

  render() {
    const Title = createTitle(React);
    const link = this.state.link;
    const panelBody = (
        <div className="main">
          <button onClick={this.panelGo.bind(null, 'lights')}>Lights</button>
          <button onClick={this.panelGo.bind(null, 'gas')}>Gas</button>
          <button onClick={this.panelGo.bind(null, 'shine')}>Shine</button>
          <button onClick={this.panelGo.bind(null, 'lock')}>Lock</button>
        </div>
    );
    return (
      <div>
        <Title title={this.state.title} link={link}/>
        <Panel head={this.state.head} body={panelBody} history={this.props.history} thingName={this.props.things.lights.name}/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
