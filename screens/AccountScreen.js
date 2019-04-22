import React from "react";
import { AsyncStorage, View, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Header, Container, Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Button } from "native-base";
import { MonoText } from "../components/StyledText";
import * as firebase from "firebase";

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: "Account"
  };

  componentWillMount(){
    //Check if userData is stored on device else open Login
    AsyncStorage.getItem('userData').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      if(user_data != null){
        this.props.navigation.navigate("AccountStack");
      }else{
        this.props.navigation.navigate("LoginStack");
      }
    });

  }
  
  logout() {
    // logout, once that is complete, return the user to the login screen.
    AsyncStorage.removeItem('userData').then(() => {
      firebase.auth().signOut().then(() => {
        this.props.navigation.navigate("LoginStack");
      });  
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.logout.bind(this)}>
          <Text>Logout</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    flex: 1
  },
  body: {
    flex: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  },
  primaryButton: {
    margin: 10,
    padding: 15,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#67BBF2",
    width: 150
  }
});
