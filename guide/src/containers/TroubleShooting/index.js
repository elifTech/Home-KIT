import React, {Component} from 'react';
import Menu from '../../components/Menu';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router';
const styles = require('./styles.scss');

function Trouble1() {
  return (<div>
      <h1>Connect Arduino to the board like in the picture below.</h1>
      <img src="./img/1.png" />
    </div>);
}


export default class Troubleshooting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      stage: 0
    };
  }

  handleSelect(val) {
    this.setState({tab: val});
  }

  next(length) {
    if (this.state.tab !== length - 1) this.setState({tab: this.state.tab + 1});
  }


  render() {
    const steps = ['Trouble 1', 'Trouble 1'];
    const tabs = [(<Trouble1/>)];
    const resources = [[{
      link: 'https://www.arduino.cc/en/main/software',
      label: 'Arduino IDE'
    }],
    [{
      link: '/',
      label: 'hi'
    }],
    [{
      link: '/',
      label: 'hi'
    }],
    [{
      link: 'https://aws.amazon.com/',
      label: 'Amazon AWS'
    },
      {
        link: 'https://aws.amazon.com/ru/documentation/iot/',
        label: 'Amazon AWS IoT Documentation'
      }],
    [{
      link: 'https://aws.amazon.com/',
      label: 'Amazon AWS'
    },
      {
        link: 'https://aws.amazon.com/ru/documentation/iot/',
        label: 'Amazon AWS IoT Documentation'
      }],
    [{
      link: '/',
      label: 'hi'
    }],
    [{
      link: '/',
      label: 'hi'
    }],
    [{
      link: '/',
      label: 'hi'
    }]];
    return (<div>
      <div className={styles.navbar}>
        <Link to={'/'}><Button>Back</Button></Link>
      </div>
      <div className={styles.body}>
          <div className={`col-sm-2`}>
            <Menu steps={steps} stage={steps.length - 1} tab={this.state.tab} handleSelect={this.handleSelect.bind(this)} />
          </div>
          <div className={`col-sm-8`}>
            <div>{tabs[this.state.tab]}</div><Button href="#" className={`${(this.state.tab !== tabs.length - 1) ? 'btn-primary' : 'btn-success' } ${styles.button}`} onClick={this.next.bind(this, tabs.length)}>{(this.state.tab !== tabs.length - 1) ? 'Next' : 'Finish'}</Button>
          </div>
          <div className={`col-sm-2 ${styles.res}`}>
            <div className={styles.resources}>
              Resources:
              {resources[this.state.tab] && resources[this.state.tab].map(val => <div><a href={val.link} target="_blank" rel="noreferrer">{val.label}</a></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
