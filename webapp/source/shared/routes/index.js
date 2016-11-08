import { Router, Route } from 'react-router';
import App from 'shared/components/server';

export default (store, React, browserHistory) => {
  return (
    <Router history={ browserHistory }>
      <Route path="*" component={ App(React) }/>
    </Router>
  );
};
