import {connect} from 'react-redux';
import createTitle from 'shared/components/title';
import {bindActionCreators} from 'redux'
import createButton from 'shared/components/light';
import React from 'react';
import Panel from 'shared/components/panel';

const mapStateToProps = (state) => {
  const {lights} = state;
  return {lights};
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
      }
    }
  };

  componentDidMount() {
  }

  render() {

    const LightButton = createButton(React);
    const Title = createTitle(React);
    const link = this.state.link;
    const panelBody = (
      <div>
        <LightButton color="yellow" lights={ this.props.lights } dispatch={ this.props.dispatch }/>
        <LightButton color="green" lights={ this.props.lights } dispatch={ this.props.dispatch }/>
        <LightButton color="red" lights={ this.props.lights } dispatch={ this.props.dispatch }/>
      </div>
    );
    return (
      <div>
        <Title title='Lights' link={link}/>
        <Panel head="Manage special light" body={panelBody}/>
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
