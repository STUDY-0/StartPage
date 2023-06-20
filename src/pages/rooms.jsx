import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
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
