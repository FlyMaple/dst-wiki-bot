import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-perfect-scrollbar/dist/css/styles.min.css'
import './css/style.css'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
