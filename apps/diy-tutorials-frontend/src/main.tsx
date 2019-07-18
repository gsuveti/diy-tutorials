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


  console.log(innerBlocks);
  console.log(blocks);

  ReactDOM.render(
    <Provider store={configureStore({
      tutorial: {
        blocks,
        sections,
        questions,
        measurements,
        answers: {},
        measuredValues: {},
        measuredFormValues: {},
        instancesCountByMeasurementForm: {},
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


