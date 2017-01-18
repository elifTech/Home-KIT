import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
  App,
  Guide,
  Home,
  Troubleshooting,
  NotFound} from 'containers';


export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/guide" component={Guide}/>
      <Route path="/troubleshooting" component={Troubleshooting}/>
      <Route path="*" component={NotFound} status={404}/>
    </Route>
  );
};
