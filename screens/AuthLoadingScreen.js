import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as firebase from "firebase";

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Si l'utilisateur n'est pas conneté on envoie à l'authentification sinon au main
    _bootstrapAsync = async () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate('Main');
            }
            else {
                this.props.navigation.navigate('Auth');
            }
        })
    };

    render() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#67BBF2" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
  });