import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Header, Title, Container, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import React, { Component } from 'react';
import * as firebase from 'firebase';

export default class SignupScreen extends Component {
  static navigationOptions = {
    title: "S'inscrire"
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      loading: false
    }
  }

  signup() {
    const { username } = this.state;

    this.setState({ 
      loading: true 
    });

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        alert('Votre compte a été créé avec succès');
        this.setState({ username: '', email: '', password: '', loading: false });
        this.props.navigation.navigate("DiscoveriesStack");
      })
      .catch((error) => {
        this.setState({ username: '', email: '', password: '', loading: false });
        alert("Un problème est surrvenu lors de la création de votre compte, voici l'erreur : " + error.message);
      });

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.updateProfile({ displayName: username })
          .then(function () {
            firebase.database().ref('favorites/' + user.uid).set({
              tabId : '[]'
            });
          }, function (error) {
            console.log(error);
          });
      }
    });
  }

  goToLogin() {
    this.setState({ email: "", password: "" })
    this.props.navigation.navigate("Login");
  }

  render() {   
    if (this.state.loading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#67BBF2" />
        </View>
      )
    }
    else {
      return (
        <Container>
          <Content>
            <List>
              <ListItem>
                <InputGroup>
                  <Icon name="person" style={{ color: '#67BBF2' }} />
                  <Input
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({ username: text })}
                    value={this.state.username}
                    placeholder={"Nom d'utilisateur"} />
                </InputGroup>
              </ListItem>
              <ListItem>
                <InputGroup>
                  <Icon name="mail" style={{ color: '#67BBF2' }} />
                  <Input
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({ email: text })}
                    value={this.state.email}
                    placeholder={"E-mail"} />
                </InputGroup>
              </ListItem>
              <ListItem>
                <InputGroup>
                  <Icon name="unlock" style={{ color: '#67BBF2' }} />
                  <Input
                    onChangeText={(text) => this.setState({ password: text })}
                    value={this.state.password}
                    secureTextEntry={true}
                    placeholder={"Mot de passe"} />
                </InputGroup>
              </ListItem>
            </List>
            <Button rounded style={styles.primaryButton} onPress={this.signup.bind(this)}>
              <Text>S'inscrire</Text>
            </Button>
            <Button rounded style={styles.primaryButton} onPress={this.goToLogin.bind(this)}>
              <Text>Se connecter</Text>
            </Button>
          </Content>
        </Container>
      )
    }  
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
    backgroundColor: "#67BBF2",
    width: 170
  }
});
