import * as React from 'react';
import { View,Button } from 'react-native';
import {createSwitchNavigator,createAppContainer} from 'react-navigation';
import Logout from './Logout';
import Loading from './Loading';
import firebase from "firebase";
import { firebaseConfig } from "./config";
import Login from './Login'
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}
else{
  firebase.app()
}

const AppNavigator=createSwitchNavigator({
  LoadingScreen:Loading,
  LoginScreen:Login,
  LogoutScreen:Logout
})
const AppContainer=createAppContainer(AppNavigator)


export default class App extends React.Component{
  
 
  render(){
    return(<AppContainer/>)
   
  }
}

