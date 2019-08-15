import {Observable, of} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddMeasurement, TutorialActionTypes, updateMeasurementFormValue, UserDataFetched} from './tutorial.actions';
import {map, mergeMap} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';
import {TutorialState} from './tutorial.reducer';

const FormulaParser = require('hot-formula-parser').Parser;

export const calculateMeasurementFormValueEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.AddMeasurement),
    map((action: AddMeasurement) => {
      const {parentBlockUUID} = action.payload;
      const state = state$.value.tutorial;
      const value = calculateMeasuredFormValue(state, parentBlockUUID);
      return updateMeasurementFormValue(parentBlockUUID, value);
    })
  );
};
export const calculateAllMeasurementFormValuesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.UserDataFetched),
    mergeMap((action: UserDataFetched) => {
      const state = state$.value.tutorial;

      const actions = state.measurementForms.map(measurementForm => {
        const value = calculateMeasuredFormValue(state, measurementForm.uuid);
        return updateMeasurementFormValue(measurementForm.uuid, value);
      });
      return of(...actions);
    })
  );
};

function calculateMeasuredFormValue(state: TutorialState, parentBlockUUID): number {
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


function transposeArray(array) {
  return array[0].map((col, i) => array.map(row => row[i]));
}
