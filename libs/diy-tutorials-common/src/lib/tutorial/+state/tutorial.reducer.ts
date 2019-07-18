import {AddAnswer, AddMeasurement, ChangeInstancesCount, TutorialActionTypes} from './tutorial.actions';
import {createReducer} from 'redux-starter-kit'
import {Answer} from '../../models/answer.model';
import {BlockAttributes} from '../../models/block-attributes.model';
import {zip} from 'lodash';

const FormulaParser = require('hot-formula-parser').Parser;

export interface TutorialState {
  blocks: BlockAttributes[];
  sections: BlockAttributes[],
  questions: BlockAttributes[],
  measurements: BlockAttributes[],
  answers: { [uuid: string]: Answer };
  measuredValues: { [uuid: string]: { [instanceIndex: string]: string } };
  measuredFormValues: { [uuid: string]:  number  };
  instancesCountByMeasurementForm: { [uuid: string]: number };
}

export const initialTutorialState: TutorialState = {
  answers: {},
  measuredValues: {},
  measuredFormValues: {},
  instancesCountByMeasurementForm: {},
  blocks: [],
  sections: [],
  questions: [],
  measurements: [],
};

export const tutorialReducer = createReducer(initialTutorialState, {
  [TutorialActionTypes.AddAnswer]: (state: TutorialState, action: AddAnswer) => {
    const {answer} = action.payload;
    state.answers[answer.uuid] = answer;

    return state;
  },
  [TutorialActionTypes.AddMeasurement]: (state: TutorialState, action: AddMeasurement) => {
    const {uuid, value, parentBlockUUID, instanceIndex} = action.payload;

    state.measuredValues[uuid] = {
      ...state.measuredValues[uuid],
      [instanceIndex]: value
    };

    const measurementFormBlock = state.blocks.find(block => block.uuid === parentBlockUUID);
    const measurementsByQuestion = state.measurements.filter(block => block.parentBlockUUID === parentBlockUUID)
      .map(block => {
        const measuredValues = state.measuredValues[block.uuid];
        return measuredValues ? Object.values(measuredValues) : []
      });

    const measurementsByInstance = zip(...measurementsByQuestion);

    const instancesCount = state.instancesCountByMeasurementForm[parentBlockUUID];

    const measurementFormValue = new Array(instancesCount).fill(1).reduce((sum, value, index) => {

      const parser = new FormulaParser();
      parser.on('callCellValue', function (cellCoord, done) {
        done(measurementsByInstance[index][cellCoord.row.index]);
      });
      return sum + parser.parse(measurementFormBlock.formula).result || 0;

    }, 0);

    state.measuredFormValues[parentBlockUUID] = measurementFormValue;

    return state;
  },
  [TutorialActionTypes.ChangeInstancesCount]: (state: TutorialState, action: ChangeInstancesCount) => {
    const {uuid, count} = action.payload;
    state.instancesCountByMeasurementForm[uuid] = count;

    return state;
  }
});
