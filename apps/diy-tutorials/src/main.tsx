import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/app';
import * as firebase from 'firebase';
import {firebaseConfig} from '../../firebase.config';

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch(function (error) {
    console.log("Unable to set auth persistence to LOCAL");
  });


ReactDOM.render(<App/>, document.getElementById('root'));
