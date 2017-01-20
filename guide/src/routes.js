import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
  App,
  Guide,
  Home,
  NotFound} from 'containers';


export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/guide" component={Guide}/>
      <Route path="*" component={NotFound} status={404}/>
    </Route>
  );
};
