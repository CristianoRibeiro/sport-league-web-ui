import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Schedule from './pages/Schedule';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/Schedule" component={Schedule} />
        <Route path="/Leaderboard" component={Leaderboard} />
        <Route exact path="/" component={Schedule} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
