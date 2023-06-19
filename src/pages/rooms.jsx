import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Community from './community';
import Study from './study';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Community} />
        <Route path="/study" component={Study} />
      </Switch>
    </Router>
  );
}

export default App;
