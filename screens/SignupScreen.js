import { KeyboardAvoidingView, Alert, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Container, Content, Input, Icon, Text, Button, Form, Item } from "native-base";
import React, { Component } from 'react';
import * as firebase from 'firebase';

export default class SignupScreen extends Component {
  static navigationOptions = {
    title: "Inscription"
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

    this.setState({ loading: true });

    // Fonction firebase qui crée un user, suivi du login pour resté connecté après s'être inscrit
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(userData => {
          this.props.navigation.navigate("AuthLoading");
          Alert.alert(
            'Compte créé',
            'Votre compte a été créé avec succès',
            [
              {text: 'Ok'}
            ]
          );
        })
      })
      .catch((error) => {
        if (error != null) {
          this.setState({ username: '', email: '', password: '', loading: false });
          Alert.alert(
            'Problème lors de la création',
            'Un problème est surrvenu lors de la création de votre compte, veuillez réessayer',
            [
              {text: 'Ok'}
            ]
          );
        }
      });
    
    // Lorsque l'on s'inscrit on ajout le username dans le user sur firebase et l'on crée l'endroit 
    // ou l'on stockera les favoris, upvotes et downvotes du user dans firebase database
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.updateProfile({ displayName: username })
          .then(function () {
            firebase.database().ref('favorites/' + user.uid).set({
              tabId : '[]'
            });
            firebase.database().ref('upvotes/' + user.uid).set({
              tabId : '[]'
            });
            firebase.database().ref('downvotes/' + user.uid).set({
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
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <Container style={[styles.container, styles.horizontal]}>
            <Content>
              <Form>
                <Item  style={[styles.item]}>
                  <Icon name="person" style={{ color: "#67BBF2" }} />
                  <Input
                    autoCapitalize = 'none'
                    onChangeText={text => this.setState({ username: text })}
                    value={this.state.username}
                    placeholder={"Nom d'utilisateur"}
                  />
                </Item >
                <Item  style={[styles.item]}>
                  <Icon name="mail" style={{ color: "#67BBF2" }} />
                  <Input
                    autoCapitalize = 'none'
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                    placeholder={"E-mail"}
                  />
                </Item >
                <Item  style={[styles.item]}>
                  <Icon name="unlock" style={{ color: "#67BBF2" }} />
                  <Input
                    onChangeText={text => this.setState({ password: text })}
                    value={this.state.password}
                    secureTextEntry={true}
                    placeholder={"Mot de passe"}
                  />
                </Item >
                <Button rounded style={styles.primaryButton} onPress={this.signup.bind(this)}>
                  <Text>S'inscrire</Text>
                </Button>
                <Button rounded style={styles.primaryButton} onPress={this.goToLogin.bind(this)}>
                  <Text>Se connecter</Text>
                </Button>
              </Form>
            </Content>
          </Container>
        </KeyboardAvoidingView>
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
  item: {
    width: '70%',
    alignSelf: "center"
  },
  buttonFirst: {
    marginTop: 30,
  },
  primaryButton: {
    marginVertical: 10,
    padding: 15,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#288bbf",
    width: 170
  }
});
