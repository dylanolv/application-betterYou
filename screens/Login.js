"use strict";
import {
  AppRegistry,
  AsyncStorage,
  View,
  ToolbarAndroid,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import {
  Header,
  Container,
  Title,
  Content,
  List,
  ListItem,
  InputGroup,
  Input,
  Icon,
  Text,
  Picker,
  Button
} from "native-base";
import React, { Component } from "react";
import * as firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyC5eEj4GDdNByeljnixIhkfE2iKKfQBEeI",
  authDomain: "betteryou-5e5bb.firebaseapp.com",
  databaseURL: "https://betteryou-5e5bb.firebaseio.com",
  projectId: "betteryou-5e5bb",
  storageBucket: "betteryou-5e5bb.appspot.com",
  messagingSenderId: "916847466152"
});

export default class Login extends Component {
  constructor(props) {
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
    this.state = {
      loading: false,
      email: "",
      password: ""
    };
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? (
      <View style={styles.body}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <Content>
        <List>
          <ListItem>
            <InputGroup>
              <Icon name="ios-person" style={{ color: "#0A69FE" }} />
              <Input
                onChangeText={text => this.setState({ email: text })}
                value={this.state.email}
                placeholder={"Email Address"}
              />
            </InputGroup>
          </ListItem>
          <ListItem>
            <InputGroup>
              <Icon name="ios-unlock" style={{ color: "#0A69FE" }} />
              <Input
                onChangeText={text => this.setState({ password: text })}
                value={this.state.password}
                secureTextEntry={true}
                placeholder={"Password"}
              />
            </InputGroup>
          </ListItem>
        </List>
        <Button style={styles.primaryButton} onPress={this.login.bind(this)}>
          <Text>Login</Text>
        </Button>
        <Button
          onPress={this.goToSignup.bind(this)}
          style={styles.primaryButton}
        >
          <Text> New Here?</Text>
        </Button>
      </Content>
    );
    // A simple UI with a toolbar, and content below it.
    return (
      <Container>
        <Header>
          <Title>Login</Title>
        </Header>

        {content}
      </Container>
    );
  }

  login() {
    this.setState({
      loading: true
    });
    // Log in and display an alert to tell the user what happened.
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(userData => {
        this.setState({
          loading: false
        });
        AsyncStorage.setItem("userData", JSON.stringify(userData));

        this.props.navigation.navigate("Main");
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        alert("Login Failed. Please try again" + error);
      });
  }

  // Go to the signup page
  goToSignup() {
    this.props.navigator.push({
      component: Signup
    });
  }
}

AppRegistry.registerComponent("Login", () => Login);
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
    alignSelf: "center",
    backgroundColor: "blue",
    width: 150
  }
});
