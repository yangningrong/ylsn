import React from 'react';
import ReactDOM from 'react-dom';
import Fastclick from 'react-fastclick';

import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

(function init() {
  // Init fastclick
  Fastclick();
})();
