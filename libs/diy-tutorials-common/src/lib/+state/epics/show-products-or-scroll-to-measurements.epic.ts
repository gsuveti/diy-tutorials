import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {map} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';
import {showProducts, TutorialActionTypes, UserDataFetched} from '../tutorial.actions';


export const showProductsOrScrollToMeasurementsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.ShowProductsOrScrollToMeasurements),
    map((action: UserDataFetched) => {
      const tutorialState = state$.value.tutorial;
      const userContextState = state$.value.userContext;

      const measurementFormWithoutValue = tutorialState.measurementForms.find(measurementForm => {
        return !userContextState.measuredFormValues[measurementForm.uuid];
      });

      if (measurementFormWithoutValue) {
        document.getElementById(measurementFormWithoutValue.uuid).scrollIntoView({
          behavior: 'smooth'
        });
      }

      return showProducts();
    })
  );
};
