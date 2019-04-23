import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as firebase from "firebase";

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
      .once("value", snapshot => {
        let childData = [];
        let i = 0;

        snapshot.forEach(function(childSnapshot) {
          childData.push(childSnapshot.val());
          i++;
        });

        let RandomNumber = Math.floor(Math.random() * i) + 1;
        quoteSelected = childData[RandomNumber];
        this.setState({ loadin: false, items: quoteSelected });
      });
  }

  componentDidMount() {
    this.getRandomQuote();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.items.author}</Text>
        <Text>{this.state.items.content}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  }
});
