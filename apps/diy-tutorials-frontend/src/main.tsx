import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {
  BlockNames,
  configureStore,
  deserializeAttributes,
  filterBlocksByName,
  getBlockAttributesList,
  getInnerBlocks,
  groupBy,
  ROOT_ID,
  Tutorial
} from '@diy-tutorials/diy-tutorials-common';
import {serialize} from '@wordpress/blocks';
import * as firebase from 'firebase';
import {getUserData} from '../../../libs/diy-tutorials-common/src/lib/tutorial/+state/tutorial.actions';
import {setAuthPersistence} from '../../../libs/diy-tutorials-common/src/lib/authentication.service';

const rootElement = document.getElementById(ROOT_ID);
if (rootElement) {
  console.log("hydrating root element");

  const attributes = deserializeAttributes(rootElement.dataset.attributes);
  const innerBlocks = getInnerBlocks(rootElement, attributes.uuid);

  const blocks = getBlockAttributesList(innerBlocks);
  const sections = filterBlocksByName(blocks, BlockNames.Section);
  const questions = filterBlocksByName(blocks, BlockNames.Question);
  const measurements = filterBlocksByName(blocks, BlockNames.Measurement);
  const measurementForms = filterBlocksByName(blocks, BlockNames.MeasurementForm);
  const measurementFormsOrder = measurementForms.map(attributes => attributes.uuid);

  const productListUUID = filterBlocksByName(blocks, BlockNames.ProductList)[0].uuid;
  const products = filterBlocksByName(blocks, BlockNames.Product);
  const productListProducts = products.filter(product => product.parentBlockUUID === productListUUID);
  const optionalProducts = productListProducts.filter(product => product.optional);
  const commonProducts = productListProducts.filter(product => !product.optional);

  const productRanges = filterBlocksByName(blocks, BlockNames.ProductRange);

  const displayedSections = [sections[0].uuid];
  const productQuantities = products.reduce((productQuantities, {uuid}) => {
    return {
      ...productQuantities,
      [uuid]: 0
    }
  }, {});
  const displayedConditions = groupBy(filterBlocksByName(blocks, BlockNames.DisplayCondition), 'parentBlockUUID');
  const options = filterBlocksByName(blocks, BlockNames.QuestionOption);

  const questionsWithRedirect: string[] = options.filter(option => option.nextSection)
    .map(option => option.parentBlockUUID);

  const sectionsWithRedirect = questions
    .filter(question => questionsWithRedirect.indexOf(question.uuid) > -1)
    .map(question => question.parentBlockUUID);

  const questionOptions = groupBy(options, 'parentBlockUUID');

  const instancesCountByMeasurementForm = measurementForms.reduce((obj, item) => {
    return {
      ...obj,
      [item.uuid]: 1
    }
  }, {});

  const firebaseConfig = {
    apiKey: "AIzaSyD285HeMOqIYGUtbxtqReraee3wGYJDoyM",
    authDomain: "diy-tutorials-ro.firebaseapp.com",
    databaseURL: "https://diy-tutorials-ro.firebaseio.com",
    projectId: "diy-tutorials-ro",
    storageBucket: "",
    messagingSenderId: "755597193306",
    appId: "1:755597193306:web:a6746b5e60b01885"
  };


  const app = firebase.initializeApp(firebaseConfig);
  setAuthPersistence();

  const store = configureStore({
    tutorial: {
      uuid: attributes.uuid,
      blocks,
      sections,
      sectionsWithRedirect,
      displayedSections,
      questions,
      measurements,
      measurementForms,
      measurementFormsOrder,
      products,
      selectedProductRange: null,
      selectedProducts: [],
      optionalProducts,
      commonProducts,
      productRanges,
      showProducts: false,
      productQuantities,
      responses: {},
      measuredValues: {},
      measuredFormValues: {},
      instancesCountByMeasurementForm,
      questionOptions,
      displayedConditions,
      displayedProductTypes: {},
      displayedProducts: {},
      productRangePrices: {},
      commonProductsTotalPrice: 0
    }
  });


  firebase.auth().onAuthStateChanged(function (user: firebase.User) {
    store.dispatch(getUserData(user));
  });


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
