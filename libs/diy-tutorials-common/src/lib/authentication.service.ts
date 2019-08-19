import * as firebase from 'firebase';

export function logout() {
  firebase.auth().signOut()
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

