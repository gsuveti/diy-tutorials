import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddMeasurement, TutorialActionTypes, updateProductQuantities} from '../tutorial.actions';
import {map} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';

const FormulaParser = require('hot-formula-parser').Parser;

export const calculateProductQuantitiesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.UpdateMeasurementFormValue),
    map((action: AddMeasurement) => {
      const state = state$.value;
      const productQuantities = calculateProductQuantities(state);
      return updateProductQuantities(productQuantities);
    })
  );
};


function calculateProductQuantities(state: AppState) {
  const tutorialState = state.tutorial;
  const userContextState = state.userContext;
  const measuredFormValues = tutorialState.measurementFormsOrder.map(uuid => userContextState.measuredFormValues[uuid]);

  return tutorialState.products.reduce((productQuantities, block) => {
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
