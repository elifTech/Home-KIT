import React from 'react';
import { connect } from 'react-redux';
import createThing from './new-thing';

class ThingForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      thingName: props.thingName,
      invalid: false
    }
  }

  handleChange(event) {

    this.setState({
      thingName: event.target.value,
      invalid: false
    });
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
      <form className="new-thing" onSubmit={this.handleSubmit}>
        <input type="text" className={this.state.invalid ? 'invalid' : ''} value={this.state.thingName} onChange={this.handleChange} placeholder="Thing name"/>
        <button>Add</button>
      </form>
    );
  }
}

// No need to connect()!
export default ThingForm;
