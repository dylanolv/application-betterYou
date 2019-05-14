import React from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Card, CardItem, Text, Body, Button } from 'native-base';
import * as firebase from "firebase";

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: "Compte"
  };

  // Utilisation de isMounted pour éviter l'erreur "Can't call setState (or forceUpdate) on an unmounted component"
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
    // isMounted à true pour notifier que le component est monté
    this._isMounted = true;
  }

  componentWillUnmount() {
    // isMounted à false pour notifier que le component est démonté
    this._isMounted = false;
  }

  // On récupère les infos du user connecté sur firebase
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

  // Au clique sur le bouton se déconnecter on se logout de firebase et on revnvoie à l'authentification
  logout() {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate("AuthStack");
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