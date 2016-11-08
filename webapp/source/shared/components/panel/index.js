import React from 'react'

export class Panel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="panel">

        <div className="panel-head">{ this.props.head }</div>
        <div className="panel-body">
          { this.props.body }
        </div>
      </div>
    )
  }
}

export default Panel;
