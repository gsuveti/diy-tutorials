import React from 'react';
import ReactDOM from 'react-dom';
import {ROOT_ID, Tutorial} from '@diy-tutorials/diy-tutorials-common';


const rootElement = document.getElementById(ROOT_ID);
if (rootElement) {
  console.log("hydrating root element");

  ReactDOM.hydrate(
    <Tutorial></Tutorial>,
    rootElement
  );
}

