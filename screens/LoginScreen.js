import { AsyncStorage, View, ActivityIndicator, StyleSheet } from "react-native";
import { Header, Container, Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Button } from "native-base";
import React, { Component } from "react";
import * as firebase from "firebase";

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: "Login"
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false
    };
  }

  render() {
    const content = this.state.loading ? (
      <View style={styles.body}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <Content>
        <List>
          <ListItem>
            <InputGroup>
                <Icon name="ios-person" style={{ color: "#67BBF2" }} />
                <Input
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  placeholder={"Email Address"}
                />
            </InputGroup>
          </ListItem>

          <ListItem>
            <InputGroup>
                <Icon name="ios-unlock" style={{ color: "#67BBF2" }} />
                <Input
                  onChangeText={text => this.setState({ password: text })}
                  value={this.state.password}
                  secureTextEntry={true}
                  placeholder={"Password"}
                />
            </InputGroup>
          </ListItem>
        </List>

        <Button rounded style={styles.primaryButton} onPress={this.login.bind(this)}>
          <Text>Login</Text>
        </Button>

        <Button rounded onPress={this.goToSignup.bind(this)} style={styles.primaryButton}>
          <Text> New Here?</Text>
        </Button>

      </Content>
    );
    
    return (
      <Container>
        {content}
      </Container>
    );
  }

  login() {
    this.setState({
      loading: true
    });

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(userData => {
        this.setState({ loading: false });
        AsyncStorage.setItem("userData", JSON.stringify(userData));
        this.props.navigation.navigate("DiscoveriesStack");
      })
      .catch(error => {
        this.setState({ loading: false });
        alert("Login Failed. Please try again" + error);
      });

    // Get the username if user exist
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var displayName = user.displayName;
        console.log(displayName);
      }
    });
  }

  // Go to the signup page
  goToSignup() {
    this.props.navigation.navigate("Signup");
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
