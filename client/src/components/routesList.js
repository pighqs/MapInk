import React from 'react';
// initialisation Router
import { Route } from 'react-router-dom';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import RegisterLogin from './pages/RegisterLogin';
import GuestSessions from './pages/GuestSessions';
import Profile from './pages/Profile';


const RoutesList = () => (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/searchresults" component={SearchResults} />
        <Route path="/register" component={RegisterLogin} />
        <Route path="/login" component={RegisterLogin} />
        <Route path="/profile" component={Profile} />
        <Route path="/guestsessions" component={GuestSessions} />
        {/* <Route path="*" component={NoMatch} />     */}
      </div>
    );


export default RoutesList;
