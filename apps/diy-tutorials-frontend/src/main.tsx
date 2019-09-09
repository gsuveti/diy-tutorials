import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {
  configureStore,
  deserializeAttributes,
  getInnerBlocks,
  getTutorialInitialState,
  getUserContextInitialState,
  ROOT_ID,
  setAuthPersistence,
  Tutorial,
  watchAuthState
} from '@diy-tutorials/diy-tutorials-common';
import {serialize} from '@wordpress/blocks';
import * as firebase from 'firebase';
import {firebaseConfig} from '../../firebase.config';

const rootElement = document.getElementById(ROOT_ID);
if (rootElement) {
  console.log("hydrating root element");

  const attributes = deserializeAttributes(rootElement.dataset.attributes);
  const innerBlocks = getInnerBlocks(rootElement, attributes.uuid);

  const tutorialState = getTutorialInitialState(attributes.uuid, innerBlocks);
  const userContextState = getUserContextInitialState(tutorialState);


  firebase.initializeApp(firebaseConfig);
  setAuthPersistence();


  const store = configureStore({
    tutorial: tutorialState,
    userContext: userContextState
  });

  watchAuthState(store);


  ReactDOM.render(
    <Provider store={store}>
      <Tutorial
        attributes={attributes}
        innerBlocks={innerBlocks}>
      </Tutorial>
    </Provider>,
    rootElement
  );

}
