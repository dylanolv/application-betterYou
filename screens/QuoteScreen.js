import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Container, Content, Card, CardItem, Text, Icon, Body } from 'native-base';
import * as firebase from "firebase";

// To hide the yellowbox
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class QuoteScreen extends Component {
  static navigationOptions = {
    title: "Better thoughts"
  };

  constructor(props) {
    super(props);
    this.state = { loading: true, items: [] };
  }

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

        let RandomNumber = Math.floor(Math.random() * i) + 1;
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
                <Icon name='md-quote' style={[styles.iconQuote, styles.iconQuote1]}/>
                <Text style={[styles.content]}>{this.state.items.content}</Text>
                <Icon name='md-quote' style={[styles.iconQuote, styles.iconQuote2]}/>
                <Text style={[styles.author]}>{this.state.items.author}</Text>
              </Body>
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
    color: '#008ba3',
    padding: 20
  },
  iconQuote1: {
    transform: [
      { rotate: '180deg' }
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
    alignSelf: 'center'
  },
  content: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center'
  }
});
