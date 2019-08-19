import {from, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {getUserData, TutorialActionTypes} from './tutorial.actions';
import {map, switchMap} from 'rxjs/operators';
import {AppState} from '@diy-tutorials/diy-tutorials-common';
import * as firebase from 'firebase';


export const loginWithProviderEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.LoginWithGoogle, TutorialActionTypes.LoginWithFacebook),
    switchMap((action: AnyAction) => {
      const provider = action.type === TutorialActionTypes.LoginWithGoogle ?
        new firebase.auth.GoogleAuthProvider()
        :
        new firebase.auth.FacebookAuthProvider();

      return from(firebase.auth().currentUser.linkWithPopup(provider))
        .pipe(
          map((userCredentials: firebase.auth.UserCredential) => {
            return getUserData(userCredentials.user);
          })
        );
    })
  );
};
