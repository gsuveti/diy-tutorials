import {filterBlocksByName, getBlockAttributesList, groupBy} from '../utils';
import {TutorialState} from './tutorial.reducer';
import {Block} from '../models/block.model';
import {BlockNames} from '../constants';
import {EnvironmentModel} from '@diy-tutorials/diy-tutorials-common';

export function getTutorialInitialState(uuid: string, innerBlocks: Block[], environment:EnvironmentModel): TutorialState {


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


  const displayedConditions = groupBy(filterBlocksByName(blocks, BlockNames.DisplayCondition), 'parentBlockUUID');
  const options = filterBlocksByName(blocks, BlockNames.QuestionOption);

  const questionsWithRedirect: string[] = options.filter(option => option.nextSection)
    .map(option => option.parentBlockUUID);

  const sectionsWithRedirect = questions
    .filter(question => questionsWithRedirect.indexOf(question.uuid) > -1)
    .map(question => question.parentBlockUUID);

  const questionOptions = groupBy(options, 'parentBlockUUID');


  return {
    uuid,
    blocks,
    sections,
    sectionsWithRedirect,
    questions,
    measurements,
    measurementForms,
    measurementFormsOrder,
    products,
    optionalProducts,
    commonProducts,
    productRanges,
    questionOptions,
    displayedConditions,
    environment
  };
}
