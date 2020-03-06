import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {filter, map} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';
import {showProducts, TutorialActionTypes, UserDataFetched} from '../tutorial.actions';


export const showProductsOrScrollToMeasurementsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.ShowProductsOrScrollToMeasurements),
    filter((action: UserDataFetched) => {
      const tutorialState = state$.value.tutorial;
      const userContextState = state$.value.userContext;
      const {measuredFormValues, displayedSections} = userContextState;

      const measurementFormWithoutValue = tutorialState.measurementForms.find(measurementForm => {
        return !measuredFormValues[measurementForm.uuid] &&
          displayedSections.indexOf(measurementForm.parentBlockUUID) > -1;
      });

      if (measurementFormWithoutValue) {
        const id = measurementFormWithoutValue.uuid;
        const measurement = document.getElementById(id);
        measurement.scrollIntoView({
          behavior: 'smooth'
        });
        const input = measurement.querySelector('input');
        input.focus();

        return false;
      }
      return true;
    }),
    map(() => showProducts())
  );
};
