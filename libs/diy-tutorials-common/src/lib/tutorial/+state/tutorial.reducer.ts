import {
  AddMeasurement,
  AddProductsToCart,
  AddResponse,
  ChangeInstancesCount,
  ShowProducts,
  TutorialActionTypes
} from './tutorial.actions';
import {createReducer} from 'redux-starter-kit'
import {Response} from '../../models/response.model';
import {BlockAttributes} from '../../models/block-attributes.model';
import {filterBlocksByName} from '../../utils';
import {BlockNames} from '../../constants';

const FormulaParser = require('hot-formula-parser').Parser;

export interface TutorialState {
  blocks: BlockAttributes[];
  sections: BlockAttributes[],
  displayedSections: string[],
  questions: BlockAttributes[],
  measurements: BlockAttributes[],
  measurementForms: BlockAttributes[],
  measurementFormsOrder: string[],
  products: BlockAttributes[],
  productRanges: BlockAttributes[],
  showProducts: boolean,
  productQuantities: { [uuid: string]: number };
  responses: { [uuid: string]: Response };
  measuredValues: { [uuid: string]: { [instanceIndex: string]: string } };
  measuredFormValues: { [uuid: string]: number };
  instancesCountByMeasurementForm: { [uuid: string]: number };
  questionOptions: { [uuid: string]: any };
  displayedConditions: { [uuid: string]: any };
  displayedProductTypes: { [uuid: string]: boolean };
}

export const initialTutorialState: TutorialState = {
  blocks: [],
  sections: [],
  displayedSections: [],
  questions: [],
  measurements: [],
  measurementForms: [],
  measurementFormsOrder: [],
  showProducts: false,
  productRanges: [],
  products: [],
  productQuantities: {},
  responses: {},
  measuredValues: {},
  measuredFormValues: {},
  instancesCountByMeasurementForm: {},
  questionOptions: {},
  displayedConditions: {},
  displayedProductTypes: {},
};

export const tutorialReducer = createReducer(initialTutorialState, {
  [TutorialActionTypes.AddResponse]: (state: TutorialState, action: AddResponse) => {
    const {answer} = action.payload;
    const {questionUUID} = answer;

    const parentBlockUUID = state.questions.find(attributes => attributes.uuid === questionUUID).parentBlockUUID;

    state.responses[answer.questionUUID] = answer;


    const historyEnd = state.displayedSections.indexOf(parentBlockUUID) + 1;
    const history = state.displayedSections.slice(0, historyEnd);

    state.displayedProductTypes = calculateDisplayedProductTypes(state);

    if (answer.goToNextSection) {
      state.displayedSections = [...history, answer.nextSection];
      state.showProducts = false;
    }

    return state;
  },

  [TutorialActionTypes.ShowProducts]: (state: TutorialState, action: ShowProducts) => {
    state.showProducts = true;

    return state;
  },

  [TutorialActionTypes.AddMeasurement]: (state: TutorialState, action: AddMeasurement) => {
    const {uuid, value, parentBlockUUID, instanceIndex} = action.payload;

    state.measuredValues[uuid] = {
      ...state.measuredValues[uuid],
      [instanceIndex]: value
    };

    state.measuredFormValues[parentBlockUUID] = calculateMeasuredFormValue(state, parentBlockUUID);
    state.productQuantities = calculateProductQuantities(state);

    return state;
  },
  [TutorialActionTypes.ChangeInstancesCount]: (state: TutorialState, action: ChangeInstancesCount) => {
    const {uuid, count} = action.payload;
    state.instancesCountByMeasurementForm[uuid] = count;

    return state;
  },
  [TutorialActionTypes.AddProductsToCart]: (state: TutorialState, action: AddProductsToCart) => {
    const {products} = action.payload;

    console.log(products);

    return state;
  }
});


function calculateMeasuredFormValue(state: TutorialState, parentBlockUUID) {
  const measurementFormBlock = state.blocks.find(block => block.uuid === parentBlockUUID);
  const measurementsByProperty = state.measurements.filter(block => block.parentBlockUUID === parentBlockUUID)
    .map(block => {
      const measuredValues = state.measuredValues[block.uuid];
      return measuredValues ? Object.values(measuredValues) : []
    });

  const measurementsByInstance = transposeArray(measurementsByProperty);

  const instancesCount = state.instancesCountByMeasurementForm[parentBlockUUID];

  return new Array(instancesCount).fill(1).reduce((sum, value, index) => {
    const parser = new FormulaParser();
    parser.on('callCellValue', function (cellCoord, done) {
      done(measurementsByInstance[index][cellCoord.row.index]);
    });
    return sum + parser.parse(measurementFormBlock.formula).result || 0;
  }, 0);
}

function calculateProductQuantities(state: TutorialState) {

  const measuredFormValues = state.measurementFormsOrder.map(uuid => state.measuredFormValues[uuid]);

  return state.products.reduce((productQuantities, block) => {
    const parser = new FormulaParser();
    parser.on('callCellValue', function (cellCoord, done) {
      done(measuredFormValues[cellCoord.row.index]);
    });

    const parsedObject = parser.parse(block.quantityFormula);
    const quantity = parsedObject.error ? 0 : parsedObject.result;

    return {
      ...productQuantities,
      [block.uuid]: Math.ceil(quantity)
    }

  }, {});

}

function calculateDisplayedProductTypes(state: TutorialState) {

  return filterBlocksByName(state.blocks, BlockNames.ProductType)
    .reduce((displayedProductTypes, {uuid}) => {
      return {
        [uuid]: isDisplayed(state, state.displayedConditions[uuid]),
        ...displayedProductTypes
      };
    }, {});
}

function isDisplayed(state: TutorialState, displayedConditions: { question: string, response: string }[] = []): boolean {
  return displayedConditions.reduce((displayed, condition) => {
    return displayed && (state.responses[condition.question].responseUUID === condition.response);
  }, true);
}


function transposeArray(array) {
  return array[0].map((col, i) => array.map(row => row[i]));
}
