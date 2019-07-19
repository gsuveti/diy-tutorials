import {AddAnswer, AddMeasurement, ChangeInstancesCount, TutorialActionTypes} from './tutorial.actions';
import {createReducer} from 'redux-starter-kit'
import {Answer} from '../../models/answer.model';
import {BlockAttributes} from '../../models/block-attributes.model';
import {zip} from 'lodash';

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
  productQuantities: { [uuid: string]: number };
  answers: { [uuid: string]: Answer };
  measuredValues: { [uuid: string]: { [instanceIndex: string]: string } };
  measuredFormValues: { [uuid: string]: number };
  instancesCountByMeasurementForm: { [uuid: string]: number };
}

export const initialTutorialState: TutorialState = {
  blocks: [],
  sections: [],
  displayedSections: [],
  questions: [],
  measurements: [],
  measurementForms: [],
  measurementFormsOrder: [],
  products: [],
  productQuantities: {},
  answers: {},
  measuredValues: {},
  measuredFormValues: {},
  instancesCountByMeasurementForm: {},
};

export const tutorialReducer = createReducer(initialTutorialState, {
  [TutorialActionTypes.AddAnswer]: (state: TutorialState, action: AddAnswer) => {
    const {answer} = action.payload;
    const {uuid} = answer;

    const parentBlockUUID = state.questions.find(attributes => attributes.uuid === uuid).parentBlockUUID;

    state.answers[answer.uuid] = answer;


    const historyEnd = state.displayedSections.indexOf(parentBlockUUID) + 1;
    const history = state.displayedSections.slice(0, historyEnd);


    if (answer.goToNextSection) {
      state.displayedSections = [...history, answer.nextSection];
    }
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
  }
});


function calculateMeasuredFormValue(state: TutorialState, parentBlockUUID) {
  const measurementFormBlock = state.blocks.find(block => block.uuid === parentBlockUUID);
  const measurementsByProperty = state.measurements.filter(block => block.parentBlockUUID === parentBlockUUID)
    .map(block => {
      const measuredValues = state.measuredValues[block.uuid];
      return measuredValues ? Object.values(measuredValues) : []
    });

  const measurementsByInstance = zip(...measurementsByProperty);

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

    const quantity = parser.parse(block.quantityFormula).result || 1;
    return {
      ...productQuantities,
      [block.uuid]: Math.ceil(quantity)
    }

  }, {});

}
