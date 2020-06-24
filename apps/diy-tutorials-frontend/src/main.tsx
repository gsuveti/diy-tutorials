import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {
    configureStore,
    ConnectedTutorial,
    deserializeAttributes,
    EnvironmentModel,
    getInnerBlocks,
    getTutorialInitialState,
    getUserContextInitialState,
    initialUserState,
    ROOT_ID,
    setAuthPersistence,
    watchAuthState
} from '@diy-tutorials/diy-tutorials-common';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


const rootElement = document.getElementById(ROOT_ID);

if (rootElement) {
    console.log("hydrating root element");

    const environment: EnvironmentModel = window['diy_tutorials_environment'];

    const attributes = deserializeAttributes(rootElement.dataset.attributes);
    const innerBlocks = getInnerBlocks(rootElement, attributes.uuid);

    const tutorialState = getTutorialInitialState(attributes.uuid, innerBlocks, environment);
    const userContextState = getUserContextInitialState(tutorialState);

    firebase.initializeApp(JSON.parse(environment.firebase_config));
    setAuthPersistence();

    const store = configureStore({
        tutorial: tutorialState,
        userContext: userContextState,
        user: initialUserState
    });

    watchAuthState(store);


    ReactDOM.render(
        <Provider store={store}>
            <ConnectedTutorial
                stickyBannerDebounceTime={Number.parseInt(environment.stickyBannerDebounceTime)}
                attributes={attributes}
                innerBlocks={innerBlocks}>
            </ConnectedTutorial>
        </Provider>,
        rootElement
    );

}
