import React from 'react';
import { connect } from 'react-redux';
import createThing from './new-thing';

class ThingForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      thingName: ''
    }
  }

  handleChange(event) {
    this.setState({thingName: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    // Do anything you want with the form value
    createThing(this.state.thingName, this.props.session.token, this.props.dispatch);
    console.log(this.state.thingName);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.thingName} onChange={this.handleChange} placeholder="Thing name"/>
        <button>Submit!</button>
      </form>
    );
  }
}

// No need to connect()!
export default ThingForm;
