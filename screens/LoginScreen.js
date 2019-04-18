import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as firebase from "firebase";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label
} from "native-base";

// firebase.initializeApp({
//   apiKey: "AIzaSyC5eEj4GDdNByeljnixIhkfE2iKKfQBEeI",
//   authDomain: "betteryou-5e5bb.firebaseapp.com",
//   databaseURL: "https://betteryou-5e5bb.firebaseio.com",
//   projectId: "betteryou-5e5bb",
//   storageBucket: "betteryou-5e5bb.appspot.com",
//   messagingSenderId: "916847466152"
// });

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", email: "", password: "", error: "", loading: false };
  }

  onLoginPress() {
    this.setState({ error: "", loading: true });

    const { username, email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ error: "", loading: false });
        this.props.navigation.navigate("HomeStack");
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // ...
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var displayName = user.displayName;
          console.log(displayName);
        }
      });
  }

  onSignUpPress() {
    this.setState({ error: "", loading: true });

    const { username, email, password } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ error: "", loading: false });
        this.props.navigation.navigate("HomeStack");
      })
      .catch(() => {
        this.setState({ error: "Inscription failed", loading: false });
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
           // Updates the user attributes:
          user.updateProfile({ // <-- Update Method here
            displayName: username
          }).then(function() {
            // Profile updated successfully!
            var displayName = user.displayName;
            console.log(displayName);
          }, function(error) {
            // An error happened.
          });     
        }
      });
  }

  renderButtonOrLoading() {
    if (this.state.loading) {
      return <Text>Loading...</Text>;
    }
    return (
      <View>
        <Button rounded onPress={this.onLoginPress.bind(this)} title="Login" />
        <Button
          rounded
          onPress={this.onSignUpPress.bind(this)}
          title="Signup"
        />
      </View>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <View>

            <Item stackedLabel>
              <Label>Username</Label>
              <Input
                onChangeText={username => this.setState({ username })}
                placeholder="Username"
              />
            </Item>
            
            <Item stackedLabel>
              <Label>E-mail</Label>
              <Input
                onChangeText={email => this.setState({ email })}
                placeholder="E-mail"
              />
            </Item>

            <Item stackedLabel last>
              <Label>Password</Label>
              <Input
                onChangeText={password => this.setState({ password })}
                secureTextEntry
                placeholder="*******"
              />
            </Item>

            <Text>{this.state.error}</Text>

            {this.renderButtonOrLoading()}

          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30
  }
});
