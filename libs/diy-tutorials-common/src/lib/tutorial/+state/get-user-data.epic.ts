import {from, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {GetUserData, TutorialActionTypes, userDataFetched} from './tutorial.actions';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';
import {AppState} from '@diy-tutorials/diy-tutorials-common';

export const getUserDataEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.GetUserData),
    switchMap((action: GetUserData) => {
      const {userUID} = action.payload;
      return from(firebase.firestore().collection(`responses`).doc(userUID).get());
    }),
    map(document => userDataFetched(document.data()))
  );
};
