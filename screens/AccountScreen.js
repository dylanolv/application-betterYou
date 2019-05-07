import React from "react";
import { AsyncStorage, View, StyleSheet } from "react-native";
import { Text, Button } from "native-base";
import * as firebase from "firebase";

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: "Account"
  };

  constructor(props) {
    super(props)
    this.state = {};
  }

  componentWillMount(){
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }
  
  load = () => {
    this.getUserData();
  }

  getUserData() {
    //Check if userData is stored on device else open Login
    AsyncStorage.getItem('userData').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      console.log(user_data.uid)
      if (user_data != null) {
        this.props.navigation.navigate("AccountStack");
      }
      else {
        this.props.navigation.navigate("DiscoveriesStack");
      }
    });
  }

  logout() {
  //   // logout, once that is complete, return the user to the login screen.
    AsyncStorage.removeItem('userData').then(() => {
      firebase.auth().signOut().then(() => {
        this.props.navigation.goBack();
        this.props.navigation.navigate("Login");
      });  
    });
  }

  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <Button rounded style={styles.primaryButton} onPress={this.logout.bind(this)}>
          <Text>Se déconnecter</Text>
        </Button>
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
  },
  primaryButton: {
    margin: 10,
    padding: 15,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#67BBF2"
  }
});