import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
// initialisation Router
import { BrowserRouter } from 'react-router-dom';
import RoutesList from './components/routesList';

//Initialisation de Redux
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';


//import { composeWithDevTools } from 'redux-devtools-extension';

// reducers 
import sendCityCoords from './reducers/sendCityCoords.reducer';
import sendLoggedArtist from './reducers/sendLoggedArtist.reducer';
const reducer = combineReducers({ sendCityCoords, sendLoggedArtist });

const store = createStore(
    reducer, /* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

ReactDOM.render(
<Provider store={store}>
    <BrowserRouter>
      <RoutesList/>
    </BrowserRouter>
  </Provider>,
document.getElementById('root'));
registerServiceWorker();
