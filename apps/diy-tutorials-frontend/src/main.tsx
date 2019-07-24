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
  ROOT_ID,
  Tutorial
} from '@diy-tutorials/diy-tutorials-common';
import {serialize} from '@wordpress/blocks';
import {groupBy} from 'lodash';

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

  const products = filterBlocksByName(blocks, BlockNames.Product);

  const displayedSections = [sections[0].uuid];
  const productQuantities = products.reduce((productQuantities, {uuid}) => {
    return {
      ...productQuantities,
      [uuid]: 0
    }
  }, {});
  const displayedConditions = groupBy(filterBlocksByName(blocks, BlockNames.DisplayCondition), 'parentBlockUUID');

  const questionOptions = groupBy(filterBlocksByName(blocks, BlockNames.QuestionOption), 'parentBlockUUID');

  console.log(innerBlocks);
  console.log(blocks);

  ReactDOM.render(
    <Provider store={configureStore({
      tutorial: {
        blocks,
        sections,
        displayedSections,
        questions,
        measurements,
        measurementForms,
        measurementFormsOrder,
        products,
        showProducts: false,
        productQuantities,
        responses: {},
        measuredValues: {},
        measuredFormValues: {},
        instancesCountByMeasurementForm: {},
        questionOptions,
        displayedConditions,
        displayedProductTypes: {}
      }
    })}>
      <Tutorial
        attributes={attributes}
        innerBlocks={innerBlocks}>
      </Tutorial>
    </Provider>,
    rootElement
  );

}


