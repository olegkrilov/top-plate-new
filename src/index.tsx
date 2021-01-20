import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import routesConfig from './Routes/Routes.config';
import sharedService from './Services/Shared.service';
import routingService from './Services/Routing.service';
import userService from './Services/User.service';
import apiService from './Services/API.service';

import App from './App/App.component';
import reportWebVitals from './reportWebVitals';

configure({enforceActions: 'always'});

ReactDOM.render(
  <Provider
    sharedService={sharedService}
    routingService={routingService.init(routesConfig)}
    userService={userService}
    apiService={apiService}>
    <App />
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
