import * as firebase from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;

export function loginWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  loginWithProvider(provider);
}

export function loginWithFacebook() {
  var provider = new firebase.auth.FacebookAuthProvider();
  loginWithProvider(provider);
}

export function loginAnonymously() {
  setTimeout(() => {
    const currentUser = firebase.auth().currentUser;
    console.log(currentUser);

    if (!currentUser) {
      firebase.auth().signInAnonymously()
        .catch(function (error) {
          console.error(error);
        });
    }
  }, 1000)
}

export function setAuthPersistence() {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log("Auth persistence set to LOCAL");
      loginAnonymously();
    })
    .catch(function (error) {
      console.log("Unable to set auth persistence to LOCAL");
    });
}


function loginWithProvider(provider: AuthProvider) {
  firebase.auth().currentUser.linkWithPopup(provider).then(function (result: firebase.auth.UserCredential) {
    console.log(result);
    // This gives you a Google Access Token. You can use it to access the Google API.
    // var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}


