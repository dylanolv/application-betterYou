import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Container, Content, Card, CardItem, Text, Icon, Body, Button } from 'native-base';
import * as firebase from "firebase";

export default class QuoteScreen extends Component {
  static navigationOptions = {
    title: "Citations"
  };

  constructor(props) {
    super(props);
    this.state = { loading: true, items: [] };
  }

  // Fonction qui récupère les citation firebase database puis en renvoie une à la fois au hasard
  getRandomQuote() {
    firebase
      .database()
      .ref("quotes/")
      .on("value", snapshot => {
        let childData = [];
        let i = 0;

        snapshot.forEach(function(childSnapshot) {
          childData.push(childSnapshot.val());
          i++;
        });

        let RandomNumber = Math.floor(Math.random() * i);
        quoteSelected = childData[RandomNumber];
        this.setState({ loading: false, items: quoteSelected });
      });
  }

  componentDidMount() {
    this.getRandomQuote();
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
        <Content padder>
          <Card>
            <CardItem bordered>
              <Body>
                <Icon name='quote' style={[styles.iconQuote, styles.iconQuote1]}/>
                <Text style={[styles.content]}>{this.state.items.content}</Text>
                <Icon name='quote' style={[styles.iconQuote, styles.iconQuote2]}/>
                <Text style={[styles.author]}>{this.state.items.author}</Text>
              </Body>
            </CardItem> 
            <CardItem style={{justifyContent: 'center'}}>
              <Button rounded style={[styles.btnShuffle]} onPress={this.getRandomQuote.bind(this)}>
                <Icon name='shuffle'/>
                <Text>Citation au hasard</Text>
              </Button>
            </CardItem>
          </Card>
        </Content>
        </Container>
      );
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
  iconQuote: {
    fontSize: 60,
    color: '#67BBF2',
    padding: 20
  },
  iconQuote1: {
    transform: [
      { scaleX: -1 }
    ],
    alignSelf: 'flex-start'
  },
  iconQuote2: {
    transform: [
      { rotate: '180deg' },
      { scaleX: -1 }
    ],
    alignSelf: 'flex-end'
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
  btnShuffle: {
    margin: 10,
    padding: 15,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#288bbf"
  }
});
