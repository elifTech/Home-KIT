import {connect} from 'react-redux';
import React from 'react';

const createApp = React => ({dispatch, lights, props}) => {
  console.log(props);
  props.history.push('/login');
  return (<div><img src={"https://thomas.vanhoutte.be/miniblog/wp-content/uploads/light_blue_material_design_loading.gif"}/></div>)
};

const mapStateToProps = (state, props) => {
  const {lights} = state;
  return {lights, props};
};


// Connect props to component
export default React => {
  const App = createApp(React);
  return connect(mapStateToProps)(App);
};
