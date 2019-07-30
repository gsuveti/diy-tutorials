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

  ReactDOM.render(
    <Provider store={configureStore({
      tutorial: {
        blocks,
        sections,
        sectionsWithRedirect,
        displayedSections,
        questions,
        measurements,
        measurementForms,
        measurementFormsOrder,
        products,
        productRanges,
        showProducts: false,
        productQuantities,
        responses: {},
        measuredValues: {},
        measuredFormValues: {},
        instancesCountByMeasurementForm,
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


