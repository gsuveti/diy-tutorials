import * as firebase from 'firebase/app';
import {getUserData} from './+state/tutorial.actions';

export function logout() {
  firebase.auth().signOut();
}


export function setAuthPersistence() {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log("Auth persistence set to LOCAL");
    })
    .catch(function (error) {
      console.log("Unable to set auth persistence to LOCAL");
    });
}


export function watchAuthState(store) {
  firebase.auth().onAuthStateChanged(function (user: firebase.User) {
    store.dispatch(getUserData(user));
  });

}

