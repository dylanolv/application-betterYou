import { Alert, View, ActivityIndicator, StyleSheet } from "react-native";
import { Container, Content, Input, Icon, Text, Button, Form, Item } from "native-base";
import React, { Component } from "react";
import * as firebase from "firebase";

export default class LoginScreen extends Component {
    static navigationOptions = {
      title: "Connexion"
    };

    constructor(props) {
      super(props);

      this.state = {
        email: "",
        password: "",
        loading: false
      };
    }

    login() {
      this.setState({
        loading: true
      });

      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(userData => {
          this.props.navigation.navigate("AuthLoading");
        })
        .catch(error => {
          this.setState({ email: "", password: "", loading: false });
          Alert.alert(
            'Problème de connexion',
            'La connexion à échouée, veuillez réessayer',
            [
              {text: 'Ok'}
            ]
          );
        });
    }

	  // putUserInAsyncStorage = async () => {
    //   try {
    //     await AsyncStorage.setItem("userData", JSON.stringify(this.state.user));
    //   } 
    //   catch (error) {
    //     console.log(error);
    //   }
    // }

    // getUserInAsynStorage = async () => {
    //   // try {
    //   //   const userData = await AsyncStorage.getItem('userData');
    //   //   if (userData !== null) {
    //   //     let user = JSON.parse(userData)

    //   //     Object.keys(user).map(function(key) {
    //   //       console.log(user.user.uid)
    //   //     });
    //   //   }
    //   //   // AsyncStorage.clear()
    //   //   // AsyncStorage.getAllKeys().then(async (keys) => {
    //   //   //   AsyncStorage.multiGet(keys).then(async (result) => {
    //   //   //     console.log('result :', result);
    //   //   //   })
    //   //   // })
    //   // } catch (error) {
    //   //   console.log(error);
    //   // }

    //   // firebase.auth().onAuthStateChanged((user) => {
    //   //   if (user) {
    //   //     var uid = user.uid;
    //   //     console.log(uid)
    //   //   }
    //   // });
    // };
  
    goToSignup() {
      this.setState({ email: "", password: "" })
      this.props.navigation.navigate("Signup");
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
          <Container style={[styles.container, styles.horizontal]}>
            <Content>
              <Form>
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
                <Button rounded style={[styles.buttonFirst, styles.primaryButton]} onPress={this.login.bind(this)}>
                  <Text>Se connecter</Text>
                </Button>
                <Button rounded onPress={this.goToSignup.bind(this)} style={styles.primaryButton}>
                  <Text>S'inscrire</Text>
                </Button>
              </Form>
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
    backgroundColor: "#67BBF2",
    width: 170
  }
});
