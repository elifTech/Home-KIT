import React from 'react'

export class Panel extends React.Component {

  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
  }

  edit(e) {
    e.preventDefault();
    this.props.history.push(`/edit/${this.props.thingName}`);
  }

  render() {
    return (
      <div className="panel">

        <div className="panel-head">{ this.props.head }{ this.props.edit ? <div className="right"><img onClick={this.edit} src={require('./edit.png')}/></div>: null}</div>
        <div className="panel-body">
          { this.props.body }
        </div>
      </div>
    )
  }
}

export default Panel;
