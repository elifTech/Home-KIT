import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Nav, NavItem} from 'react-bootstrap';
import {push} from 'react-router-redux';
const styles = require('./styles.scss');

@connect(state => state, {pushState: push})
export default class App extends Component {

  static propTypes = {
    pushState: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      stage: 0
    };
  }

  render() {
    const menuItem = [{
      link: '#',
      label: 'Introduction'
    },
      {
        link: '/guide',
        label: 'Guide'
      },
      {
        link: '/troubleshooting',
        label: 'Troubleshooting'
      }];
    const menu = menuItem.map((val, key) => <NavItem key={key} onClick={this.props.pushState.bind(this, val.link)} eventKey={key}>{val.label}</NavItem>);
    return (<div className={styles.body}>
      <div className={`col-sm-3`}>
        <Nav bsStyle="pills" stacked activeKey={0}>
          {menu}
        </Nav>
      </div>
      <div className={`col-sm-9`}>
        content
      </div>
    </div>);
  }
}
