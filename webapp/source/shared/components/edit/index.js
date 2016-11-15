import {connect} from 'react-redux';
import createTitle from 'shared/components/title';
import createButton from 'shared/components/light';
import React from 'react';
import Panel from 'shared/components/panel';
import Form from '../create-thing';
import Upload from '../keys';

const mapStateToProps = (state) => {
  const {lights, session, things} = state;
  return {lights, session, things};
};

class Edit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      link: {
        title: 'Logout',
        event: e => {
          e.preventDefault();
          this.props.route.auth.logout();
          this.props.history.push('/');
        }
      },
      name: props.things[props.params.name].name,
      cert: props.things[props.params.name].cert,
      key: props.things[props.params.name].key,
      head: `Edit ${props.params.name}`
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      name: props.things[props.params.name].name,
      cert: props.things[props.params.name].cert,
      key: props.things[props.params.name].key
    });
  }

  render() {
    const Title = createTitle(React);
    const panelBody =
      <div className="full-block">
        <Form dispatch={this.props.dispatch} session={this.props.session} things={this.props.things} thingName={this.props.params.name} type={this.props.params.name}/>
        <Upload session={this.props.session} things={this.props.things} thingName={this.props.params.name}  type={this.props.params.name}
                dispatch={this.props.dispatch}/>
      </div>;
    return (
      <div>
        <Title title={this.state.title} link={this.state.link}/>
        <Panel head={this.state.head} body={panelBody}/>
      </div>
    )

  }

}

export default connect(mapStateToProps)(Edit);
