import {from, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {resetUserContext, TutorialActionTypes} from '../tutorial.actions';
import {map, switchMap} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';
import * as firebase from 'firebase';


export const logoutEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.Logout),
    switchMap((action: AnyAction) => {
        return from(firebase.auth().signOut()).pipe(
          map(() => resetUserContext())
        );
      }
    )
  );
};
