import React from 'react';
import ReactDOM from 'react-dom';
import {App, ROOT_ID} from '@diy-tutorials/diy-tutorials-common';


console.log("hydrating root element");
ReactDOM.hydrate(
  <App></App>,
  document.getElementById(ROOT_ID)
);

