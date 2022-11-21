import * as React from 'react';
import { View,Button } from 'react-native';
import firebase from "firebase";

export default class Logout extends React.Component{
    render(){
        return(
            <View style={{marginTop:50}}>
                <Button title='Logout'
                onPress={()=>firebase.auth().signOut()}/>
            </View>
        )
    }
}