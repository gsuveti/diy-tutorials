import {from, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {TutorialActionTypes, userDataSaved} from './tutorial.actions';
import {debounceTime, map, mergeMap, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';
import {AppState} from '@diy-tutorials/diy-tutorials-common';

export const saveUserDataEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(
      TutorialActionTypes.AddResponse,
      TutorialActionTypes.AddMeasurement,
      TutorialActionTypes.ShowProducts,
      TutorialActionTypes.SelectProduct,
      TutorialActionTypes.RemoveProduct,
      TutorialActionTypes.SelectProductRange,
      TutorialActionTypes.ChangeInstancesCount,
      TutorialActionTypes.HideProducts,
      TutorialActionTypes.UpdateDisplayedProductTypes,
      TutorialActionTypes.UpdateDisplayedSections,
      TutorialActionTypes.ResetResponses,
    ),
    debounceTime(1000),
    switchMap(action => {
      const tutorialState = state$.value.tutorial;
      const {userUID, responses} = tutorialState;
      const {measuredValues, instancesCountByMeasurementForm, displayedSections} = tutorialState;
      const {showProducts, selectedProducts, selectedProductRange} = tutorialState;

      const data = {
        responses,
        measuredValues,
        instancesCountByMeasurementForm,
        displayedSections,
        showProducts,
        selectedProducts,
        selectedProductRange
      };
      return from(firebase.firestore().collection(`responses`).doc(userUID).set(data));
    }),
    map(() => userDataSaved())
  );
};
