import {Observable, of} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddMeasurement, TutorialActionTypes, updateMeasurementFormValue, UserDataFetched} from '../tutorial.actions';
import {map, mergeMap} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';

const FormulaParser = require('hot-formula-parser').Parser;

export const calculateMeasurementFormValueEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.AddMeasurement),
        map((action: AddMeasurement) => {
            const {parentBlockUUID} = action.payload;
            const state = state$.value;
            const value = calculateMeasuredFormValue(state, parentBlockUUID);
            return updateMeasurementFormValue(parentBlockUUID, value);
        })
    );
};

export const calculateAllMeasurementFormValuesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.UserDataFetched),
        mergeMap((action: UserDataFetched) => {
            const state = state$.value;
            const tutorialState = state$.value.tutorial;

            const actions = tutorialState.measurementForms.map(measurementForm => {
                const value = calculateMeasuredFormValue(state, measurementForm.uuid);
                return updateMeasurementFormValue(measurementForm.uuid, value);
            });
            return of(...actions);
        })
    );
};

function calculateMeasuredFormValue(state: AppState, parentBlockUUID): number {
    const {blocks, measurements} = state.tutorial;
    const userContextState = state.userContext;

    const measurementFormBlock = blocks.find(block => block.uuid === parentBlockUUID);
    const measurementsByProperty = measurements.filter(block => block.parentBlockUUID === parentBlockUUID)
        .map(block => {
            const measuredValues = userContextState.measuredValues[block.uuid];
            return measuredValues ? Object.values(measuredValues) : []
        });

    const measurementsByInstance = transposeArray(measurementsByProperty);

    const instancesCount = userContextState.instancesCountByMeasurementForm[parentBlockUUID] || 1;


    return new Array(instancesCount).fill(1).reduce((sum, value, index) => {
        if (sum === null) {
            return sum;
        }

        const parser = new FormulaParser();
        parser.on('callCellValue', function (cellCoord, done) {
            done(measurementsByInstance[index][cellCoord.row.index]);
        });
        const formulaResult = parser.parse(measurementFormBlock.formula).result;
        if (formulaResult) {
            return sum + formulaResult;
        }

        return null;
    }, 0);
}


function transposeArray(array) {
    return array[0].map((col, i) => array.map(row => row[i]));
}
