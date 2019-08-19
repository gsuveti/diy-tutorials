import {from, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {GetUserData, TutorialActionTypes, userDataFetched} from './tutorial.actions';
import {filter, map, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';
import {AppState} from '@diy-tutorials/diy-tutorials-common';

export const getUserDataEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.GetUserData),
    filter((action: GetUserData) => !!action.payload.user),
    switchMap((action: GetUserData) => {
      const {user} = action.payload;
      const {uuid: tutorialUUID} = state$.value.tutorial;

      return from(firebase.firestore().collection(`responses`).doc(`${user.uid}/tutorials/${tutorialUUID}`).get());
    }),
    map(document => userDataFetched(document.data()))
  );
};
