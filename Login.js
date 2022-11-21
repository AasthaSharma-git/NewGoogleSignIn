import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  Button
} from "react-native";
import * as AuthSession from 'expo-auth-session';
import firebase from "firebase";
export default class LoginScreen extends Component {




  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      console.log('Firebase user:' + firebaseUser)
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.

        var credential = firebase.auth.GoogleAuthProvider.credential(googleUser);
        console.log('Credentials:' + credential)
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: "dark"// this wasnt here ?

                })
                .then(function (snapshot) {
                  console.log('Sign in successful!')
                });
            }
          })
          .catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(errorMessage)
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  authorize = async () => {
    try {
      const url = AuthSession.getRedirectUrl('redirect');
      const clientId='840650809068-ha6707p0j8bc2dnddla1gksntopep6ce.apps.googleusercontent.com'
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&response_type=id_token&nonce=nonce&state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2.example.com%2Ftoken&redirect_uri=${url}&client_id=${clientId}`
      var response = await AuthSession.startAsync({ authUrl })



      if (response.type === "success") {

        this.onSignIn(response.params.id_token)
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  render() {
    return (
      <View style={{ marginTop: 200 }}>
        <Button
          title="Login"
          onPress={
            this.authorize
          }
        />
      </View>

    );
  }
}
