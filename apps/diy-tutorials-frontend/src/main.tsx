import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {
  BlockNames,
  configureStore,
  deserializeAttributes,
  filterBlocksByName,
  getBlockList,
  getInnerBlocks,
  getQuestionsToSectionMap,
  ROOT_ID,
  Tutorial
} from '@diy-tutorials/diy-tutorials-common';
import {serialize} from '@wordpress/blocks';


const rootElement = document.getElementById(ROOT_ID);
if (rootElement) {
  console.log("hydrating root element");

  const innerBlocks = getInnerBlocks(rootElement);
  const blocks = getBlockList(innerBlocks);
  const sections = filterBlocksByName(blocks, BlockNames.Section);
  const questions = filterBlocksByName(blocks, BlockNames.Question);
  const measurements = filterBlocksByName(blocks, BlockNames.Measurement);
  const measurementForms = filterBlocksByName(blocks, BlockNames.MeasurementForm);

  const questionsToSectionLinks = getQuestionsToSectionMap(innerBlocks);

  console.log(innerBlocks);
  console.log(blocks);
  console.log(questionsToSectionLinks);

  ReactDOM.render(
    <Provider store={configureStore({
      tutorial: {
        blocks,
        sections,
        questions,
        measurements,
        answers: {},
        measuredValues: {},
        instancesCountByMeasurementForm: {},
      }
    })}>
      <Tutorial
        attributes={deserializeAttributes(rootElement.dataset.attributes)}
        innerBlocks={innerBlocks}>
      </Tutorial>
    </Provider>,
    rootElement
  );

}


