import React, {Component, PropTypes} from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import __ from 'lodash';

export default class Menu extends Component {
  static propTypes = {
    steps: PropTypes.array.isRequired,
    stage: PropTypes.number.isRequired,
    handleSelect: PropTypes.func.isRequired,
    tab: PropTypes.number.isRequired
  }

  render() {
    const tabs = __.map(this.props.steps, (item, key) => <NavItem href="#" key={key} eventKey={key} disabled={key > this.props.stage}>{item}</NavItem>);
    return (<div>
      <Nav bsStyle="pills" stacked activeKey={this.props.tab} onSelect={this.props.handleSelect}>
        {tabs}
      </Nav>
    </div>);
  }
}
