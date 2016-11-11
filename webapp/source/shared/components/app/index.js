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
      <div>
        <LightButton color="yellow" lights={ this.props.lights } dispatch={ this.props.dispatch }/>
        <LightButton color="green" lights={ this.props.lights } dispatch={ this.props.dispatch }/>
        <LightButton color="red" lights={ this.props.lights } dispatch={ this.props.dispatch }/>
      </div> : <Upload session={this.props.session} things={this.props.things} thingName="lights"/>
    ) : <Form dispatch={this.props.dispatch} session={this.props.session} things={this.props.things}/>;
    return (
      <div>
        <Title title={this.state.title} link={link}/>
        <Panel head={this.state.head} body={panelBody}/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);


// const createApp = React => ({dispatch, lights, props}) => {
//   const Title = createTitle(React);
//   const LightButton = createButton(React);
//   console.log(props);
//   let children = null;
//   if (props.children) {
//     children = React.cloneElement(props.children, {
//       auth: props.route.auth //sends auth instance from route to children
//     })
//   }
//
//   if (!props.route.auth.loggedIn()) {
//     props.history.push('/login');
//   }
//   return (
//     <div>
//       <Title title='Lights'/>
//       <div className="panel">
//
//         <div className="panel-head">Manage special light</div>
//         <div className="panel-body">
//           <LightButton color="yellow" lights={ lights } dispatch={ dispatch }/>
//           <LightButton color="green" lights={ lights } dispatch={ dispatch }/>
//           <LightButton color="red" lights={ lights } dispatch={ dispatch }/>
//         </div>
//       </div>
//       {children}
//     </div>
//   );
// };
//
// const mapStateToProps = (state, props) => {
//   const {lights} = state;
//   return {lights, props};
// };
//
//
// // Connect props to component
// export default React => {
//   const App = createApp(React);
//   return connect(mapStateToProps)(App);
// };
