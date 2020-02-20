import {Observable, of} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {changeInstancesCount, TutorialActionTypes, UpdateDisplayedSections} from '../tutorial.actions';
import {mergeMap} from 'rxjs/operators';
import {AppState} from '../app.state';

export const resetMeasurementInstancesEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.UpdateDisplayedSections),
    mergeMap((action: UpdateDisplayedSections) => {
      const state = state$.value;
      const tutorialState = state.tutorial;

      const {displayedSections} = action.payload;
      const {measurementForms} = tutorialState;

      const instanceCountResetActions = measurementForms
        .filter(measurementForm => displayedSections.indexOf(measurementForm.parentBlockUUID) < 0)
        .map(measurementForm => changeInstancesCount(measurementForm.uuid, 0));

      return of(...instanceCountResetActions);
    })
  );
};
