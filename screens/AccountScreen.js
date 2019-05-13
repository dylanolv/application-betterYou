import React from "react";
import { View, StyleSheet, ActivityIndicator, AsyncStorage } from "react-native";
import { Container, Content, Card, CardItem, Text, Icon, Body, Button } from 'native-base';
import * as firebase from "firebase";

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: "Compte"
  };

  _isMounted = false;

  constructor(props) {
    super(props)
    this.state = {
      displayName: '',
      email: '',
    };
    this.getUserData();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getUserData() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let providerData = user.providerData
        providerData.map((item) => {
          if (this._isMounted) {
            this.setState({displayName: item.displayName, email: item.email });
          }
        })
      }
    })
  }

  logout() {
    AsyncStorage.removeItem('userData').then(() => {
      firebase.auth().signOut().then(() => {
        this.props.navigation.navigate("AuthStack");
      });  
    });
  }

  render() {
    return (
      <Container style={[styles.container, styles.horizontal]}>
      <Content padder>
        <Card>
          <CardItem>
            <Body>
              <Text style={[styles.title]}>Vos informations</Text>
              <Text>Nom d'utilisateur</Text><Text style={[styles.user]}>{this.state.displayName}</Text>
              <Text>Adresse e-mail</Text><Text style={[styles.user]}>{this.state.email}</Text>
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <Button rounded style={styles.primaryButton} onPress={this.logout.bind(this)}>
                <Text>Se déconnecter</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
      </Content>
      </Container>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10
  },
  user: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10
  },
  email: {
    fontWeight: 'bold',
    fontSize: 16
  },
  primaryButton: {
    margin: 10,
    padding: 15,
    alignSelf: 'center',
    backgroundColor: "#288bbf"
  }
});