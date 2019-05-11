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
          <CardItem bordered>
            <Body>
              <Text style={[styles.title]}>Vos informations</Text>
              <Text style={[styles.user]}>{this.state.displayName}</Text>
              <Text style={[styles.email]}>{this.state.email}</Text>
            </Body>
            <Button rounded style={styles.primaryButton} onPress={this.logout.bind(this)}>
              <Text>Se déconnecter</Text>
            </Button>
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
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10
  },
  content: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center'
  },
  primaryButton: {
    margin: 10,
    padding: 15,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#67BBF2"
  }
});