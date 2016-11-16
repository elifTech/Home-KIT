import {connect} from 'react-redux';
import createTitle from 'shared/components/title';
import React from 'react';
import Panel from 'shared/components/panel';
import send from './send';

const mapStateToProps = (state) => {
  const {session} = state;
  return {session};
};

class App extends React.Component {
  constructor(props) {
    super(props);
    if (!props.session.logged || props.session.hasCreds) {
      props.history.push('/');
    }
    this.state = {
      link: {
        title: 'Logout',
        event: e => {
          e.preventDefault();
          this.props.route.auth.logout();
          this.props.history.push('/');
        }
      },
      title: 'AWS credentials',
      head: 'Add credentials',
      accessKey: '',
      secretKey: '',
      invalid: true
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.submit = this.submit.bind(this);
  };

  componentWillReceiveProps(props) {
    if (!props.session.logged || props.session.hasCreds) {
      props.history.push('/');
    }
  }

  inputChanged(e, field) {
    let newState = {};
    newState[field] = e.target.value;
    this.setState(newState);
    if (!this.state.accessKey || !this.state.secretKey) {
      this.setState({
        invalid: true
      });
    } else {
      this.setState({
        invalid: false
      });
    }
  }

  submit(e) {
    e.preventDefault();
    if (!this.state.accessKey || !this.state.secretKey) {
      return false;
    }
    send(this.state.accessKey, this.state.secretKey, this.props.session.token, this.props.dispatch);
  }

  render() {
    const Title = createTitle(React);
    const link = this.state.link;
    const panelBody =
      <div className="cred-page">
        <form className="credentials" onSubmit={this.submit}>
          <input type="text" value={this.state.thingName}
                 onChange={e => this.inputChanged(e, 'accessKey')} placeholder="AWS access key"/>
          <input type="text" value={this.state.thingName}
                 onChange={e => this.inputChanged(e, 'secretKey')} placeholder="AWS secret key"/>
          <button className={this.state.invalid ? 'invalid' : ''} >Add</button>
        </form>
        <span className="info">You can create AWS account going <a href="https://www.amazon.com/ap/signin?openid.assoc_handle=aws&openid.return_to=https%3A%2F%2Fsignin.aws.amazon.com%2Foauth%3Fresponse_type%3Dcode%26client_id%3Darn%253Aaws%253Aiam%253A%253A015428540659%253Auser%252Fhomepage%26redirect_uri%3Dhttps%253A%252F%252Fconsole.aws.amazon.com%252Fconsole%252Fhome%253Fstate%253DhashArgs%252523%2526isauthcode%253Dtrue%26noAuthCookie%3Dtrue&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&action=&disableCorpSignUp=&clientContext=&marketPlaceId=&poolName=&authCookies=&pageId=aws.ssop&siteState=registered%2Cen_US&accountStatusPolicy=P1&sso=&openid.pape.preferred_auth_policies=MultifactorPhysical&openid.pape.max_auth_age=120&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&server=%2Fap%2Fsignin%3Fie%3DUTF8&accountPoolAlias=&forceMobileApp=0&language=en_US&forceMobileLayout=0" target="blank">
            here
          </a>. <br/>
          For more details go <a href="http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html" target="blank">here</a>.<br/>
          Remember that you must use eu-central-1 region (Frankfurt).
        </span>
      </div>;
    return (
      <div>
        <Title title={this.state.title} link={link}/>
        <Panel head={this.state.head} body={panelBody} history={this.props.history}/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
