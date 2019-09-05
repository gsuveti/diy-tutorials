import {from, Observable, of} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {TutorialActionTypes, userDataSaved} from '../tutorial.actions';
import {debounceTime, map, switchMap} from 'rxjs/operators';
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
      const currentUser = firebase.auth().currentUser;
      console.log(currentUser);

      if (!currentUser) {
        return from(firebase.auth().signInAnonymously()).pipe(
          map(userCredentials => userCredentials.user)
        );
      }
      return of(currentUser);
    }),
    switchMap(currentUser => {
      const userContextState = state$.value.userContext;

      const {uuid: tutorialUUID, responses} = userContextState;
      const {measuredValues, instancesCountByMeasurementForm, displayedSections} = userContextState;
      const {showProducts, selectedProducts, selectedProductRange} = userContextState;

      const data = {
        responses,
        measuredValues,
        instancesCountByMeasurementForm,
        displayedSections,
        showProducts,
        selectedProducts,
        selectedProductRange
      };
      return from(firebase.firestore().collection(`responses`).doc(`${currentUser.uid}/tutorials/${tutorialUUID}`).set(data));
    }),
    map(() => userDataSaved())
  );
};
