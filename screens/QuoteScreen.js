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
    title: "Quotes"
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
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    else {
      return (
        // <View style={styles.container}>
        //   <Text>{this.state.items.author}</Text>
        //   <Text>{this.state.items.content}</Text>
        // </View>
        <Container>
        <Content padder>
          <Card>
            <CardItem bordered>
              <Body>
                  <Text>{this.state.items.author}</Text>
                  <Icon name='md-quote' style={[styles.iconQuote, styles.iconQuoteFlip]}/>
                  <Text>{this.state.items.content}</Text>
                  <Icon name='md-quote' style={[styles.iconQuote, styles.iconQuoteRotate]}/>
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
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  iconQuote: {
    fontSize: 60,
    color: '#0000ff'
  },
  iconQuoteRotate: {
    transform: [{ rotate: '180deg'}]
  },
  iconQuoteFlip: {
    transform: [{ scaleX: -1}]
  }
});
