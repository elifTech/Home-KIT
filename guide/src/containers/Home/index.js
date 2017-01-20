import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Nav, NavItem} from 'react-bootstrap';
import {push} from 'react-router-redux';
const styles = require('./styles.scss');
const Highlight = require('react-highlight');

function Main() {
  return (<div className={`${styles.intro}`}>
    <img src="./img/logo.png"></img>
    <h1>Let's run our system</h1>
   <h2>Open Terminal and write down this commands</h2>
    <Highlight>wget {`https://s3.eu-central-1.amazonaws.com/gameiro21k/setup.sh`}<br/>
      chmod +x setup.sh<br/>
    ./setup.sh</Highlight></div>);
}

function Troubleshooting() {
  return (<div>
    <ul>
      <li><a href="https://www.arduino.cc/en/guide/troubleshooting" target="_blank" rel="noreferrer">Arduino troubleshooting</a></li>
      <li><a href="https://www.raspberrypi.org/forums/viewforum.php?f=28" target="_blank" rel="noreferrer">Raspberrytroubleshooting</a></li>
      <li><a href="https://randomnerdtutorials.com/esp8266-troubleshooting-guide/" target="_blank" rel="noreferrer">NodeMCU troubleshooting</a></li>
    </ul>
  </div>);
}

@connect(state => state, {pushState: push})
export default class App extends Component {

  static propTypes = {
    pushState: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  handleSelect(link, key) {
    if (key !== 1) return this.setState({tab: key});
    return this.props.pushState(link);
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
        link: '#',
        label: 'Troubleshooting'
      }];
    const tabs = [<Main/>, '', <Troubleshooting />];
    const menu = menuItem.map((val, key) => <NavItem key={key} onClick={this.handleSelect.bind(this, val.link, key)} eventKey={key}>{val.label}</NavItem>);
    return (<div className={styles.body}>
      <div className={`col-sm-3`}>
        <Nav bsStyle="pills" stacked activeKey={this.state.tab}>
          {menu}
        </Nav>
      </div>
      <div className={`col-sm-9`}>
        {tabs[this.state.tab]}
      </div>
    </div>);
  }
}
