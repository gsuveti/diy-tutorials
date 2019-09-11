import {from, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {TutorialActionTypes} from '../tutorial.actions';
import {catchError, ignoreElements, map, switchMap} from 'rxjs/operators';
import {CREDENTIALS_ALREADY_IN_USE} from '../../constants';
import * as firebase from 'firebase/app';
import {AppState} from '../app.state';


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
            catchError((err: any) => {
              const code = err.code;

              if (code === CREDENTIALS_ALREADY_IN_USE) {
                console.log("User already exists!")
                const credential = err.credential;


                const auth = firebase.auth();
                const currentUser = auth.currentUser;
                const oldUserUUID = currentUser.uid;
                const tutorialUUID = state$.value.tutorial.uuid;

                return from(currentUser.delete())
                  .pipe(
                    map(() => {
                      return auth.signInWithCredential(credential).then((userCredentials) => {
                        const newUserUUID = userCredentials.user.uid;
                        moveDataToOtherUser(oldUserUUID, newUserUUID, tutorialUUID);
                      });
                    })
                  );
              }
            }));
      },
    ),
    ignoreElements()
  );
};


function moveDataToOtherUser(oldUserUUID: string, newUserUUID: string, tutorialUUID: string) {
  firebase.firestore().collection(`responses`)
    .doc(`${oldUserUUID}/tutorials/${tutorialUUID}`)
    .get()
    .then((snapshot) => {
      const data = snapshot.data();

      //save data to the new newUserUUID
      return firebase.firestore()
        .collection(`responses`)
        .doc(`${newUserUUID}/tutorials/${tutorialUUID}`)
        .set(data)
        .then(() => {
          console.log(`Data saved to new user(${newUserUUID})!`)

          // delete data from oldUserUUID
          return firebase.firestore()
            .collection(`responses`)
            .doc(oldUserUUID)
            .delete()
            .then(() => {
              console.log(`Data from old user(${oldUserUUID}) deleted!`)
            })
        });
    });
}
