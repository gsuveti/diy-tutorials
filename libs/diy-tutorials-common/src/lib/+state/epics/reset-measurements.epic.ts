import {Observable, of} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {addMeasurement, changeInstancesCount, TutorialActionTypes, UpdateDisplayedSections} from '../tutorial.actions';
import {mergeMap} from 'rxjs/operators';
import {AppState} from '../app.state';

export const resetMeasurementsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.UpdateDisplayedSections),
    mergeMap((action: UpdateDisplayedSections) => {
      const state = state$.value;
      const tutorialState = state.tutorial;

      const {displayedSections} = action.payload;
      const {measurementForms, measurements} = tutorialState;

      const displayedMeasurementForms = measurementForms
        .filter(measurementForm => displayedSections.indexOf(measurementForm.parentBlockUUID) < 0)
        .map(measurementForm => measurementForm.uuid);


      const hiddenMeasurements = measurements
        .filter(measurement => displayedMeasurementForms.indexOf(measurement.parentBlockUUID) >= 0)

      const measurementResetActions = hiddenMeasurements.map(measurement => {
        return addMeasurement(measurement.uuid, measurement.parentBlockUUID, 0, 0);
      });

      const instanceCountResetActions = hiddenMeasurements.map(
        measurement => changeInstancesCount(measurement.parentBlockUUID)
      );

      return of(...measurementResetActions);

    })
  );
};
