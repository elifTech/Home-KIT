import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import createThing from './new-thing';

class ThingForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      thingName: props.thingName,
      invalid: false,
      first: false
    };
    if (!props.session.things || props.session.things.length == 0) {
      this.state.first = true;
    }
  }

  componentWillReceiveProps(props) {
    if (!props.session.things || props.session.things.length == 0) {
      this.setState({
        first: true
      })
    } else {
      this.setState({
        first: false
      })
    }
  }

  handleChange(event) {

    this.setState({
      thingName: event.target.value,
      invalid: false,
    });
    if (!event.target.value) {
      return this.setState({
        invalid: true
      })
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    // Do anything you want with the form value
    if (!this.state.thingName) {
      return this.setState({
        invalid: true
      })
    }
    createThing(this.state.thingName, this.props.type, this.props.session.token, this.props.dispatch);
    console.log(this.state.thingName);
  }

  render() {
    return (
      <div>
        <form className="new-thing" onSubmit={this.handleSubmit}>
          <select className={this.state.invalid ? 'invalid' : ''} value={this.state.thingName}
                  onChange={this.handleChange}>
            <option className="select-placeholder" value=''>Select...</option>
            { this.props.session.things.map(item => <option value={item.thingName}>{item.thingName}</option>) }
          </select>
          <button className={this.state.invalid ? 'invalid' : ''}>Add</button>
        </form>
        {this.state.first ? <span className="info">It seems you have no things. You can create new thing going
          <a href="https://eu-central-1.console.aws.amazon.com/iot/home?region=eu-central-1#/dashboard" target="blank">here</a>.<br/> For more details go
          <a href="http://docs.aws.amazon.com/iot/latest/developerguide/iot-gs.html" target="blank">here</a>.<br/>
          Remember that you must use eu-central-1 region (Frankfurt).
        </span> : ''}
      </div>
    );
  }
}

// No need to connect()!
export default ThingForm;
