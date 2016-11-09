import Auth0Lock from 'auth0-lock'
let _store = null;

const success = result => {
  if (result.data.success) {
    return _store.dispatch({type: 'HAS_THING', hasThing: result.data.exist});
  }
};

export default class AuthService {
  constructor(clientId, domain, store) {
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {});
    _store = store;
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this)
    // if (this.loggedIn()) {
    //   store.dispatch({type: 'CREATE_SESSION', token: this.getToken()})
    // }
  }

  _doAuthentication(authResult){
    // Saves the user token
    this.setToken(authResult.idToken);
    _store.dispatch({type: 'CREATE_SESSION', token: authResult.idToken, successResponse: success})
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn(){
    // Checks if there is a saved token and it's still valid
    return !!this.getToken();
  }

  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    _store.dispatch({type: 'REMOVE_SESSION'})
  }
}
