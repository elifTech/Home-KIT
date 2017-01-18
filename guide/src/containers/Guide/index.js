import React, {Component} from 'react';
import Menu from '../../components/Menu';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router';
const styles = require('./styles.scss');

function Board() {
  return (<div>
      <h1>Connect Arduino to the board like in the picture below.</h1>
      <img src="./img/1.png" />
    </div>);
}

function Ethernet() {
  return (<div>
      <h1>Connect Ethernet module to the board and Arduino like in the picture below.</h1>
      <img src="./img/2.png" />
    </div>);
}

function Raspberry() {
  return (<div>
      <h1>Connect Arudino to Raspberry using Ethernet cable like in the picture below.</h1>
      <img src="./img/3.png" />
    </div>);
}

function LightSensor() {
  return (<div>
      <li>Connect Light sensor to Arduino using like in the picture below.</li>
      <img src="./img/light/1.png" />
      <li>Let's create your first thing on AWS IoT. You should register on <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a>. Go to AWS IoT page and create your first thing.</li>
      <img src="./img/cr.png" />
      <li>{`It will be good If you have things group by actions. Create type for things.`}</li>
      <img src="./img/light/3.png" />
      <li>{`Light sensor does only one action - report light statistic. That's why we create "Report" type.`}</li>
      <img src="./img/4.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/light/2.png" />
      <li>{'Now you should add security for the connection between devices. Go to tab "Security" and click "Create certificates"'}</li>
      <img src="./img/6.png" />
      <li>{'Download certificates and activate it. You will use it in next steps'}</li>
      <img src="./img/7.png" />
    </div>);
}

function TempSensor() {
  return (<div>
      <li>Connect Temperature sensor to Arduino like in the picture below.</li>
      <img src="./img/temperature/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/temperature/2.png" />
      <li>{'Now you should add security for the connection between devices. Go to tab "Security" and click "Create certificates"'}</li>
      <img src="./img/6.png" />
      <li>{'Download certificates and activate it. You will use it in next steps'}</li>
      <img src="./img/7.png" />
    </div>);
}

function KeySensor() {
  return (<div>
      <li>Connect Keypad to Arduino like in the picture below.</li>
      <img src="./img/key/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/key/2.png" />
      <li>{'Now you should add security for the connection between devices. Go to tab "Security" and click "Create certificates"'}</li>
      <img src="./img/6.png" />
      <li>{'Download certificates and activate it. You will use it in next steps'}</li>
      <img src="./img/7.png" />
    </div>);
}

function PirSensor() {
  return (<div>
      <li>Connect Pir Sensor to Arduino like in the picture below.</li>
      <img src="./img/pir/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/pir/2.png" />
      <li>{'Now you should add security for the connection between devices. Go to tab "Security" and click "Create certificates"'}</li>
      <img src="./img/6.png" />
      <li>{'Download certificates and activate it. You will use it in next steps'}</li>
      <img src="./img/7.png" />
    </div>);
}

function GasSensor() {
  return (<div>
      <li>Connect Gas Sensor to Arduino like in the picture below.</li>
      <img src="./img/gas/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/gas/2.png" />
      <li>{'Now you should add security for the connection between devices. Go to tab "Security" and click "Create certificates"'}</li>
      <img src="./img/6.png" />
      <li>{'Download certificates and activate it. You will use it in next steps'}</li>
      <img src="./img/7.png" />
    </div>);
}

function RfReader() {
  return (<div>
      <li>Connect RF Reader to NodeMCU like in the picture below.</li>
      <img src="./img/rf/1.png" />
      <li>Let's create thing on AWS IoT. Go to <a target="_blank" rel="noreferrer" href="https://aws.amazon.com">AWS</a> IoT page and create thing.</li>
      <img src="./img/cr.png" />
      <li>{`Ok. Let's fill all field for thing and click "Create thing"`}</li>
      <img src="./img/rf/2.png" />
      <li>{'Now you should add security for the connection between devices. Go to tab "Security" and click "Create certificates"'}</li>
      <img src="./img/6.png" />
      <li>{'Download certificates and activate it. You will use it in next steps'}</li>
      <img src="./img/7.png" />
    </div>);
}

function ConfArduino() {
  return (<div>
      <li>Install <a target="_blank" rel="noreferrer" href="https://www.arduino.cc/en/main/software">Arduino IDE</a></li>
      <li>Run Arduino IDE</li>
      <div className={styles.code}>
        <code>cd your_install_derectory<br/>cd arduino<br/>sudo ./arduino</code>
      </div>
      <li>{`Go to the tab "Tools" and choose right serial port like in the picture below.`}</li>
      <img src="./img/arduino/1.png" />
      <li>{`Go to the tab "Tools" and choose "Arduino Mega" from Boards list like in the picture below.`}</li>
      <img src="./img/arduino/2.png" />
      <li>{`Go to the tab "File" and choose an example from "Example" list like in the picture below.`}</li>
      <img src="./img/arduino/4.png" />
      <li>{`Verify your code, click the button "Verify" and then run it on Arduino by clicking on the button "Run"`}</li>
      <img src="./img/arduino/3.png" />
    </div>
  );
}

function ConfNodeMCU() {
  return (<div>
      <li>Run Arduino IDE</li>
      <div className={styles.code}>
        <code>cd your_install_derectory<br/>cd arduino<br/>sudo ./arduino</code>
      </div>
      <li>{`Go to the tab "Tools" and choose right serial port like in the picture below.`}</li>
      <img src="./img/arduino/1.png" />
      <li>{`Go to the tab "Arduino" and choose "Preferences". Add URL for package manager like in the picture below.`}</li>
      <img src="./img/node/1.png" />
      <div className={styles.code}>
        <code>{`http://arduino.esp8266.com/stable/package_esp8266com_index.json`}</code>
      </div>
      <img src="./img/node/2.png" />
      <li>{`Go to the tab "Tools" and choose "Board manager" from Boards list like in the picture below. Type "esp8266" in the search field and install it.`}</li>
      <img src="./img/node/3.png" />
      <li>{`Go to the tab "Tools" and choose "Node MCU 0.9" from Boards list like in the picture below.`}</li>
      <img src="./img/node/4.png" />
    </div>
  );
}


export default class App extends Component {

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
    if (this.state.stage !== length - 1) this.setState({stage: this.state.stage + 1});
    if (this.state.tab !== length - 1) this.setState({tab: this.state.tab + 1});
  }


  render() {
    const steps = ['Configure Arduino', 'Connect Arduino to Board', 'Connect Ethernet Module', 'Connect Raspberry', 'Connect Light Sensor', 'Connect PIR Sensor', 'Connect Temperature sensor', 'Connect Keypad', 'Connect Gas Sensor', 'Connect RF Reader', 'Configure NodeMCU'];
    const tabs = [(<ConfArduino />), (<Board/>), (<Ethernet/>), (<Raspberry/>), (<LightSensor />), (<PirSensor/>), (<TempSensor />), (<KeySensor />), <GasSensor />, (<RfReader />), <ConfNodeMCU />];
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
            <Menu steps={steps} stage={this.state.stage} tab={this.state.tab} handleSelect={this.handleSelect.bind(this)} />
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
