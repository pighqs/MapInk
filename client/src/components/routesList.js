import React from 'react';
// initialisation Router
import { Route } from 'react-router-dom';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import RegisterLoginRedux from './pages/RegisterLogin';
import GuestSessions from './pages/GuestSessions';


const RoutesList = () => (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/searchresults" component={SearchResults} />
        <Route path="/register" component={RegisterLoginRedux} />
        <Route path="/login" component={RegisterLoginRedux} />
        <Route path="/guestsessions" component={GuestSessions} />
        {/* <Route path="*" component={NoMatch} />     */}
      </div>
    );


export default RoutesList;
