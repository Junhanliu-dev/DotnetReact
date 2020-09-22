import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import ScrolltoTop from './app/layout/scollToTop'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrolltoTop>
        <App />
      </ScrolltoTop>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
