import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {push} from 'react-router-redux';
import config from '../../config';
import {asyncConnect} from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => { // eslint-disable-line
    const promises = [];
    return Promise.all(promises);
  }
}])
@connect(
  state => ({state: state}),
  {pushState: push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }


  render() {
    const styles = require('./styles.scss');
    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
          <div className={styles.appContent}>
            <div>{this.props.children}</div>
          </div>
        </div>
    );
  }
}
