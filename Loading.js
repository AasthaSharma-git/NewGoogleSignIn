import * as React from 'react';
import { View,Text} from 'react-native';
import firebase from "firebase";

export default class Loading extends React.Component{
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              this.props.navigation.navigate("LogoutScreen");
            } else {
              this.props.navigation.navigate("LoginScreen");
            }
          });
    }
    render(){
        return(
            <View style={{marginTop:50}}>
              <Text>Loading....</Text>
            </View>
        )
    }
}